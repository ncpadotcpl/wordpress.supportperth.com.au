---
name: WordPress Support Perth
description: Support Perth's WordPress services landing page — the brand system turned up bold on a dark-ink hero.
colors:
  bg: "#ffffff"
  surface: "#f5f6f8"
  ink: "#111418"
  ink-soft: "#5b6470"
  hairline: "#e5e8ec"
  ocean-blue: "#006d9a"
  warm-orange: "#f97316"
  status-green: "#16a34a"
  star-gold: "#fbbc04"
typography:
  display:
    fontFamily: "Ubuntu, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 7vw, 5.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Ubuntu, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Ubuntu, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Ubuntu, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "Ubuntu, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  field: "10px"
  row: "12px"
  card: "16px"
  pill: "999px"
spacing:
  chip: "8px 16px"
  field: "12px 15px"
  button: "17px 38px"
  card: "34px 30px"
  gutter: "28px"
components:
  button-primary:
    backgroundColor: "{colors.ocean-blue}"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
    padding: "{spacing.button}"
  button-primary-hover:
    backgroundColor: "{colors.warm-orange}"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
  card-service:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  input-modal:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "{spacing.field}"
---

# Design System: WordPress Support Perth

## 1. Overview

**Creative North Star: "The Calm Connected Mesh"**

Technology drawn as a calm, connected network — never as server rooms, headsets or stock panic. The whole system is Support Perth's registered brand language (white canvas, Ubuntu everywhere, pill buttons, 16px cards, hairline borders) deliberately turned up one notch for this page: a full-bleed dark-ink hero where the ocean-blue node mesh finally acts as identity rather than decoration, with coloured signal dots (orange, gold, green) glowing on it like a healthy network's status lights.

The register is brand, but the voice is a senior engineer, not a marketer: short sentences, real numbers, symptoms named in the visitor's own words. The system explicitly rejects enterprise MSP buzzword sites, stock photography of any kind, pushy urgency mechanics, and generic AI-template landing pages (see PRODUCT.md anti-references — they are enforced as Don'ts below).

**Key Characteristics:**
- One typeface (Ubuntu 400/500/700, self-hosted WOFF2), three weights, no exceptions
- White/ink duality: calm white body sections punctuated by full-bleed dark or ocean-blue bands
- Pills everywhere interaction lives — buttons, chips, trust pills, badges
- Motion is feedback: 0.15–0.25s eases, −2px hover lifts, pulsing status dots, all gated by prefers-reduced-motion
- The node-mesh (SVG or rendered video) is the only permitted imagery

## 2. Colors

A disciplined seven-token brand palette plus two role-locked supports — neutrals carry 80%+ of every screen, ocean blue is the resting accent, warm orange is feedback.

