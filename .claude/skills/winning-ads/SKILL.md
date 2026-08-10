---
name: winning-ads
description: Research the longest-running, highest-signal ads in a niche before creating any creative — sweep the Meta Ad Library and the web for competitor ads, rank them by how long they've been live (longevity ≈ money ≈ working), extract the winning angles and formats, and write the findings into brand-brain/winning-ads.md as briefs for the ad designer. Use whenever the user runs /winning-ads or asks for ad research, competitor ads, "what's working in my niche", winning ad patterns, or before a generate-50 batch when winning-ads.md is empty or stale.
---

# Winning Ads — The Ad Researcher

Create from proof, not guesses. Before the brand makes a single ad, find the
ads in its niche that have been running the longest and spending the most —
nobody keeps paying for an ad that doesn't work — and extract *why* they work
into briefs the ad designer can execute against.

## Read the brand brain first

Load `brain.md` and `competitors.md` to know the niche and who to sweep. If no
brand brain exists, ask for the niche and 3–5 competitor names, and suggest
running `brand-brain` after.

## The sweep

Work with the tools the session actually has, in order of preference:

1. **An ads-library MCP** if one is connected (search the available tools for
   ad-library/ads endpoints before assuming there isn't one).
2. **The Meta Ad Library on the web** (facebook.com/ads/library) via
   WebFetch/WebSearch — it's public and searchable by advertiser and keyword.
   TikTok's Creative Center top-ads listings likewise.
3. **General web search** for teardown articles, "best ads" roundups, and the
   competitors' own social pages as a fallback.

For each competitor and 2–3 niche keywords, collect ads and record: advertiser,
hook/headline, format (ugc / talking-head, static review, stat, us-vs-them,
demo, meme/pov, lifestyle), start date or days live if shown, and landing page
angle. **Sort by days live** — longevity is the closest public proxy for spend
and performance. Aim for a pool of ~50+ ads before extracting patterns; note
the actual count so the user knows the sample size.

## Extract the patterns

From the pool, distill:

- **Top angles** (ranked, with evidence): the fear/ingredient opener, the
  wear-test demo, the social-proof callout, the us-vs-them — whatever the
  niche's long-runners share.
- **Format mix**: what fraction of long-runners are UGC vs static vs demo.
- **Hook language**: verbatim first lines that recur.
- **Gaps**: angles no competitor is running that the brand's reviews support —
  these are the cheapest wins.

## Write it into the brain

Append the findings to `brand-brain/winning-ads.md` (create it if needed) as
ready-to-execute briefs: angle → example hooks → recommended format → source
ads. Date-stamp the section so staleness is visible. Then summarize for the
user: ads scanned, patterns found, and the top 3 briefs you'd hand to
`generate-50` or `ai-ugc-hooks` next.

## Ground rules

Research only public listings (ad libraries exist precisely for this). Use
competitor ads as *pattern* evidence — angles, formats, structures — never
copy their copy, claims, or assets into the brand's creative.
