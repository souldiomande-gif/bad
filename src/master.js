'use strict';

const config = require('./config');
const db = require('./store/db');
const crm = require('./crm');
const compliance = require('./compliance');
const { dialOne } = require('./dialer/outbound');

// One command that runs the whole operation:
//
//   npm run master                  full pipeline, DRY RUN (default — safe)
//   npm run master -- run renewal --live    full pipeline, places real calls
//   npm run master -- status        environment + data health check
//   npm run master -- report        pipeline stats + recent activity
//   npm run master -- crm list [stage]
//   npm run master -- crm add <phone> [name...]
//   npm run master -- crm stage <phone> <stage>
//   npm run master -- crm note <phone> <text...>
//
// The pipeline: check environment -> sync clients into the CRM -> evaluate the
// compliance gate for every consented contact -> dial the eligible ones
// (dry-run unless --live) -> record every outcome as a CRM activity -> report.
// Dialing defaults to dry-run on purpose: one command should execute
// everything EXCEPT irreversibly calling people, unless you say --live.

function checkEnvironment() {
  const checks = [
    ['Twilio credentials', Boolean(config.twilio.accountSid && config.twilio.authToken)],
    ['Twilio caller ID', Boolean(config.twilio.callerId)],
    ['Public base URL (webhooks)', Boolean(config.publicBaseUrl)],
    ['Anthropic API key (AI brain; scripted fallback without it)', Boolean(config.llm.apiKey)],
    ['Client list present', db.getClients().length > 0],
  ];
  return checks.map(([name, ok]) => ({ check: name, ok }));
}

function printStatus() {
  console.table(checkEnvironment());
  const s = crm.stats();
  console.log(
    `CRM: ${s.total} contacts (${s.consented} consented) —`,
    Object.entries(s.byStage).map(([k, v]) => `${k}: ${v}`).join(', ')
  );
}

async function runPipeline(flow, { live }) {
  console.log(`master: flow=${flow} mode=${live ? 'LIVE' : 'dry-run'}`);

  const env = checkEnvironment();
  console.table(env);
  const dialable = env.find((e) => e.check === 'Twilio credentials').ok;
  if (live && !dialable) {
    throw new Error('--live requires Twilio credentials (see .env.example)');
  }

  const sync = crm.syncFromClients();
  console.log(
    `crm sync: ${sync.imported} imported, ${sync.updated} updated, ` +
      `${sync.markedLost} marked lost (DNC)`
  );

  const targets = crm.listContacts({ consent: true }).filter((c) => c.stage !== 'lost');
  console.log(`targets: ${targets.length} consented contacts`);

  const restClient = live ? require('twilio')(config.twilio.accountSid, config.twilio.authToken) : null;
  const results = [];
  for (const contact of targets) {
    try {
      const r = await dialOne(restClient, contact.phone, flow, { dryRun: !live });
      results.push(r);
      crm.recordActivity(contact.phone, live ? 'call' : 'call_dry_run', {
        flow,
        dialed: r.dialed,
        reason: r.reason,
      });
      if (r.dialed && contact.stage === 'lead') crm.setStage(contact.phone, 'contacted');
    } catch (err) {
      results.push({ phone: contact.phone, dialed: false, reason: 'error', error: err.message });
      crm.recordActivity(contact.phone, 'call_error', { flow, error: err.message });
    }
  }

  console.table(results);
  const dialed = results.filter((r) => r.dialed).length;
  const eligible = results.filter((r) => r.dialed || r.reason === 'dry_run_ok').length;
  const summary = { flow, live, targets: targets.length, eligible, dialed };
  db.logEvent({ type: 'master_run', ...summary });
  console.log(
    `done: ${eligible}/${targets.length} passed the compliance gate, ` +
      (live ? `${dialed} calls placed` : 'no calls placed (dry run — add --live to dial)')
  );
  return summary;
}

function printReport() {
  const s = crm.stats();
  console.log(`Pipeline (${s.total} contacts, ${s.consented} consented):`);
  console.table(
    Object.entries(s.byStage).map(([stage, count]) => ({ stage, count }))
  );
  const recent = crm
    .listContacts()
    .flatMap((c) => c.activities.map((a) => ({ phone: c.phone, name: c.name, at: a.at, type: a.type })))
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 15);
  if (recent.length) {
    console.log('Recent activity:');
    console.table(recent);
  }
}

function crmCommand(args) {
  const [action, ...rest] = args;
  switch (action) {
    case 'list': {
      const stage = rest[0];
      const contacts = crm.listContacts(stage ? { stage } : undefined);
      console.table(
        contacts.map((c) => ({
          phone: c.phone,
          name: c.name,
          stage: c.stage,
          consent: c.consent,
          activities: c.activities.length,
        }))
      );
      return;
    }
    case 'add': {
      const [phone, ...nameParts] = rest;
      const contact = crm.upsertContact({ phone, name: nameParts.join(' ') });
      console.log(`saved ${contact.phone} (${contact.name || 'unnamed'}) stage=${contact.stage}`);
      return;
    }
    case 'stage': {
      const [phone, stage] = rest;
      crm.setStage(phone, stage);
      console.log(`moved ${db.normalize(phone)} to ${stage}`);
      return;
    }
    case 'note': {
      const [phone, ...textParts] = rest;
      crm.addNote(phone, textParts.join(' '));
      console.log(`noted on ${db.normalize(phone)}`);
      return;
    }
    default:
      throw new Error(`unknown crm command "${action}" (expected list|add|stage|note)`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const live = args.includes('--live');
  const positional = args.filter((a) => !a.startsWith('--'));
  const command = positional[0] || 'run';

  switch (command) {
    case 'run':
      return runPipeline(positional[1] || 'servicing', { live });
    case 'status':
      return printStatus();
    case 'report':
      return printReport();
    case 'crm':
      return crmCommand(positional.slice(1));
    default:
      throw new Error(`unknown command "${command}" (expected run|status|report|crm)`);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { runPipeline, checkEnvironment };
