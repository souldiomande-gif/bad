'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const compliance = require('../src/compliance');

test('opt-out phrases are detected', () => {
  for (const phrase of [
    'please STOP calling me',
    "I'm not interested",
    'take me off your list',
    'do not call again',
  ]) {
    assert.equal(compliance.wantsToOptOut(phrase), true, phrase);
  }
});

test('normal conversation is not an opt-out', () => {
  assert.equal(compliance.wantsToOptOut('yes that sounds good'), false);
  assert.equal(compliance.wantsToOptOut('what is the price'), false);
});

test('human handoff requests are detected', () => {
  assert.equal(compliance.wantsHuman('can I speak to a real person'), true);
  assert.equal(compliance.wantsHuman('put me through to an agent'), true);
});

test('disclosure names the company and states it is AI', () => {
  const text = compliance.disclosure();
  assert.match(text, /A-I assistant/);
  assert.match(text, /stop at any time/);
});

test('quiet hours guard rejects the middle of the night', () => {
  // 3am local for a UTC client.
  const threeAmOffset = 0;
  const realNow = Date.now;
  // Force "now" to 03:00 UTC.
  const d = new Date();
  d.setUTCHours(3, 0, 0, 0);
  Date.now = () => d.getTime();
  try {
    assert.equal(compliance.isQuietHours(threeAmOffset), true);
  } finally {
    Date.now = realNow;
  }
});
