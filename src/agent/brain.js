'use strict';

const config = require('../config');
const { getFlow, fillTemplate } = require('./flows');

// The conversation brain. If an Anthropic API key is present it uses Claude to
// generate replies; otherwise it falls back to the deterministic per-flow
// script so the agent still works with zero LLM configuration.
//
// Whatever the backend, the system prompt below hard-codes the rules of
// engagement: be transparent, be honest, and respect refusal.

let anthropic = null;
function getClient() {
  if (anthropic || !config.llm.apiKey) return anthropic;
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    anthropic = new Anthropic({ apiKey: config.llm.apiKey });
  } catch (_) {
    anthropic = null; // SDK not installed; fall back to scripts.
  }
  return anthropic;
}

function systemPrompt(flow, context) {
  const { company, agent } = config.identity;
  return [
    `You are ${agent}, an automated voice assistant for ${company}. You are speaking with an`,
    `existing, opted-in client over the phone. You have already disclosed that you are an AI.`,
    ``,
    `Rules you must always follow:`,
    `- Be honest. Never claim to be human. If asked, confirm you are an AI assistant.`,
    `- Keep replies short and natural for speech: one or two sentences, no bullet points.`,
    `- Respect refusal immediately. If the client is not interested, do not push — wrap up politely.`,
    `- Never invent account numbers, balances, prices, guarantees, or financial returns.`,
    `- If you don't know something, say so and offer a human callback.`,
    ``,
    `Your objective for this call: ${flow.goalPrompt}`,
    context && context.knowledge ? `\nKnown facts you may use:\n${context.knowledge}` : '',
    context && context.message ? `\nNotification to deliver: ${context.message}` : '',
  ].join('\n');
}

// Returns a spoken reply string. `history` is an array of { role, text }.
async function respond({ flowName, context, history }) {
  const flow = getFlow(flowName);
  const client = getClient();

  if (!client) {
    // Deterministic fallback — no network calls.
    return fillTemplate(flow.fallback, context || {});
  }

  const messages = (history || []).map((turn) => ({
    role: turn.role === 'agent' ? 'assistant' : 'user',
    content: turn.text,
  }));
  // Ensure the conversation starts with a user turn for the API.
  if (messages.length === 0 || messages[0].role !== 'user') {
    messages.unshift({ role: 'user', content: '(call connected)' });
  }

  try {
    const res = await client.messages.create({
      model: config.llm.model,
      max_tokens: 150,
      system: systemPrompt(flow, context),
      messages,
    });
    const text = (res.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join(' ')
      .trim();
    return text || fillTemplate(flow.fallback, context || {});
  } catch (err) {
    // On any LLM error, degrade gracefully rather than dropping the call.
    return fillTemplate(flow.fallback, context || {});
  }
}

module.exports = { respond };
