# Claude Code skills & agents installed in this repo

Installed from the tool roundup (2026-08-10). These load automatically in any
Claude Code session opened in this repository.

## Installed

### skills/scroll-world
Source: https://github.com/oso95/scroll-world (MIT)

Builds an immersive scroll-scrubbed "fly through the world" 3D landing page for
any brand. Invoke it by asking Claude to build a scroll-world page.

Requirements before use:
- Higgsfield CLI authenticated (`higgsfield auth login`) — renders scene stills.
- Optionally the Monid CLI for the video chain (default biller, pay-per-clip USD;
  falls back to Higgsfield credits).
- `ffmpeg`/`ffprobe` on PATH.

Note: this skill generates paid AI images/video when run. A 1080p 6-scene build
is roughly $27 on the default backend — it states costs and checks balances, but
be aware before invoking it.

### agents/ (255 agents)
Source: https://github.com/msitarzewski/agency-agents (the "agency-agents"
roster — 17 divisions: engineering, design, marketing, sales, product, security,
testing, finance, healthcare, GIS, game development, and more).

Each file is a specialist subagent persona. Use them via the Agent tool or by
asking Claude to activate one, e.g. "activate Backend Architect mode".
To update: re-copy the division folders from the upstream repo.

## Not installable as skills (separate apps/services)

These were in the same roundup but are standalone software, not Claude Code
skills — install them on your machine if you want them:

- **OmniRoute** — self-hosted AI gateway: one endpoint routing to 268+ LLM
  providers with quota-aware fallback. `npm install -g omniroute`, dashboard on
  port 20128. https://github.com/diegosouzapw/OmniRoute
- **cognee** — persistent memory layer for AI agents (knowledge graph + vector
  store). Python: `pip install cognee`; it also ships an MCP server (`cognee-mcp`
  in the repo) you can add to Claude Code with `claude mcp add` if you want
  cross-session memory. https://github.com/topoteretes/cognee
- **voicebox** — local-first voice cloning / TTS desktop app (Mac/Win/Linux,
  Qwen3-TTS based, no cloud). Download from https://voicebox.sh — it's a GUI
  app with a local REST API, nothing to install in a repo.
