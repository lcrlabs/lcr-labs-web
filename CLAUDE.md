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
- **No invented legal text.** Do not present generated wording as reviewed legal
  advice, and never state a legal fact the project cannot evidence — a VAT ID, a
  tax number, a register entry, a company form, a postal address or a phone
  number. If a required detail does not exist, the section is omitted, not
  filled in. See **Legal pages**.
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
  i18n/en.ts, de.ts         UI copy; de is typed against en
  i18n/index.ts             Locale, route arithmetic, dictionary lookup
  lib/products.ts           product queries, localized copy, status labels
  lib/site.ts               site constants (URL, nav paths, email)
  components/               presentational; no data fetching
  views/                    one page body per page, shared by both languages
  layouts/BaseLayout.astro  head, SEO, hreflang, appearance script, chrome
  pages/                    routes — English at the root, German under /de/
  styles/tokens.css         every colour, space, radius and duration
  styles/global.css         reset, typography, layout primitives
```

Rules:

- **Adding a product is a data change.** Drop a JSON file into
  `src/content/products/`; the homepage, `/products`, both detail pages and the
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

## Languages

English is the default and carries no prefix; German lives under `/de/`. There
is no `/en/`, and nothing redirects — the URL a reader asks for is the page they
get, so `lcrlabs.de` serves English to everyone, every time. `/404` is the one
page with no German counterpart, because GitHub Pages serves one not-found page
for the whole domain.

[`docs/localization.md`](docs/localization.md) is the full contract — the
invariants, the storage and privacy rules, the legal-page rule, and what adding
a third language would touch. The rules below are the ones that get broken most
easily.

- **`src/i18n/index.ts` owns locale routing.** `LOCALES`, `DEFAULT_LOCALE`, the
  prefix per locale, the set of translated paths and every path helper live
  there and nowhere else.
- **A page body is written once.** It lives in `src/views/` and takes a
  `locale`; the route file under `src/pages/` is three lines. Never copy a page
  to translate it.
- **Every internal link goes through `localePath`.** A canonical (English) path
  plus the current locale. A German page linking to an English one is a bug, and
  hard-coding `/de/...` in a component is how that bug gets written.
- **`de.ts` is typed against `en.ts`.** A key added to one and not the other
  fails the build. Same for a product's `localized` block, which requires both
  languages — there is no silent fallback to English anywhere.
- **Prose belongs to a language; facts do not.** A product's name, platform,
  minimum OS, status and screenshot files sit at the top level of its JSON;
  only its copy is per-language.
- **The switcher goes to the equivalent logical page**, falling back to that
  language's homepage only where no counterpart exists.
- **Metadata is derived, never written out by hand.** Each page's canonical
  points at itself; every translated page emits `hreflang` for `en`, `de` and
  `x-default`; `x-default` is English because it is `DEFAULT_LOCALE`; and both
  locales appear in the sitemap. A page that gains a language gains all four
  without an edit to any of them.
- **Legal pages are the exception to sharing a body.** The German pages carry
  the finalized German wording and are authoritative; the English ones state
  the same duties under the same law (GDPR, DDG, TDDDG) in English. Change a
  fact in one and it changes in both, or neither is true — an edit to either
  version means checking the other. German and EU references are never replaced
  with US or other foreign law.
- **A product page is not done until both languages are.** English copy, German
  copy, localized metadata and localized screenshot `alt` text, both routes
  building, and the pair in the sitemap and the `hreflang` set. Localized
  screenshot *images* are not required: an English capture may stand on a German
  page as long as the alt text is German and nothing claims otherwise.
- **`lcr-language` is written only when a reader uses the switcher**, holds a
  supported locale value, and is read by nothing that changes navigation. No
  browser-language redirect, ever, and no use for analytics, advertising or
  profiling. Both privacy pages disclose it alongside `lcr-theme`; those two
  keys are the only browser storage the site uses.
- **Localization stays local and static.** Translations are written in the
  repository and bundled at build time. No translation API, no runtime machine
  translation, no external localization script or locale bundle, no
  localization telemetry, and no analytics or tracking keyed on language.
- **The architecture stays open to more languages.** French, Spanish, Italian
  and Chinese are all plausible later; do not implement any of them without an
  explicit instruction, and do not write code that assumes `en` and `de` are the
  only locales there can be. Adding one must be: the locale in the central
  config, its dictionary, its static routes, its content — with `hreflang`,
  `og:locale`, the switcher and the sitemap following from `LOCALES` on their
  own. If a language addition would need the routing redesigned, the routing is
  wrong. `docs/localization.md` lists the exact files and which ones the
  compiler catches.

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

## Legal pages

`/privacy/` and `/imprint/` are finished, production-ready pages, not scaffolds.

- **No draft UI.** Neither page shows a draft notice, warning banner,
  placeholder banner or any other temporary marker, and none may be added.
  `DraftNotice.astro` was deleted once the last page stopped needing it — do not
  recreate it unless a future task asks for it by name.
- **The layout is settled.** All four pages are one narrow `.prose` column: `h1`
  in the `.head` block, `h2` per section, `<address class="address">` for postal
  blocks. `LegalPage.astro` owns that frame and the four bodies slot into it, so
  an edit to one stays consistent with the rest; none gets its own visual
  system, and none grows a card stack. The prose carries no `lang` of its own —
  the document states the language now, and a German `lang` on an English page
  would be worse than none.
- **The content tracks the implementation.** Every service the privacy notice
  names is one the site actually depends on, and every detail the imprint states
  is one that is true. If the site starts loading something new, the privacy
  notice changes with it; if it stops, the section goes. Facts the project does
  not have are absent rather than approximated.
- **The pair stays consistent.** The German pages are the source text; the
  English ones are translations of the same duties under the same law. Operator
  name, address, contact address, hosting and infrastructure disclosures,
  supervisory authority, storage keys and dates must read identically in both.
  Editing one version means checking the other in the same change. Official
  names of companies and authorities stay in their own language on both sides —
  they are names, not prose.
- Legal wording here is written, not lawyer-reviewed. Independent review is
  still an open item in `docs/deployment.md`, and nothing in the repository
  should claim otherwise.

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
   on `<html>` — but set it through `window.lcrTheme.set()`, or store
   `lcr-theme` and reload. Assigning the attribute directly leaves every
   transitioned colour resolved for the appearance being left: WebKit does not
   re-resolve `light-dark()` for a property listed in a `transition`, which is
   what `data-theme-switching` exists to work around. It cannot emulate
   `prefers-reduced-motion` at all; check that one by hand.
4. Tab through the page: skip link, header, language and appearance controls,
   menu, every CTA, visible focus.
   Check both languages: the switcher must reach the matching page, and no page
   may mix languages.
5. On the built `dist/`: both variants of every page, no `/en/` path anywhere,
   `<html lang>` matching the directory, a self-referential canonical and
   `en`/`de`/`x-default` on each translated page, and both locales in the
   sitemap. `docs/localization.md` has the full list.
6. Confirm no secrets, no checkout code, no paid-download link, and no
   distribution channel or store link entered the build.

There is no test suite: the site has no domain logic to protect. If real logic
ever appears in `src/lib/`, test it first.

## Reports

Completion reports go to the Obsidian vault at
`LCR Labs/05 Reports/`, not into this repository.
