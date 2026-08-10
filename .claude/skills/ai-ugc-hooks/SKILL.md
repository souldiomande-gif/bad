---
name: ai-ugc-hooks
description: Produce a batch of ten scroll-stopping UGC hook clips — ten different AI avatars, each 5–10 second script pulling a different psychological lever (skeptic, fear/health, status, curiosity, social proof, transformation…) — meant to be spliced onto the brand's best-performing ad body. Use whenever the user runs /ai-ugc-hooks or asks for UGC ads, hook variations, talking-head creator clips, "hooks for my winning ad", TikTok/Reels ad openers, or creator-style video ads without briefing real creators.
---

# AI UGC Hooks — The UGC Creators

Ten hook clips, ten different avatars, each script pulling a different
psychological lever. The hook is the only part of a video ad most viewers ever
see — so this skill batch-tests hooks, and the winner gets spliced onto the
brand's best-performing ad body.

## Read the brand brain first

Load `brand-brain/customer-avatars.md`, `winning-ads.md`, and `brain.md`. The
scripts must sound like the brand's actual customers — the best hook lines are
usually a review quote lightly rewritten into first person speech. If no brand
brain exists, offer to run `brand-brain` first.

## Write the ten scripts

Each script: 1–2 spoken sentences (5–10 seconds), natural speech — the way a
person talks to a phone camera, not ad copy. Assign each a distinct lever and
label it:

| Lever | Example shape |
|---|---|
| skeptic | "My wife made me switch. I gave it one gym week to fail." |
| fear / health | "I read my deodorant label out loud. Never again." |
| status | "Barbers can tell what stick you use. Mine asked." |
| curiosity | "There's a reason it smells like a cabin, not cologne." |
| social proof | "Third friend this month who asked what I'm wearing." |
| transformation | the before → after in one line |
| us-vs-them | the old way, dismissed in one breath |
| secret / insider | "Nobody tells you this about aluminum sticks." |
| loss aversion | what it costs to keep using the old thing |
| identity | who you are when you use it |

Match each script to an avatar from `customer-avatars.md` — the skeptical
husband, the gym regular — and note the persona (age range, vibe, setting).
**Gate: show the ten scripts + personas and wait for sign-off before
generating video.** Scripts are cheap; renders aren't.

## Generate the clips

Use the video tools the session has. Higgsfield is the first choice — call
`get_workflow_instructions` and use its UGC / talking-head workflow, which
handles avatar + speech in one pipeline. Ten different AI avatars (vary age,
setting, energy — they should look like ten different customers, not one
actor in ten shirts). Vertical 9:16, product visible in hand where the script
references it. Batch-generate where supported.

Name files `hook-<NN>.mp4` with the lever in a manifest
(`hooks/<brand>/manifest.md`: file → lever → script → avatar), saved under
`hooks/<brand-or-campaign>/`.

## Ethics that keep the account alive

- These are AI avatars, not real customers: never present a clip as a real
  customer testimonial, never clone a real person's face or voice, and comply
  with the platform's AI-disclosure requirements when publishing.
- Scripts may only make claims the brand can substantiate
  (`products-and-positioning.md`) — a hook that gets the ad account banned
  isn't a winning hook.

## Deliver

Present the manifest plus the clips, and recommend which 2–3 hooks to splice
onto the existing winning ad body first, with one line on why (strongest
lever-avatar match, closest to proven review language).
