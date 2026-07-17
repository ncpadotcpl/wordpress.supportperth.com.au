# Action Plan — wordpress.supportperth.com.au

## Phase 1 — Pre-launch (this week) · items needing Aaron
- [ ] Cloudflare Pages project: bind `RATE_LIMIT` KV namespace; set `SMTP2GO_API_KEY`, `TO_EMAIL`, `FROM_EMAIL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (contact function fails open on rate limiting without the KV binding)
- [ ] Rename `wordpress-support.html` → `index.html` in the deploy artifact (page must serve at `/` to match canonical, sitemap and schema URLs)
- [ ] Paste the real GA4 + Google Ads gtag snippet into the marked head slot (all gtag calls are already guarded)
- [ ] Add WordPress services + secondary category to the EXISTING Support Perth GBP — do not create a second listing
- [ ] Link to https://wordpress.supportperth.com.au/ from supportperth.com.au (services section card + footer)

## Phase 2 — Launch week
- [ ] Register the subdomain as its own Search Console property; submit sitemap.xml
- [ ] Run Google Rich Results Test on the live URL (confirm cross-domain #organization @id resolves; zero errors expected)
- [ ] Verify served security headers match `_headers` (securityheaders.com)
- [ ] Re-run technical audit against the live URL (24–48h post-launch)
- [ ] Add `sameAs` (GBP Maps URL, socials) + `openingHoursSpecification` to the schema; add visible "See our reviews" GBP link
- [ ] Confirm the deployed page's contact modal posts successfully end-to-end (email + Telegram + auto-reply)

## Phase 3 — Content & authority (month 2)
- [ ] Deepen thin services on-page (2–3 specific sentences each): hosting (data-centre location, backup cadence, staging), malware removal (process + timeframe), builds (example work / stack)
- [ ] Consider dedicated child pages for `wordpress hosting perth` and `wordpress malware removal perth`, linked from the hub
- [ ] Add real response-time numbers to FAQ answers if operationally honoured
- [ ] Aaron micro-bio near the quote section (2 lines + years of experience) — strongest available E-E-A-T lift
- [ ] Niche citations (Clutch/GoodFirms-type directories) pointing at the subdomain; general directories stay on the apex
- [ ] Steer WordPress-client reviews to the GBP (review velocity)

## Phase 4 — Monitoring (ongoing)
- [ ] CrUX field data check at ~28 days (LCP/INP/CLS)
- [ ] GSC: indexation + query coverage for the 5 target queries
- [ ] Keep sitemap `lastmod` accurate on every content change (wire to deploy)
- [ ] Never publish apex-domain content targeting "wordpress support perth" (cannibalisation guard)
