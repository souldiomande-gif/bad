'use strict';

const express = require('express');
const twilio = require('twilio');

const config = require('./config');
const db = require('./store/db');
const compliance = require('./compliance');
const brain = require('./agent/brain');
const { getFlow } = require('./agent/flows');
const { newResponse, say, gather } = require('./voice/twiml');

const app = express();
app.use(express.urlencoded({ extended: false }));

// In-memory call sessions keyed by Twilio CallSid. Fine for a single instance;
// move to Redis (or similar) before running more than one process.
const sessions = new Map();

function getSession(callSid) {
  if (!sessions.has(callSid)) {
    sessions.set(callSid, { history: [], flowName: 'servicing', context: {} });
  }
  return sessions.get(callSid);
}

// Validate that requests genuinely come from Twilio (skipped if no auth token,
// e.g. in local unit tests).
function verifyTwilio(req, res, next) {
  if (!config.twilio.authToken) return next();
  const signature = req.header('X-Twilio-Signature');
  const url = config.publicBaseUrl + req.originalUrl;
  const valid = twilio.validateRequest(config.twilio.authToken, signature, url, req.body || {});
  if (!valid) return res.status(403).send('Invalid Twilio signature');
  return next();
}

app.get('/health', (_req, res) => res.json({ ok: true }));

// ---- Call entry point ----------------------------------------------------
// The dialer points Twilio here with ?flow=<name> describing the call purpose.
app.post('/voice/answer', verifyTwilio, (req, res) => {
  const callSid = req.body.CallSid;
  const to = req.body.To;
  const flowName = req.query.flow || 'servicing';

  const session = getSession(callSid);
  session.flowName = flowName;
  const client = db.getClientByPhone(to);
  if (client && client.context) session.context = client.context;

  const flow = getFlow(flowName);
  db.logEvent({ type: 'call_answered', callSid, to: db.normalize(to), flow: flowName });

  const vr = newResponse();
  // 1) Mandatory AI disclosure, always first.
  say(vr, compliance.disclosure());
  // 2) Flow-specific opening, then listen.
  const opening = flow.opening;
  session.history.push({ role: 'agent', text: opening });
  gather(vr, opening, '/voice/turn');

  res.type('text/xml').send(vr.toString());
});

// ---- Each conversational turn --------------------------------------------
app.post('/voice/turn', verifyTwilio, async (req, res) => {
  const callSid = req.body.CallSid;
  const to = req.body.To;
  const speech = (req.body.SpeechResult || '').trim();
  const session = getSession(callSid);
  const vr = newResponse();

  // No speech captured — re-prompt once, then offer to end.
  if (!speech) {
    if (req.query.timeout) {
      say(vr, "I didn't catch that. I'll let you go for now — thank you, goodbye.");
      vr.hangup();
      return res.type('text/xml').send(vr.toString());
    }
    gather(vr, 'Sorry, could you say that again?', '/voice/turn');
    return res.type('text/xml').send(vr.toString());
  }

  session.history.push({ role: 'client', text: speech });
  db.logEvent({ type: 'client_turn', callSid, to: db.normalize(to), text: speech });

  // Compliance check FIRST — refusal always wins over the flow's objective.
  if (compliance.wantsToOptOut(speech)) {
    compliance.recordOptOut(to);
    say(
      vr,
      "Understood — I've removed you from our calling list and you won't receive these calls again. " +
        'Thank you for your time. Goodbye.'
    );
    vr.hangup();
    sessions.delete(callSid);
    return res.type('text/xml').send(vr.toString());
  }

  if (compliance.wantsHuman(speech)) {
    db.logEvent({ type: 'human_handoff', callSid, to: db.normalize(to) });
    say(
      vr,
      "Of course — I'll arrange for a member of our team to call you back as soon as possible. " +
        'Thanks, and goodbye.'
    );
    vr.hangup();
    sessions.delete(callSid);
    return res.type('text/xml').send(vr.toString());
  }

  // Otherwise, let the brain produce the next reply.
  const reply = await brain.respond({
    flowName: session.flowName,
    context: session.context,
    history: session.history,
  });
  session.history.push({ role: 'agent', text: reply });
  db.logEvent({ type: 'agent_turn', callSid, to: db.normalize(to), text: reply });

  gather(vr, reply, '/voice/turn');
  res.type('text/xml').send(vr.toString());
});

// ---- Call lifecycle status ----------------------------------------------
app.post('/voice/status', verifyTwilio, (req, res) => {
  const { CallSid, CallStatus } = req.body;
  db.logEvent({ type: 'call_status', callSid: CallSid, status: CallStatus });
  if (['completed', 'busy', 'failed', 'no-answer', 'canceled'].includes(CallStatus)) {
    sessions.delete(CallSid);
  }
  res.sendStatus(204);
});

if (require.main === module) {
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Compliant voice agent listening on :${config.port}`);
  });
}

module.exports = app;
