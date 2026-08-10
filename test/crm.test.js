'use strict';

const { test, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const crm = require('../src/crm');

const CRM_FILE = path.join(__dirname, '..', 'data', 'crm.json');

beforeEach(() => {
  if (fs.existsSync(CRM_FILE)) fs.unlinkSync(CRM_FILE);
});

test('upsert creates a lead and updates it in place', () => {
  const created = crm.upsertContact({ phone: '+1 (555) 555-0101', name: 'Ada' });
  assert.equal(created.phone, '+15555550101');
  assert.equal(created.stage, 'lead');

  const updated = crm.upsertContact({ phone: '+15555550101', name: 'Ada Lovelace' });
  assert.equal(updated.name, 'Ada Lovelace');
  assert.equal(crm.listContacts().length, 1);
});

test('stage transitions are validated', () => {
  crm.upsertContact({ phone: '+15555550102' });
  crm.setStage('+15555550102', 'qualified');
  assert.equal(crm.getContact('+15555550102').stage, 'qualified');
  assert.throws(() => crm.setStage('+15555550102', 'bogus'), /unknown stage/);
});

test('notes and activities accumulate', () => {
  crm.upsertContact({ phone: '+15555550103' });
  crm.addNote('+15555550103', 'asked to call back Tuesday');
  crm.recordActivity('+15555550103', 'call_dry_run', { flow: 'renewal' });
  const contact = crm.getContact('+15555550103');
  assert.equal(contact.notes.length, 1);
  assert.equal(contact.activities.length, 1);
});

test('sync imports the client list with consent intact', () => {
  const results = crm.syncFromClients();
  assert.ok(results.imported > 0);
  const consented = crm.listContacts({ consent: true });
  assert.ok(consented.length > 0);
  for (const c of consented) assert.equal(c.consent, true);
});

test('stats counts contacts by stage', () => {
  crm.upsertContact({ phone: '+15555550104' });
  crm.upsertContact({ phone: '+15555550105' });
  crm.setStage('+15555550105', 'customer');
  const s = crm.stats();
  assert.equal(s.total, 2);
  assert.equal(s.byStage.lead, 1);
  assert.equal(s.byStage.customer, 1);
});
