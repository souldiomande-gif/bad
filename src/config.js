'use strict';

// Centralised configuration. Everything is read from the environment so the
// same code runs in dev (ngrok) and prod without edits.

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  publicBaseUrl: (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, ''),

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    callerId: process.env.TWILIO_CALLER_ID || '',
  },

  voice: {
    // Amazon Polly Neural voices are licensed and ship with Twilio. We never
    // clone a real person's voice.
    voiceId: process.env.VOICE_ID || 'Polly.Joanna-Neural',
    language: process.env.VOICE_LANGUAGE || 'en-US',
  },

  llm: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-8',
  },

  identity: {
    company: process.env.COMPANY_NAME || 'Your Company',
    agent: process.env.AGENT_NAME || 'Ava',
  },
};

module.exports = config;
