---
name: generate-50
description: Plan and produce a batch of 50 static ad creatives (default 50, any count works) from the brand brain — every angle a media buyer would ask for (review, stat, us-vs-them, POV, hook, offer, before/after, testimonial), each named and foldered with text baked into the image, ready to upload to Meta. Runs through three approval gates (plan → briefs → images) so the user signs off before anything is generated. Use whenever the user runs /generate-50 or asks for a batch of static ads, ad creatives, "statics", ad variations at volume, or a creative package for paid social.
---

# Generate 50 — The Ad Designer

One prompt against the brand brain and out comes a full static-ad batch:
every hook, angle, and image a media buyer would ask for, named and foldered.
The discipline that makes this work is the three approval gates — the user
signs off before anything spends a pixel.

## Read the brand brain first

Load `brand-brain/` in this order: `brain.md`, `winning-ads.md`,
`customer-avatars.md`, `products-and-positioning.md`. The batch's angles,
claims, and language all come from there — especially verbatim review quotes,
which become the review/testimonial ads. If no brand brain exists, offer to
run `brand-brain` first; a batch built on guesses wastes the whole run.

## Gate 1 — The plan

Propose the batch as a table: angle × count. Default distribution for 50:

| Angle | Count | What it is |
|---|---|---|
| review | 8 | Verbatim customer quote as the headline |
| stat | 6 | One substantiated number, huge |
| us-vs-them | 6 | Side-by-side vs "the old way" (checkmark/X columns) |
| pov | 6 | Meme-style relatable moment from an avatar's life |
| hook | 8 | Curiosity/pattern-interrupt headline |
| offer | 6 | The deal, plainly |
| before-after | 5 | The transformation |
| testimonial | 5 | Avatar-matched story ad |

Adjust angles and counts to the brand (drop before/after for products without
a visible transformation, etc.). Wait for sign-off.

## Gate 2 — The briefs

For every approved unit, write a one-line brief: headline (exact final copy),
visual direction, and source (which review/claim/avatar it traces to). Only
use claims that appear in `products-and-positioning.md` or on the store —
never invent stats or reviews. Present all briefs at once; wait for sign-off.

## Gate 3 — The images

Generate with whatever image tool the session has (`nano-banana` skill,
Higgsfield, or pixa — prefer batch endpoints). Rules that make statics usable:

- **Text is baked into the image** — headline legible at feed size (test:
  readable at 300px wide). Short headlines survive; paragraphs don't.
- **1:1 or 4:5** unless the user says otherwise (Meta feed placements).
- **Product from reference** — reuse `shoots/` frames from instant-photoshoot
  when they exist rather than regenerating the product and risking label drift.
- **Name every file** `<angle>-<index>.png` inside
  `ads/<brand-or-campaign>/` — e.g. `ads/cedar/usvsthem-02.png` — so the
  batch is navigable without opening files.

## Deliver

Show a contact-sheet summary: 4–6 representative images inline, plus the full
file listing grouped by angle, and a note on which units you'd test first and
why (strongest source material, clearest hook). Do not upload or publish
anywhere — the batch ends at files on disk for the user to launch.
