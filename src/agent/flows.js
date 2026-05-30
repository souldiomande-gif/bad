'use strict';

// The four call purposes you selected. Each flow supplies:
//   - opening:   what the agent says right after the AI disclosure
//   - goalPrompt: guidance handed to the conversation brain (LLM)
//   - fallback:   a deterministic reply used when no LLM is configured
//
// Flows intentionally describe *helpful* objectives. There is no logic here for
// overriding a "no" — if a client declines or asks to stop, the server's
// compliance gate ends the call regardless of the flow.

const FLOWS = {
  appointment: {
    label: 'Appointment / callback booking',
    opening:
      "I'm reaching out to help you book a time with one of our specialists. " +
      'Would a callback work for you this week?',
    goalPrompt:
      'Your goal is to find out whether the client would like to book a callback or appointment, ' +
      'and if so, capture a rough day/time preference. Keep it brief and friendly. ' +
      'If they are not interested, thank them and offer to end the call.',
    fallback:
      'I can have a specialist call you back. What day and time generally suits you?',
  },

  notification: {
    label: 'Notifications / confirmations',
    opening:
      'I have a quick update about your account that I wanted to confirm with you directly.',
    goalPrompt:
      'Your goal is to deliver the notification in `context.message`, confirm the client heard it, ' +
      'and answer simple clarifying questions. Do not upsell. Keep it short.',
    fallback:
      "Here's the update: {{message}}. Did you get that okay, or would you like me to repeat it?",
  },

  renewal: {
    label: 'Renewals / re-engagement',
    opening:
      "I'm calling about your subscription with us — there's a renewal coming up and I wanted to check in.",
    goalPrompt:
      'Your goal is to remind the client about an upcoming renewal and ask whether they would like ' +
      'to continue, make a change, or speak to a human. Be transparent about pricing if asked. ' +
      'Never pressure; if they decline or hesitate, respect it and offer to follow up by email.',
    fallback:
      'Your plan renews soon. Would you like to continue as-is, make a change, or have someone email you the details?',
  },

  servicing: {
    label: 'Account servicing / support',
    opening: 'How can I help with your account today?',
    goalPrompt:
      'Your goal is to answer the client\'s account or support questions using only the facts in ' +
      '`context.knowledge`. If you do not know, say so and offer a human callback. Never invent ' +
      'account details, balances, or financial figures.',
    fallback:
      "I can help with that. Could you tell me a bit more about what you need, or I can have a specialist follow up?",
  },
};

function getFlow(name) {
  return FLOWS[name] || FLOWS.servicing;
}

function fillTemplate(text, context) {
  return String(text).replace(/\{\{(\w+)\}\}/g, (_, key) =>
    context && context[key] != null ? String(context[key]) : ''
  );
}

module.exports = { FLOWS, getFlow, fillTemplate };
