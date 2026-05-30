'use strict';

const twilio = require('twilio');
const config = require('../config');

const { VoiceResponse } = twilio.twiml;

// Helpers that build TwiML with our licensed neural voice baked in, so call
// handlers don't repeat voice/language settings everywhere.

function say(vr, text) {
  vr.say({ voice: config.voice.voiceId, language: config.voice.language }, text);
  return vr;
}

// Speak `text`, then listen for the caller's speech and POST the transcript to
// `actionPath`. `bargeIn` lets the caller interrupt the prompt (Twilio stops
// playback as soon as speech is detected).
function gather(vr, text, actionPath, { bargeIn = true } = {}) {
  const g = vr.gather({
    input: ['speech'],
    action: actionPath,
    method: 'POST',
    speechTimeout: 'auto',
    speechModel: 'experimental_conversations',
    bargeIn,
    language: config.voice.language,
  });
  g.say({ voice: config.voice.voiceId, language: config.voice.language }, text);
  // If the caller says nothing, fall through to a gentle re-prompt.
  vr.redirect({ method: 'POST' }, actionPath + '?timeout=1');
  return vr;
}

function newResponse() {
  return new VoiceResponse();
}

module.exports = { newResponse, say, gather };
