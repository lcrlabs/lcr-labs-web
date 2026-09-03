# LCR Labs — Website

The product and brand hub for [LCR Labs](https://lcrlabs.com), an independent
software label building small, native macOS utilities.

Static site: **Astro + TypeScript**, no backend, no client framework, deployed
to Cloudflare Pages.

## What this site does

It presents the products and sends interested visitors to Setapp, which handles
distribution, licensing and payment. The site itself sells nothing, stores
nothing about visitors and has no server component.

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

The filename becomes the URL slug (`/products/my-product/`). The schema lives in
[`src/content.config.ts`](src/content.config.ts) and the build fails on an
invalid file. The homepage row, the `/products` listing, the detail page and the
sitemap all update on their own — no layout change is needed.

Minimum viable product file:

```json
{
  "name": "My Product",
  "order": 5,
  "shortDescription": "One sentence.",
  "longDescription": "A paragraph.",
  "status": "coming-soon"
}
```

### Products that are not announced yet

Set `"placeholder": true`. The product renders as a reserved slot with no
detail page and no call to action, so an unnamed product never gets invented
copy. Removing the flag promotes it to a full product.

## Connecting a product to Setapp

Fill in the `setapp` object once the real values exist in the LCR Labs Setapp
developer account:

```json
"setapp": {
  "model": "membership",
  "productUrl": "https://setapp.com/apps/...",
  "partnerUrl": "https://...",
  "appId": "...",
  "vendorId": "...",
  "priceLabel": "€X.XX"
}
```

Every field is optional. A "View on Setapp" button appears only when the product
is `"status": "available"` **and** a `productUrl` or `partnerUrl` is present —
`partnerUrl` wins so referral attribution survives. Otherwise the page states
the availability honestly instead of rendering a dead button.

**Never invent a URL or an identifier.** If it is not in the developer account
yet, leave it out.

## What this repository will not contain

No cart, checkout, payment SDK, payment webhook, purchase-success page, licence
generation, customer database, order storage, customer accounts, or public paid
downloads. Setapp is the commercial layer. See [`CLAUDE.md`](CLAUDE.md) for the
full set of constraints.

## Structure

```
public/brand/          logo, icons, social card
public/products/       product screenshots
src/content/products/  product data (the source of truth)
src/components/        presentational components
src/layouts/           the single page shell
src/pages/             routes
src/lib/               product queries, Setapp rules, site constants
src/styles/            design tokens and global styles
docs/                  design system and deployment notes
```

## Documentation

- [`docs/design-system.md`](docs/design-system.md) — tokens, type, motion, the
  rules a new component has to follow.
- [`docs/deployment.md`](docs/deployment.md) — Cloudflare Pages settings,
  headers, domain.
- [`CLAUDE.md`](CLAUDE.md) — working rules and hard constraints.

Longer-lived project documentation (master plan, decisions, roadmap, Setapp
distribution architecture, completion reports) lives in the Obsidian vault under
`LCR Labs/`.

## Licence

© 2026 LCR Labs. All rights reserved. The LCR Labs name, logo and product names
are not covered by any open-source licence.
