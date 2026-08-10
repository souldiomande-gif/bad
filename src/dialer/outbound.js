'use strict';

const config = require('../config');
const db = require('../store/db');
const compliance = require('../compliance');

// Places outbound calls to opted-in clients. Every number passes the compliance
// gate (consent + DNC + calling hours) BEFORE Twilio is asked to dial. Numbers
// that fail the gate are skipped and logged, never called.
//
// Usage:
//   node src/dialer/outbound.js <flow> [phone]
//   flow  = appointment | notification | renewal | servicing
//   phone = optional single number; if omitted, dials all eligible clients
//
// Add --dry-run to evaluate the gate and print decisions without dialing.

function buildClient() {
  if (!config.twilio.accountSid || !config.twilio.authToken) {
    throw new Error('Twilio credentials are not configured (see .env.example).');
  }
  // Lazy so dry runs work without node_modules/twilio installed.
  return require('twilio')(config.twilio.accountSid, config.twilio.authToken);
}

async function dialOne(restClient, phone, flow, { dryRun }) {
  const gate = compliance.canCall(phone);
  if (!gate.ok) {
    db.logEvent({ type: 'call_skipped', phone: db.normalize(phone), reason: gate.reason });
    return { phone, dialed: false, reason: gate.reason };
  }

  if (dryRun) {
    return { phone, dialed: false, reason: 'dry_run_ok' };
  }

  const answerUrl =
    `${config.publicBaseUrl}/voice/answer?flow=${encodeURIComponent(flow)}`;
  const statusUrl = `${config.publicBaseUrl}/voice/status`;

  const call = await restClient.calls.create({
    to: db.normalize(phone),
    from: config.twilio.callerId,
    url: answerUrl,
    method: 'POST',
    statusCallback: statusUrl,
    statusCallbackEvent: ['initiated', 'answered', 'completed'],
    // Hang up automatically if we hit an answering machine; we don't leave
    // pre-recorded messages without separate consent.
    machineDetection: 'Enable',
  });

  db.logEvent({ type: 'call_initiated', phone: db.normalize(phone), flow, callSid: call.sid });
  return { phone, dialed: true, callSid: call.sid };
}

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const positional = args.filter((a) => !a.startsWith('--'));
  const flow = positional[0] || 'servicing';
  const singlePhone = positional[1];

  const restClient = dryRun ? null : buildClient();

  const targets = singlePhone
    ? [{ phone: singlePhone }]
    : db.getClients();

  const results = [];
  for (const t of targets) {
    try {
      results.push(await dialOne(restClient, t.phone, flow, { dryRun }));
    } catch (err) {
      db.logEvent({ type: 'call_error', phone: db.normalize(t.phone), error: err.message });
      results.push({ phone: t.phone, dialed: false, reason: 'error', error: err.message });
    }
  }

  // eslint-disable-next-line no-console
  console.table(results);
}

if (require.main === module) {
  run().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { dialOne, run };
