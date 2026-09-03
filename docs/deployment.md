# Deployment

GitHub is source control. Cloudflare Pages builds and serves the site. There is
no server, no adapter and no runtime — Pages serves `dist/` as static files.

## Cloudflare Pages settings

| Setting | Value |
|---|---|
| Framework preset | Astro (or None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 or later (`NODE_VERSION` environment variable) |
| Production branch | `main` |

No environment variables and no secrets are required. The build must never need
one — if a future change appears to, that change is out of scope for this site.

Pull requests get preview deployments automatically. Those preview URLs are
public; nothing here is confidential, but they should not be shared as if they
were the product site.

## Custom domain

Not yet configured. When the domain is registered:

1. Add it under **Pages → the project → Custom domains**.
2. Point DNS at Cloudflare and let Pages issue the certificate.
3. Set the apex or `www` variant as canonical and redirect the other, so the
   site has exactly one address.
4. Update `SITE_URL` in [`src/lib/site.ts`](../src/lib/site.ts) and the
   `Sitemap:` line in [`public/robots.txt`](../public/robots.txt).

`SITE_URL` currently reads `https://lcrlabs.com` as a placeholder. It only
affects canonical URLs, Open Graph URLs and the sitemap, but it must be correct
before launch or search engines will index the wrong host.

## Headers

[`public/_headers`](../public/_headers) is read by Cloudflare Pages and sets:

- A strict **Content-Security-Policy**. The site loads nothing from a third
  party, so `default-src 'self'` holds. `'unsafe-inline'` is needed for scripts
  because of the two small inline scripts (appearance restore, menu
  conveniences) and for styles because Astro emits scoped `<style>` blocks.
  Tightening these to hashes is possible later; the trade-off is that every
  style edit changes the hash.
- HSTS, `nosniff`, `frame-ancestors 'none'`, `form-action 'none'` (there are no
  forms), a restrictive `Permissions-Policy`, and
  `Referrer-Policy: strict-origin-when-cross-origin`.
- Immutable caching for `/brand/*` and Astro's fingerprinted `/_astro/*`.

If a third-party script is ever added, the CSP must be updated deliberately —
not widened to `*` to make an error go away.

## Pre-launch checklist

- [ ] Real domain registered and configured; `SITE_URL` and `robots.txt` updated.
- [ ] Imprint completed and legally reviewed; `DraftNotice` removed.
- [ ] Privacy notice completed, hosting details filled in, reviewed;
      `DraftNotice` removed.
- [ ] Support contact address added; `DraftNotice` removed.
- [ ] Product screenshots added, or the empty-frame placeholder accepted
      knowingly.
- [ ] Setapp URLs added for any product whose status is `available`.
- [ ] Build clean, `npm run check` clean.
- [ ] Checked in Safari at desktop and phone widths, both appearances.
- [ ] Keyboard pass: skip link, header, menu, every CTA.
- [ ] Confirmed no checkout code, no paid-download link, no secrets in the
      built output.
