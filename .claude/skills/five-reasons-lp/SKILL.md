---
name: five-reasons-lp
description: Write a "five reasons" listicle landing page — the advertorial format between the ad and the product page — plus a CRO audit of the existing page it replaces or feeds. Pulls angles, review quotes, and avatars from the brand brain so the page continues the ad's story. Use whenever the user runs /five-reasons-lp or asks for a landing page, advertorial, listicle page, pre-sell page, bridge page, "page for my ads", or a CRO audit / conversion review of a product or landing page.
---

# Five Reasons LP — The Copywriter + CRO

The listicle landing page ("5 Reasons Thousands of Guys Ditched Their Old
Deodorant…") is the workhorse pre-sell format in DTC: it sits between the ad
and the product page, continues the story the ad started, and warms a cold
click into a buyer. This skill writes that page and audits the page it feeds.

## Read the brand brain first

Load `brand-brain/` — especially `winning-ads.md` (the angle the ads are
running), `customer-avatars.md` (who is clicking), and
`products-and-positioning.md` (claims you're allowed to make). The page must
continue the winning ad's angle: if the ads lead with the aluminum-free fear
opener, reason #1 is the ingredient story — message match is the whole trick.
If no brand brain exists, offer to run `brand-brain` first.

## The page structure

Write these sections, in order:

1. **Headline** — the promise, framed as the listicle ("5 Reasons…"), speaking
   to one avatar, echoing the ad's hook.
2. **Lede** — 2–3 sentences of story from the avatar's life (the 2pm re-apply,
   the label read). First person or close third; advertorial voice, not brand
   voice.
3. **The five reasons** — each: benefit-first subhead, short proof paragraph,
   and evidence (verbatim review quote, substantiated stat, or us-vs-them
   contrast — pulled from the brain, never invented). Order: strongest angle
   first, price/offer last.
4. **Interruptions that convert** — after reason 2 and reason 5: a review wall
   (3–4 verbatim quotes with names as they appear publicly) and the offer
   block (price, guarantee, shipping).
5. **CTA** — one action, repeated after reason 3 and at the end. Button copy
   states the outcome, not "Submit".
6. **Objection sweep** — 3–5 FAQ items, each targeting a real purchase
   objection from `competitors.md` and the reviews.

Deliver as `lp/<brand-or-campaign>/five-reasons.md` (copy with layout notes),
plus a single-file HTML version if the user wants something viewable — keep it
mobile-first; nearly all paid-social traffic is mobile.

## The CRO audit

When the user has an existing page (URL or file), audit it before or alongside
the rewrite. Fetch it and score, concretely and with quotes from the page:

- **Message match** — does the page continue the ad's angle or reset to
  generic brand-speak?
- **Above the fold** — is the promise, product, and CTA visible without
  scrolling on mobile?
- **Proof density** — reviews/stats per screen; where does the page ask for
  trust it hasn't earned?
- **Friction** — navigation leaks, slow media, form fields, dead ends.
- **Clarity** — can a distracted reader say what this is and why it's better
  in 5 seconds?

Output the audit as a prioritized list: issue → evidence → fix, ordered by
expected conversion impact, top 3 flagged as "do these first".

## Ground rules

Advertorial format is fine; deception isn't. No fake countdown timers, no
invented reviews or "as seen in" logos, no claims beyond
`products-and-positioning.md`. If the page reads as editorial/news, include
the standard "advertisement" disclosure — ad platforms require it and
accounts get banned without it.