### Primary
- **Ocean Blue** (#006d9a): the resting accent — primary buttons, links-as-actions, the mesh's lines and base dots, the emergency band wash (approved deviation, this page only), focused input borders. High-signal; used sparingly on light surfaces.

### Secondary
- **Warm Orange** (#f97316): hover/active feedback across the site — every primary control warms to orange on hover. On this page it is additionally approved *at rest* in three places only: hero mesh focal dots, the hero animation's pulsing node, and the quote's orange marker fill.

### Tertiary
- **Status Green** (#16a34a): the pulsing availability dot and the modal success tick. Nothing else.
- **Star Gold** (#fbbc04): review stars and the headline's travelling gold glint. Nothing else.

### Neutral
- **Paper White** (#ffffff): body background and text on dark bands.
- **Cloud** (#f5f6f8): alternate section surface.
- **Ink** (#111418): body text, the dark hero/quote bands, the hero video tile.
- **Ink Soft** (#5b6470): muted copy, leads, card descriptions.
- **Hairline** (#e5e8ec): 1px card borders, 1.5px input borders, dividers.

### Named Rules
**The Orange-Is-Feedback Rule.** Warm orange appears at rest only in the three approved spots above. Everywhere else it exists exclusively as a hover/active state. Never introduce new resting orange without explicit approval.
**The Alpha-Derivative Rule.** On dark bands, "new" colours are rgba derivatives of white or ink (pills at 5% white fill, 1px semi-transparent white hairlines, ink text-halos) — never new hues. The modal's error reds (#fef2f2/#fecaca/#991b1b/#dc2626) are part of the ported contact-modal contract and are the only exception.

## 3. Typography

**Display Font:** Ubuntu 700 (with system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif)
**Body Font:** Ubuntu 400 (same fallback stack)
**Label/Mono Font:** ui-monospace / SFMono-Regular / Menlo — used once, deliberately, to render the literal WordPress error string inside the symptom chip.

**Character:** One humanist family at three weights (400 read / 500 emphasize / 700 announce). Friendly but engineered — the rounded Ubuntu letterforms carry the "real person" promise while tight negative tracking keeps display sizes authoritative.

### Hierarchy
- **Display** (700, clamp(3rem, 7vw, 5.75rem), 1.02, −0.03em): the hero h1 only. This page's 5.75rem ceiling is an approved bold-hero deviation above the brand's standard 4.75rem cap — do not propagate it to other Support Perth pages.
- **Headline** (700, clamp(2rem, 4vw, 3rem), 1.1, −0.02em): section h2s. The pull-quote runs to clamp(1.8rem, 3.6vw, 2.9rem) at 26ch.
- **Title** (700, 1.2rem, 1.3, −0.01em): card and FAQ headings.
- **Body** (400, 17px, 1.6): all copy; leads at 1.18rem in Ink Soft, capped at 58ch.
- **Label** (500, 12.5px, 0.08em, UPPERCASE): the single hero eyebrow. One eyebrow per page — it is not section grammar.

### Named Rules
**The One-Eyebrow Rule.** Exactly one tracked uppercase eyebrow exists (hero). Sections open with a bare h2. Adding eyebrows above every section is prohibited.

## 4. Elevation

A hybrid: surfaces are flat at rest with 1px hairline borders; layered soft shadows appear as a response to intent (hover, modal, the hero video tile). Depth reads as calm lift, never as heavy drop-shadow chrome.

### Shadow Vocabulary
- **Soft** (`box-shadow: 0 1px 2px rgba(12,13,15,.07), 0 8px 24px rgba(12,13,15,.07)`): resting primary buttons.
- **Lift** (`box-shadow: 0 2px 4px rgba(12,13,15,.09), 0 14px 34px rgba(12,13,15,.12)`): the universal hover state, always paired with `transform: translateY(-2px)`.
- **Modal** (`box-shadow: 0 24px 64px rgba(12,13,15,0.28)`): the contact modal card only.
- **Accent glow** (`box-shadow: 0 0 90px rgba(0,109,154,0.5), 0 30px 90px rgba(0,0,0,0.4)`): the hero video tile's ocean-blue halo — a real box-shadow behind a solid-background element, per the standing rule.

### Named Rules
**The Glow-Is-Box-Shadow Rule.** Accent glows are box-shadows behind elements that keep their solid backgrounds. mix-blend-mode and opacity tricks that strip an element's own fill are prohibited (this failed once on the hero tile; the box-shadow rebuild is the law).
**The Lift-Together Rule.** Hover lift is always the pair: −2px translateY + the Lift shadow, at 0.15–0.25s ease. Never one without the other.

## 5. Components

### Buttons
- **Shape:** full pill (999px), min-height 54px (44px+ touch floor everywhere)
- **Primary:** Ocean Blue fill, white text, Ubuntu 700 at 16.5px with 0.02em tracking, 17px 38px padding, Soft shadow at rest
- **Hover / Focus:** fill warms to Warm Orange, −2px lift, Lift shadow; focus uses a visible ring, never outline:none alone
- **Ghost (dark bands):** transparent fill, 1.5px semi-transparent white border, white text; inverts to white fill with Ocean Blue text on hover

### Chips (symptom chips, trust pills)
- **Style:** pill radius, 1.5px rgba(255,255,255,0.4) border on the ocean-blue band, 8px 16px padding; trust pills use a 1px white hairline with 5% white fill
- **State:** hover inverts to white background with Ocean Blue text, −2px lift; the database-error chip renders its string in the mono stack at 13.5px

### Cards / Containers
- **Corner Style:** 16px for feature cards, 12px for secondary service rows, 14px inner tiles
- **Background:** Paper White on Cloud sections (and vice versa)
- **Shadow Strategy:** flat at rest, Lift on hover (see Elevation)
- **Border:** 1px Hairline, always
- **Internal Padding:** 34px 30px featured, 18px 20px rows

### Inputs / Fields
- **Style:** 1.5px Hairline border, 10px radius, 12px 15px padding, 16px Ubuntu
- **Focus:** Ocean Blue border + `0 0 0 3px rgba(0,109,154,0.15)` ring
- **Error:** ported modal contract — red banner with role="alert", field highlight + focus; validation fires only on submit, never as-you-type

### Navigation
- **Style:** sticky solid-white header (never transparent/blurred — scroll ghosting is a known failure), 1px Hairline bottom border, text wordmark "Support Perth / WordPress" in Ubuntu 700 21px −0.03em, pulsing green availability badge, pill CTA. Header shares the hero's 1420px grid so the wordmark aligns with the h1.

### The Mesh (signature)
The node-network is the identity element: ocean-blue lines with coloured signal dots (blue base, orange focal, gold and green accents at 0.8–0.85 opacity on this page's dark hero — an approved deviation). It ships as inline SVG or as the rendered hero video (`assets/wp-icon-hero.mp4`, seamless 8s loop, solid ink tile background, ocean-blue box-shadow glow). Hero text over the mesh carries a three-layer ink text-shadow halo (14/32/56px) instead of a plate.

## 6. Do's and Don'ts

### Do:
- **Do** use only the nine registered colours; derive everything else as rgba of white (#ffffff) or ink (#111418).
- **Do** pair every hover with the full lift (−2px + Lift shadow) at 0.15–0.25s ease, and gate all motion behind prefers-reduced-motion.
- **Do** keep the ported contact-modal contract byte-faithful: email or phone (either suffices), hidden website_url honeypot, submit-time-only validation, GA4 modal_open/modal_submit with A/B/C variant, 3s success auto-close.
- **Do** write copy as the senior engineer: real numbers (5.0 rating, 25 reviews, same-day), symptom language, no adjectives without proof.
- **Do** keep client logos (JoDoKo, Be Slavery Free, Safestar Supports, Arena Joondalup Physiotherapy) testimonial-scale only, beside quotes or in trust strips.

### Don't:
- **Don't** build "enterprise MSP sites full of buzzwords (synergy, solutions, leverage)" — PRODUCT.md's first anti-reference; no jargon survives review.
- **Don't** use "stock photos of server rooms, headsets or call centres" — the mesh is the only imagery; no photography, ever.
- **Don't** ship "pushy sales pages with fake urgency or vague promises without numbers" — no countdown timers, no invented stats, no unlabelled placeholders.
- **Don't** produce a "generic AI-template landing page": no eyebrow above every section, no identical icon-card grids, no numbered 01/02/03 scaffolding, no gradient washes.
- **Don't** use warm orange at rest outside the three approved spots, put text in ocean blue on the dark ink band (2.9:1 — fails), or strip a solid background to fake a glow (box-shadow only).
- **Don't** propagate this page's bold-hero deviations (5.75rem display, solid ocean-blue band, coloured resting mesh dots) to other Support Perth pages — they are page-scoped approvals.
