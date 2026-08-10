---
name: instant-photoshoot
description: Turn one clean product photo into a full campaign photoshoot — studio hero, lifestyle scenes, macro detail, flatlay, and placement-specific frames — delivered as a named contact sheet. Use whenever the user runs /instant-photoshoot, provides a product photo and asks for product photography, "campaign shots", "lifestyle images", "PDP images", a "photoshoot", or needs a set of on-brand product images for ads or a store, without booking a studio.
---

# Instant Photoshoot

One clean product photo in, a full campaign shoot out. The job is a *shoot*,
not a single image: a set of frames spanning distinct scenes and use cases, all
showing the same product with the same label, so every frame is usable
interchangeably in ads, PDPs, and social.

## Before shooting

1. **Read the brand brain.** Load `brand-brain/brain.md` and the photography
   notes in `brand-guidelines.md` so scenes, props, and mood match the brand.
   If no `brand-brain/` folder exists, suggest running `brand-brain` first —
   or gather the minimum (product, audience, vibe) from the user and proceed.
2. **Get the reference photo.** Ask for one clean, well-lit product shot if not
   provided. Every generated frame must trace back to this reference so the
   product, label, and proportions stay consistent — image models drift on
   packaging text, so always generate *from* the reference (image-edit /
   image-to-image), never from a text prompt alone.

## Plan the shot list

Draft 10–15 frames before generating anything. Cover, at minimum:

- **Hero** — studio-style packshot, clean background, PDP-ready
- **Lifestyle** — 2–3 scenes where the customer actually uses it (pull the
  settings from `customer-avatars.md`: the gym bag, the barbershop counter,
  the bathroom shelf)
- **Macro** — texture/detail close-up (product surface, ingredients, material)
- **Flatlay** — product among the avatar's real belongings
- **Alt angles** — at least one dramatic/atmospheric hero variant

Name each frame in kebab-case with the brand, scene, and index —
`cedar-hero-spritz-01.jpg`, `cedar-gymbag-flatlay-02.jpg` — so a media buyer
can find frames without opening them.

Show the user the shot list before generating (it's their approval gate), then
generate without further pauses.

## Generate

Use the image tools available in this session, in order of preference: the
`nano-banana` skill, the Higgsfield image tools, or the pixa MCP — whichever is
present. Batch-generate where the tool supports it. For each frame, prompt with
the reference image plus scene direction, and keep lighting/grade consistent
across the set so the shoot reads as one campaign.

## Deliver

Present the frames as a contact sheet: filenames, one-line scene descriptions,
and a recommended SELECT for hero and PDP use. Flag any frame where the label
or product drifted from the reference — regenerate those rather than shipping
them. Save outputs under `shoots/<brand-or-campaign>/`.
