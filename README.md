# Compliant Outbound Voice Agent

An automated voice agent for calling your **own, opted-in clients** — for
appointment booking, notifications/confirmations, renewals, and account
servicing. Built on Twilio Programmable Voice with a Claude-powered
conversation brain (and deterministic scripted fallbacks).

It is deliberately built **compliant by design**:

- **Always discloses it is an AI** at the start of every call. This is the first
  thing the callee hears and cannot be turned off.
- **Uses licensed neural voices only** (Amazon Polly via Twilio). It does **not**
  clone any real person's voice.
- **Honors refusal instantly.** If a client says "stop", "not interested",
  "remove me", etc., the call ends and the number is added to the Do-Not-Call
  list automatically.
- **Offers a human at any time.** Asking for "a real person" triggers a handoff.
- **Gates every call before dialing** on: a client record exists, `consent: true`,
  not on the DNC list, and within local calling hours (09:00–20:00).
- **Logs everything** to an append-only call log for auditability.

> This tool is for contacting people who have opted in to hear from you. It is
> not built for cold-calling, for hiding that it's an AI, or for pressuring
> people past a "no" — and the code reflects that.

## Architecture

```
Dialer (outbound.js) ──> compliance gate ──> Twilio places call
                                                   │
                                                   ▼
Twilio  ──webhook──>  server.js  /voice/answer   (AI disclosure + opening)
                                  /voice/turn     (each spoken turn)
                                  /voice/status   (lifecycle logging)
                                       │
                                       ▼
                       compliance (opt-out / human?) ──> brain (Claude or script)
```

## Setup

```bash
npm install
cp .env.example .env      # fill in Twilio creds, caller ID, PUBLIC_BASE_URL
```

`PUBLIC_BASE_URL` must be a URL Twilio can reach (e.g. an ngrok tunnel in dev,
your domain in prod).

## Run

Start the webhook server:

```bash
npm start
```

Dial clients (the dialer enforces the compliance gate first):

```bash
# Evaluate the gate for everyone without placing calls:
node src/dialer/outbound.js renewal --dry-run

# Dial all eligible clients for a renewal call:
node src/dialer/outbound.js renewal

# Dial a single number for an appointment call:
node src/dialer/outbound.js appointment +15555550101
```

Flows: `appointment`, `notification`, `renewal`, `servicing`.

## Data

- `data/clients.json` — your client list (gitignored; an example is in
  `data/clients.example.json`). Each entry needs `consent: true` to be callable.
- `data/dnc.json` — Do-Not-Call list (gitignored). Opt-outs are appended here
  automatically.
- `data/call-log.jsonl` — append-only audit log.

Swap the file-backed store in `src/store/db.js` for a real database before
production; the rest of the app only depends on its exported functions.

## Tests

```bash
npm test
```

## Compliance is your responsibility too

This code enforces sensible defaults, but you operate under your own
regulations (TCPA, GDPR/ePrivacy, the EU AI Act's transparency duties, local
calling-hours and recording-consent rules, and more). Confirm your consent
records, disclosure wording, and recording practices with counsel for the
jurisdictions you call into.
