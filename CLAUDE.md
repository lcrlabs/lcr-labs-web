# CLAUDE.md — lcr-labs-web

Project-specific rules for this repository. The global rules in `~/.claude/CLAUDE.md`
still apply; where this file is more specific, this file wins.

## What this is

The LCR Labs website: a static product and brand hub for the LCR Labs macOS
utilities. Astro + TypeScript, no backend, built by GitHub Actions and served
by GitHub Pages at https://lcrlabs.de.

It is **not** an ecommerce site, and it is not a sales channel. **No
distribution channel has been chosen.** How the apps will be delivered is
undecided and will be announced when it is decided — until then the site says
"Not yet available", "Distribution will be announced", "Release details will be
published here", and nothing more.

## Hard constraints

These are product decisions, not preferences. Do not implement any of them
without an explicit instruction that overrides this file:

- **No commerce.** No cart, checkout, payment SDK, payment webhook, purchase
  success page, licence generation, customer database, order storage or
  customer accounts. No Stripe, Lemon Squeezy or Paddle.
- **No paid downloads.** Never host or link a paid DMG, and never create a
  `/download/...` route for a commercial product.
- **No invented distribution.** LCR Labs is not on Setapp, the App Store or any
  other channel, and the site must not imply otherwise. Do not add a store
  name, a store link, an app ID, a vendor ID or a price. If a channel is chosen
  later, that is a new user decision, not something to anticipate here.
- **No invented product content.** Do not write feature copy for a product that
  has not been specified, and do not invent the fourth product's name. Use the
  `placeholder` flag instead.
- **No invented legal text.** Legal pages are scaffolds carrying a visible
  `DraftNotice`. Do not remove a notice, and do not present generated wording as
  reviewed legal advice.
- **No backend.** The safest V1 backend is no backend.
- **No analytics, trackers, advertising SDKs or session replay.**

## Stack

- Astro **pinned to 7.2.10**. Do not bump it casually: 7.3.0 ships a broken
  exports map (`astro/_internal/logger` is imported by its own asset plugin but
  not exported), which fails every build. Verify a build before changing it.
- TypeScript, `astro/tsconfigs/strict`.
- Zero runtime dependencies beyond Astro. The sitemap is a 20-line endpoint
  rather than an integration — keep it that way unless there is a real reason.
- No UI framework, no CSS framework, no animation library.

## Architecture

```
src/
  content/products/*.json   product data — the single source of truth
  content.config.ts         the product schema (Zod)
  lib/products.ts           product queries and status labels
  lib/site.ts               site constants (URL, nav, tagline)
  components/               presentational; no data fetching
  layouts/BaseLayout.astro  head, SEO, appearance script, header/footer
  pages/                    routes
  styles/tokens.css         every colour, space, radius and duration
  styles/global.css         reset, typography, layout primitives
```

Rules:

- **Adding a product is a data change.** Drop a JSON file into
  `src/content/products/`; the homepage, `/products`, its detail page and the
  sitemap all pick it up. If a product ever needs a layout change to appear,
  the layout is wrong.
- **A product's availability is stated in one sentence, never as a button.**
  `statusNote` in the product's JSON is that sentence and `StatusNote.astro`
  renders it. There is no outbound commercial link anywhere in the site, and
  no component that could produce one.
- **`status` must not overstate.** `coming-soon` is reserved for a release that
  is genuinely imminent. Work in progress is `in-development`; an idea is
  `in-planning`. Copy for a planned product describes intended direction, not
  shipped behaviour.
- **Screenshots come in pairs.** Each entry carries `lightSrc`, an optional
  `darkSrc`, `alt`, and the file's real `width` and `height`. The dimensions
  are what keep the theme swap free of layout shift, so they are not optional.
- **Components never hard-code a colour, spacing value or duration.** Use the
  tokens. A raw hex outside `tokens.css` is a bug.
- **Scoped styles do not reach into child components.** Wrap a child in an
  element this component owns rather than passing a class for the parent to
  style.

## Appearance

Light and dark are one `light-dark()` declaration per token in `tokens.css`,
resolved by `color-scheme`. The page follows the system by default; the header
toggle sets `data-theme` on `<html>`, which narrows `color-scheme`. A tiny
inline script in `BaseLayout` re-applies a stored choice before first paint.

`ThemeScript.astro` owns all of this and exposes `window.lcrTheme`. Anything
that has to react to the appearance — the header toggle, the light/dark
screenshots — subscribes to it rather than re-deriving the answer, so the page
cannot end up half in one appearance and half in the other.

Never define a colour only inside a media query, and never add a second
theming mechanism.

## Motion

Decorative motion is limited to `OrbitalField`: three elements animating
`transform` only, hero-scoped, minutes per revolution. No canvas, no WebGL, no
scroll or pointer listeners, nothing animating outside the hero.

`prefers-reduced-motion` must leave a composition that looks finished, not an
empty box. `global.css` also carries a blanket reduced-motion override.

## Verification

Before calling work here done:

1. `npm run build` — must succeed.
2. `npm run check` — 0 errors.
3. Look at the result in **Safari** on this Mac, at desktop and phone widths,
   in both appearances. No simulators, and not a Chromium browser — Safari is
   what this site's audience uses and the stricter engine for `light-dark()`,
   CSS `mask-image`, `:has()` and `backdrop-filter`.

   To drive it: `safaridriver -p 4444`, then WebDriver over HTTP. Two things
   make the session time out rather than fail usefully — Safari must be
   **fully quit** first (safaridriver launches its own automation instance),
   and "Allow Remote Automation" must be enabled in Safari's Develop menu
   (`safaridriver --enable` needs an admin password). Safari cannot emulate
   `prefers-color-scheme`, so capture each appearance by setting `data-theme`
   on `<html>` — the same mechanism the toggle uses. It cannot emulate
   `prefers-reduced-motion` at all; check that one by hand.
4. Tab through the page: skip link, header, menu, every CTA, visible focus.
5. Confirm no secrets, no checkout code, no paid-download link, and no
   distribution channel or store link entered the build.

There is no test suite: the site has no domain logic to protect. If real logic
ever appears in `src/lib/`, test it first.

## Reports

Completion reports go to the Obsidian vault at
`LCR Labs/05 Reports/`, not into this repository.
