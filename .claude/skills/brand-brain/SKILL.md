---
name: brand-brain
description: Build or refresh the brand brain — a folder of markdown files distilling a brand's store, products, reviews, customers, competitors, and winning ads — that every other marketing skill reads before doing any work. Use whenever the user runs /brand-brain, gives a store URL to "learn" or "scrape", asks to set up brand context, or asks for marketing output (ads, photos, UGC, copy) when no brand-brain/ folder exists yet — build the brain first, then do the task.
---

# Brand Brain

The brand brain is the foundation of the marketing skill stack. It is a folder
of six markdown files that captures everything Claude needs to sound like the
brand and sell like the brand — so photoshoots, ad batches, and UGC scripts all
ship on-brand without the user re-explaining their business every time.

**Every other marketing skill in this pack reads this folder first.** If it
doesn't exist, offer to build it before producing creative.

## Output location

Write to `brand-brain/` at the project root (create it if missing). If a brain
already exists, refresh files in place rather than starting over — preserve any
hand edits the user made (look for content that doesn't trace back to scraped
sources and keep it).

## The six files

Produce exactly these files:

| File | Contents |
|---|---|
| `brain.md` | Executive summary: what the brand is, one-line positioning, voice in three adjectives, the #1 selling angle. The file another skill reads when it only has room for one. |
| `brand-guidelines.md` | Voice and tone rules with do/don't examples, vocabulary the brand uses and avoids, visual identity notes (colors, packaging, photography style) observed from the store. |
| `products-and-positioning.md` | Each product: name, price, key claims, ingredients/specs, differentiators, and the objection each one answers. |
| `customer-avatars.md` | 3–5 concrete avatars written as people, not demographics — e.g. "the guy who sweats through drugstore sticks by 2pm." Pull the language from real reviews; quote them. |
| `competitors.md` | Named competitors, how the brand positions against each, and the us-vs-them contrasts that appear in reviews ("switched from X because…"). |
| `winning-ads.md` | Proven angles and hooks. Seed it from review language and any ads found; the winning-ads skill appends research here later. |

## How to build it

1. **Scrape the store.** Fetch the homepage, product pages, about page, and any
   reviews visible on-site (WebFetch/WebSearch). Note best sellers — they
   reveal what the market actually buys, which beats what the brand thinks it
   sells.
2. **Mine the reviews hardest.** Reviews are the highest-value input: they
   contain the customer's own words for the problem, the moment of doubt, and
   the payoff ("first stick that survives leg day"). Quote them verbatim in
   `customer-avatars.md` and `winning-ads.md` — verbatim customer language
   outperforms paraphrase in ads.
3. **Look for the brand's own ads.** Search the Meta Ad Library and the web for
   ads the brand is already running; note angles and longevity.
4. **Write the six files.** Keep each skimmable (under ~150 lines). These files
   are read by other skills mid-task, so front-load the load-bearing facts.
5. **Report back** with a one-screen summary: pages scraped, review count,
   files written, and the single strongest angle found.

## Ground rules

- Only scrape the user's own brand or brands they're openly researching as
  competitors. Public pages only — no logins, no bypassing access controls.
- Cite sources inside the files (URL per section) so a future refresh knows
  where facts came from.
- Never invent reviews, stats, or claims. If the store makes a claim ("92%
  still fresh at hour 24"), record where it appears; downstream ad skills must
  only use claims the brand can substantiate.
