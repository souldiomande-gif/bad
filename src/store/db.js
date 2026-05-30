'use strict';

const fs = require('fs');
const path = require('path');

// A deliberately tiny file-backed store. Swap for Postgres/Redis in production;
// the surface area (the functions exported below) is what the rest of the app
// depends on, so the implementation can change without touching call logic.

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');
const DNC_FILE = path.join(DATA_DIR, 'dnc.json');
const LOG_FILE = path.join(DATA_DIR, 'call-log.jsonl');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

// Normalise phone numbers to a comparable form (digits + leading +).
function normalize(phone) {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  const plus = trimmed.startsWith('+') ? '+' : '';
  return plus + trimmed.replace(/[^0-9]/g, '');
}

// ---- Clients -------------------------------------------------------------

function getClients() {
  // Falls back to the bundled example so the project runs out of the box.
  const file = fs.existsSync(CLIENTS_FILE)
    ? CLIENTS_FILE
    : path.join(DATA_DIR, 'clients.example.json');
  return readJson(file, []);
}

function getClientByPhone(phone) {
  const target = normalize(phone);
  return getClients().find((c) => normalize(c.phone) === target) || null;
}

// ---- Do-Not-Call list ----------------------------------------------------

function getDncList() {
  return readJson(DNC_FILE, []).map(normalize);
}

function isOnDnc(phone) {
  return getDncList().includes(normalize(phone));
}

function addToDnc(phone, reason) {
  const target = normalize(phone);
  if (!target) return;
  const list = readJson(DNC_FILE, []);
  if (!list.some((e) => normalize(e.phone || e) === target)) {
    list.push({ phone: target, reason: reason || 'opt-out', addedAt: new Date().toISOString() });
    writeJson(DNC_FILE, list);
  }
}

// ---- Append-only call log ------------------------------------------------

function logEvent(event) {
  ensureDataDir();
  const line = JSON.stringify({ at: new Date().toISOString(), ...event }) + '\n';
  fs.appendFileSync(LOG_FILE, line);
}

module.exports = {
  normalize,
  getClients,
  getClientByPhone,
  getDncList,
  isOnDnc,
  addToDnc,
  logEvent,
};
