# SEO Audit — wordpress.supportperth.com.au (pre-deployment)
*2026-07-17 · Local-artifact audit (site not yet live) · 4 parallel specialists: technical, schema, content, local*

## Executive summary

**SEO Health Score: 74/100 at audit → ~80/100 after same-session fixes.**
Business type: Local Service (service-area business), professional IT/web services vertical.

Strongest asset: fully static HTML — every heading, FAQ answer and service description is in raw source with zero JS-rendering dependency, zero images, one consistent canonical. Weakest area: content depth (a single hub page carrying 5 commercial queries) and unresolved off-page strategy (GBP handling, reciprocal main-site link).

### Fixed during this session
| Fix | Source finding |
|---|---|
| `_headers` file created (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors + immutable font caching) | Technical · Critical |
| Ubuntu self-hosted as latin-subset WOFF2 (43 KB, preloaded) — render-blocking Google Fonts CSS removed; kills the #1 LCP/CLS risk | Technical · High |
| Title shortened 71 → 57 chars, single brand mention | Technical · High |
| Meta description trimmed 157 → 133 chars | Technical · Low |
| H1 now "WordPress support in Perth that answers the same day." | Technical + Content + Local · High |
| Schema `telephone` normalized to `1300 769 337` (matches visible text + tel: links; `+61 1300` is not a valid AU inbound format) | Schema + Local · Medium |
| `founder` Person node (Aaron Waltman, Senior Engineer) added to ProfessionalService | Content · Medium (partial — see backlog) |
| "Perth businesses" added to services intro; footer now carries the exact entity name + "Perth, WA" | Local · High/Medium |
| FAQ heading now keyword-bearing: "Fair questions about WordPress support in Perth" | Content · Medium |
| twitter:image, og:image dimensions, preconnect to supportperth.com.au, 44px header CTA | Technical · Low |

### Requires Aaron's input (cannot be done from files)
1. **Do NOT create a second Google Business Profile** — add WordPress services/categories to the existing Support Perth GBP instead (duplicate listings risk suspending the 5.0/25-review profile).
2. **Add a link from supportperth.com.au to this subdomain** (services section, ideally a card/nav item) — without it, the new host indexes slowly and inherits nothing.
3. **Decide the canonical destination for "wordpress support perth" queries** — this subdomain, exclusively; never publish a competing page on the apex.
4. `sameAs` (GBP Maps URL + socials) in the schema — needs the actual URLs.
5. `openingHoursSpecification` — needs real hours/response-window policy.
6. Visible "See our reviews" link to the GBP listing.
7. Response-time numbers in FAQ answers ("usually within the hour" etc.) — only if operationally true.
8. Bind the `RATE_LIMIT` KV namespace in Cloudflare Pages settings pre-launch (rate limiting currently fails open without it); set `SMTP2GO_API_KEY`, `TO_EMAIL`, `FROM_EMAIL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

## Category detail

### Technical — 80/100 (post-fix ~88)
Passes: static/SSR content, canonical=sitemap=og:url exact match, single h1 + clean heading tree, correct robots.txt scoping of /api/, viewport OK, lang=en-AU consistent, explicit index/follow, zero `<img>` weight.
Remaining: mobile nav has no hamburger below 760px (accepted trade-off: single-pager + always-visible sticky CTA); sitemap `lastmod` is hand-edited — wire to deploy pipeline; IndexNow optional for Bing; AI-crawler policy in robots.txt left permissive by design (we want AI citability).
Cannot assess pre-deploy: field CWV (CrUX), served headers, redirect chains. **Re-run live audit 24–48h post-launch, and again at ~28 days for field data.**

### Schema — 92/100 (post-fix ~95)
All 5 @graph nodes valid; zero Rich Results Test errors expected; FAQ content parity verified **verbatim** (all 6 Q/A pairs). Deliberate, research-backed omissions documented in docs/seo-research-schema-sitemap.md: no self-serving aggregateRating; FAQPage kept for AI parsers despite rich-result deprecation; cross-domain @id link to the apex #organization (verify byte-identical on the live apex with Rich Results Test post-launch).
Remaining (needs input): sameAs, openingHoursSpecification, optional partial PostalAddress (locality/region/postcode only) if it matches the GBP record.

### Content — 60/100 (post-fix ~64)
Real E-E-A-T assets: named engineer, genuine 5.0/25 reviews, operationally specific FAQ answers (hack cleanup sequence, staged migrations). Gaps: ~700 words carrying 5 commercial queries — "wordpress hosting perth", "wordpress malware removal perth" and "wordpress developer perth" are thin (one card/row each). Recommendation: add 2–3 sentences of specificity per underserved service now; consider dedicated child pages for hosting and malware removal in month 2 (highest-intent queries most likely to be won by dedicated pages).
Readability: grade ~8–9, appropriately conversational — no change needed.

### Local — 65/100 (post-fix ~72)
On-page geo signals fixed (H1, services intro, footer). Structural items are the ceiling: single-GBP strategy, reciprocal apex link, GBP review link, review-velocity nudge for WordPress clients. Subdomain-vs-subdirectory noted: acceptable as-is, but all "wordpress" content must live here exclusively to avoid cannibalisation.

## Scoring
Weights per audit skill: Technical 22% · Content 23% · On-Page 20% · Schema 10% · Performance 10% · AI-readiness 10% · Images 5%.
At audit: (80·.22)+(60·.23)+(70·.20)+(92·.10)+(70·.10)+(75·.10)+(90·.05) = **74**.
Post-fix estimate: (88·.22)+(64·.23)+(85·.20)+(95·.10)+(85·.10)+(75·.10)+(90·.05) = **~80**.

## Limitations
Pre-deployment, file-only audit. Not run (impossible or N/A): live crawl, CrUX/GSC/GA4 (no credentials + not live), visual/Playwright capture (host restricts browsers), backlinks (host not live), DataForSEO, e-commerce, drift. Schema/sitemap approach was verified against Google documentation via deep research (docs/seo-research-schema-sitemap.md) rather than generated from skill defaults, per project policy.
