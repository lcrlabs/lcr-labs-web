# LCR Labs — Website

The product and brand hub for [LCR Labs](https://lcrlabs.de), the independent
software studio of a solo developer building small, native macOS utilities.

Static site: **Astro + TypeScript**, no backend, no client framework. Built and
deployed to GitHub Pages at <https://lcrlabs.de> by GitHub Actions.

## What this site does

It presents the products and says honestly where each one stands. Background
Doctor is available on the Mac App Store, linked from its product data. Other
products retain their own development status. The site sells nothing, stores nothing about visitors and has no server
component.

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built output
npm run check    # TypeScript + Astro diagnostics
```

Node 20 or later.

> Astro is pinned to `7.2.10`. Version `7.3.0` ships a broken exports map and
> fails every build — verify a successful build before changing the pin.

## Adding or updating a product

Product pages are generated from data. To add a product, create one JSON file:

```
src/content/products/my-product.json
```

The filename becomes the URL slug (`/products/my-product/` and
`/de/products/my-product/`). The schema lives in
[`src/content.config.ts`](src/content.config.ts) and the build fails on an
invalid file. The homepage, the `/products` listing, both detail pages and the
sitemap all update on their own — no layout change is needed.

Technical metadata sits at the top level, because it is the same fact in every
language. Everything that is prose sits under `localized`, once per language,
and both languages are required — a missing German block fails the build rather
than falling back to English.

Minimum viable product file:

```json
{
  "name": "My Product",
  "order": 5,
  "status": "in-planning",
  "localized": {
    "en": {
      "shortDescription": "One sentence.",
      "longDescription": "A paragraph.",
      "statusNote": "In planning. This describes the intended direction, not finished software."
    },
    "de": {
      "shortDescription": "Ein Satz.",
      "longDescription": "Ein Absatz.",
      "statusNote": "In Planung. Das beschreibt die beabsichtigte Richtung, keine fertige Software."
    }
  }
}
```

### Status

`status` is the one place the site states how real a product is, so it must not
overstate:

| Value | Means |
|---|---|
| `in-planning` | An idea. Copy describes intended direction, not behaviour. |
| `in-development` | Being built. Not released, no date. |
| `coming-soon` | Release is genuinely imminent. |
| `beta` | Released as a beta. |
| `available` | Released. |

`statusNote` is the one honest sentence the page shows about availability.
There is no purchase button anywhere in the site and no component that could
render one.

### The lead product

`"featured": true` makes a product the homepage lead: told at full width with
its screenshot given the whole column. Everything else is listed compactly
below it. Moving the emphasis is a change to this flag and nothing else.

### Screenshots

Each screenshot carries both appearances:

```json
"screenshots": [
  {
    "lightSrc": "/products/my-product-overview-light.png",
    "darkSrc": "/products/my-product-overview-dark.png",
    "alt": "What the screenshot shows.",
    "width": 2400,
    "height": 1500
  }
]
```

The two files must show the same app state, the same window size and the same
crop — switching between them should read as a change of appearance and nothing
else. `darkSrc` is optional; without it the light file is used in both.

`width` and `height` are the file's real pixel dimensions and are **required**.
They reserve the space before anything is fetched, which is what keeps the
first paint and every theme swap free of layout shift. The visible `<img>` ships
with no `src`: the appearance is only known at runtime, so
[`ThemeScript.astro`](src/components/ThemeScript.astro) fills it in and keeps it
in step with the theme — one element, one request, and never the wrong variant
on screen first.

## Languages

The site is published in English and German. English is the default and has no
prefix, so every URL the site has ever had still resolves; German lives under
`/de/`. There is no `/en/`, and nothing redirects — a reader who asks for a URL
gets that URL.

```
/            /de/
/products/   /de/products/
/about/      /de/about/
/support/    /de/support/
/privacy/    /de/privacy/
/imprint/    /de/imprint/
```

UI copy lives in [`src/i18n/en.ts`](src/i18n/en.ts) and
[`src/i18n/de.ts`](src/i18n/de.ts); German is typed against English, so a key
added to one and not the other is a build error. Page bodies live once in
`src/views/` and are rendered by a three-line route file per language.
`localePath` builds every internal link from a canonical path plus the current
locale, so a German page cannot link to an English one.

The header's `EN`/`DE` control links to the equivalent page in the other
language, falling back to that language's homepage where none exists. It stores
the reader's explicit choice under `lcr-language`, alongside `lcr-theme`; both
are read-only preferences that never leave the browser, and neither triggers an
automatic redirect. Both privacy pages say so.

The one page that exists in English only is `404.html`: GitHub Pages serves a
single not-found page for the whole domain, so there is nowhere for a German
one to be served from.

Nothing above is specific to two languages. A locale lives in `LOCALES` with a
prefix, a dictionary and a directory of three-line routes; `hreflang`,
`og:locale`, the switcher and the sitemap all follow from that list. Adding a
third language is content and configuration, not a change to the routing —
[`docs/localization.md`](docs/localization.md) is the full contract, including
the exact files a new locale touches.

## What this repository will not contain

No cart, checkout, payment SDK, payment webhook, purchase-success page, licence
generation, customer database, order storage, customer accounts, or public paid
downloads, and no store link or store name. See [`CLAUDE.md`](CLAUDE.md) for the
full set of constraints.

## Structure

```
public/brand/          logo, icons, social card
public/products/       product screenshots
src/content/products/  product data (the source of truth)
src/i18n/              locale config, route arithmetic, the dictionaries
src/components/        presentational components
src/views/             one page body per page, shared by both languages
src/layouts/           the single page shell
src/pages/             routes — English at the root, German under /de/
src/lib/               product queries, status labels, site constants
src/styles/            design tokens and global styles
docs/                  design system, localization and deployment notes
```

## Documentation

- [`docs/design-system.md`](docs/design-system.md) — tokens, type, motion, the
  rules a new component has to follow.
- [`docs/localization.md`](docs/localization.md) — the localization contract:
  routing, dictionaries, metadata, storage, the legal-page rule, and what
  adding a language takes.
- [`docs/deployment.md`](docs/deployment.md) — the GitHub Pages workflow,
  domain and header policy.
- [`CLAUDE.md`](CLAUDE.md) — working rules and hard constraints.

Longer-lived project documentation (master plan, decisions, roadmap, completion
reports) lives in the Obsidian vault under `LCR Labs/`.

## Licence

© 2026 LCR Labs. All rights reserved. The LCR Labs name, logo and product names
are not covered by any open-source licence.
