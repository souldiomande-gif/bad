'use strict';

const config = require('../config');
const db = require('../store/db');

// ---------------------------------------------------------------------------
// Compliance is enforced as a hard gate, not a suggestion. Both the dialer
// (before placing a call) and the webhook server (during a call) route through
// the helpers here.
// ---------------------------------------------------------------------------

// The mandatory AI disclosure. This is the FIRST thing the callee hears on
// every call. Several jurisdictions (e.g. some US states, the EU AI Act's
// transparency rules) require disclosing that the caller is an AI; beyond the
// law, opted-in clients are entitled to know.
function disclosure() {
  const { company, agent } = config.identity;
  return (
    `Hi, this is ${agent}, an automated A-I assistant calling on behalf of ${company}. ` +
    `This call may be recorded. You can ask to speak to a person or to stop at any time.`
  );
}

// Phrases that mean "end the call" and/or "don't contact me again". Kept broad
// and matched case-insensitively. A person's refusal is always honored.
const OPT_OUT_PATTERNS = [
  /\bstop\b/i,
  /\bunsubscribe\b/i,
  /\bdo not call\b/i,
  /\bdon'?t call\b/i,
  /\bremove me\b/i,
  /\btake me off\b/i,
  /\bopt out\b/i,
  /\bnot interested\b/i,
  /\bleave me alone\b/i,
];

const HUMAN_PATTERNS = [
  /\b(real|human|person|agent|representative|someone)\b/i,
  /\bspeak to (a|someone)\b/i,
  /\btalk to (a|someone)\b/i,
];

function wantsToOptOut(text) {
  if (!text) return false;
  return OPT_OUT_PATTERNS.some((re) => re.test(text));
}

function wantsHuman(text) {
  if (!text) return false;
  return HUMAN_PATTERNS.some((re) => re.test(text));
}

// Gate run before any number is dialed. Returns { ok, reason }.
function canCall(phone) {
  const client = db.getClientByPhone(phone);
  if (!client) return { ok: false, reason: 'no_client_record' };
  if (client.consent !== true) return { ok: false, reason: 'no_consent' };
  if (db.isOnDnc(phone)) return { ok: false, reason: 'on_dnc' };
  if (isQuietHours(client.timezoneOffsetMinutes)) return { ok: false, reason: 'quiet_hours' };
  return { ok: true, client };
}

// Simple calling-hours guard (local 9:00–20:00). timezoneOffsetMinutes is the
// client's offset from UTC; defaults to the server's own offset if unknown.
function isQuietHours(timezoneOffsetMinutes) {
  const offset =
    typeof timezoneOffsetMinutes === 'number'
      ? timezoneOffsetMinutes
      : -new Date().getTimezoneOffset();
  const localMs = Date.now() + offset * 60 * 1000;
  const localHour = new Date(localMs).getUTCHours();
  return localHour < 9 || localHour >= 20;
}

// Record an opt-out: add to DNC and log it.
function recordOptOut(phone) {
  db.addToDnc(phone, 'caller requested opt-out');
  db.logEvent({ type: 'opt_out', phone: db.normalize(phone) });
}

module.exports = {
  disclosure,
  wantsToOptOut,
  wantsHuman,
  canCall,
  isQuietHours,
  recordOptOut,
};
