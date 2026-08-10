'use strict';

const fs = require('fs');
const path = require('path');
const db = require('../store/db');

// File-backed CRM built on the same pattern as store/db.js: the exported
// functions are the contract, the JSON file is an implementation detail you
// can swap for a real database later.
//
// A contact moves through a simple pipeline:
//   lead -> contacted -> qualified -> customer | lost
// Consent lives on the contact and is enforced by the compliance gate at call
// time — the CRM records it but never overrides it.

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const CRM_FILE = path.join(DATA_DIR, 'crm.json');

const STAGES = ['lead', 'contacted', 'qualified', 'customer', 'lost'];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function load() {
  try {
    return JSON.parse(fs.readFileSync(CRM_FILE, 'utf8'));
  } catch (_) {
    return { contacts: [] };
  }
}

function save(crm) {
  ensureDataDir();
  fs.writeFileSync(CRM_FILE, JSON.stringify(crm, null, 2));
}

function findByPhone(crm, phone) {
  const target = db.normalize(phone);
  return crm.contacts.find((c) => db.normalize(c.phone) === target) || null;
}

// Create or update a contact, keyed by phone number. Fields provided win over
// stored ones; everything else is preserved.
function upsertContact(fields) {
  const phone = db.normalize(fields.phone);
  if (!phone) throw new Error('a contact needs a phone number');

  const crm = load();
  const now = new Date().toISOString();
  let contact = findByPhone(crm, phone);

  if (!contact) {
    contact = {
      id: 'c_' + phone.replace('+', ''),
      phone,
      name: '',
      email: '',
      stage: 'lead',
      consent: false,
      tags: [],
      notes: [],
      activities: [],
      createdAt: now,
      updatedAt: now,
    };
    crm.contacts.push(contact);
  }

  const { phone: _ignored, ...rest } = fields;
  Object.assign(contact, rest, { updatedAt: now });
  save(crm);
  return contact;
}

function getContact(phone) {
  return findByPhone(load(), phone);
}

function listContacts(filter) {
  let contacts = load().contacts;
  if (filter && filter.stage) contacts = contacts.filter((c) => c.stage === filter.stage);
  if (filter && filter.consent !== undefined) {
    contacts = contacts.filter((c) => c.consent === filter.consent);
  }
  return contacts;
}

function setStage(phone, stage) {
  if (!STAGES.includes(stage)) {
    throw new Error(`unknown stage "${stage}" (expected one of: ${STAGES.join(', ')})`);
  }
  const contact = getContact(phone);
  if (!contact) throw new Error(`no contact with phone ${phone}`);
  return upsertContact({ phone, stage });
}

function addNote(phone, text) {
  const contact = getContact(phone);
  if (!contact) throw new Error(`no contact with phone ${phone}`);
  contact.notes.push({ at: new Date().toISOString(), text });
  return upsertContact({ phone, notes: contact.notes });
}

// Activities are the CRM-side mirror of the call log: one entry per touch.
function recordActivity(phone, type, detail) {
  const contact = getContact(phone);
  if (!contact) return null;
  contact.activities.push({ at: new Date().toISOString(), type, detail });
  return upsertContact({ phone, activities: contact.activities });
}

// Pull the dialer's client list into the CRM so both views agree. Clients are
// the source of truth for consent; DNC membership marks a contact lost.
function syncFromClients() {
  const results = { imported: 0, updated: 0, markedLost: 0 };
  for (const client of db.getClients()) {
    const existing = getContact(client.phone);
    upsertContact({
      phone: client.phone,
      name: client.name || (existing && existing.name) || '',
      consent: client.consent === true,
      timezone: client.timezone,
    });
    existing ? results.updated++ : results.imported++;
  }
  for (const contact of listContacts()) {
    if (db.isOnDnc(contact.phone) && contact.stage !== 'lost') {
      setStage(contact.phone, 'lost');
      recordActivity(contact.phone, 'dnc', 'on Do-Not-Call list');
      results.markedLost++;
    }
  }
  return results;
}

function stats() {
  const contacts = listContacts();
  const byStage = {};
  for (const s of STAGES) byStage[s] = 0;
  for (const c of contacts) byStage[c.stage] = (byStage[c.stage] || 0) + 1;
  return {
    total: contacts.length,
    consented: contacts.filter((c) => c.consent).length,
    byStage,
  };
}

module.exports = {
  STAGES,
  upsertContact,
  getContact,
  listContacts,
  setStage,
  addNote,
  recordActivity,
  syncFromClients,
  stats,
};
