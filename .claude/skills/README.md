# AI CMO skill pack

Five project skills that work as one marketing pipeline. Recreated from the
publicly visible descriptions of the "AI CMO" skill pack (the original is
distributed privately; these are independent implementations of the same
workflow ideas).

The pipeline:

```
brand-brain  ──────────  the foundation; every other skill reads it first
    │
    ├── winning-ads        research the niche's longest-running ads → briefs
    ├── instant-photoshoot one product photo → full campaign shoot
    ├── generate-50        brand brain → 50 static ads, 3 approval gates
    └── ai-ugc-hooks       10 hook clips, 10 avatars, 10 psychological levers
```

Typical order for a new brand:

1. `/brand-brain <store-url>` — scrape store, reviews, best sellers into `brand-brain/`
2. `/winning-ads` — research the niche, write briefs into `brand-brain/winning-ads.md`
3. `/instant-photoshoot` — build the image library from one reference photo
4. `/generate-50` — the static ad batch
5. `/ai-ugc-hooks` — video hook batch for splicing onto winners

Image/video generation uses whatever tools the session has (nano-banana,
Higgsfield, pixa). All generated assets land in `brand-brain/`, `shoots/`,
`ads/`, and `hooks/` at the project root.

Note: the original pack advertises six skills; only five were visible in the
source material, so five are implemented here.
