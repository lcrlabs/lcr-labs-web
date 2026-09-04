# Deployment

GitHub is source control *and* the host. A GitHub Actions workflow builds the
site and publishes it to GitHub Pages at **https://lcrlabs.de**. There is no
server, no adapter and no runtime — Pages serves `dist/` as static files.

Generated output is never committed. `main` holds source only; the workflow is
the single thing that produces what Pages serves.

## The workflow

[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) runs on every
push to `main` and on manual dispatch:

| Step | Command / action |
|---|---|
| Install | `npm ci` — exactly what `package-lock.json` pins |
| Type check | `npm run check` — must report 0 errors |
| Build | `npm run build` → `dist/` |
| Upload | `actions/upload-pages-artifact@v5` with `path: dist` |
| Deploy | `actions/deploy-pages@v5` |

Any failing step fails the job and nothing is published — the previous
deployment stays live. Permissions are the minimum Pages needs
(`contents: read`, `pages: write`, `id-token: write`) and there are no secrets.
The build must never need one; if a future change appears to, that change is
out of scope for this site.

Node 22 in CI. Node 20 or later locally.

## GitHub Pages settings

| Setting | Value |
|---|---|
| Source | GitHub Actions |
| Custom domain | `lcrlabs.de` |
| Enforce HTTPS | On |

The **Source** must stay on *GitHub Actions*. Switching it back to a branch
would publish the repository source instead of the build.

DNS for `lcrlabs.de` and `www.lcrlabs.de` is configured at the registrar and
the GitHub certificate covers both. Do not change DNS from this repository.

## Custom domain and `base`

The site lives at the root of an apex domain, so `astro.config.mjs` has **no
`base`**. Adding one — as a `<user>.github.io/<repo>` deployment would need —
would break every root-relative asset and link here.

[`public/CNAME`](../public/CNAME) contains exactly `lcrlabs.de` and is copied
into `dist/`. GitHub also stores the custom domain in the repository's Pages
settings; keeping the file in the artifact means a settings reset or a change
of publishing method cannot silently drop the domain.

The `CNAME` file at the repository root predates this setup: it was what the
branch-based publishing method read. The GitHub Actions method does not read it,
so it is now redundant — harmless, holding the same value, and left in place
rather than removed. `public/CNAME` is the one that ships.

[`public/.nojekyll`](../public/.nojekyll) is empty and disables Jekyll
processing, which would otherwise strip Astro's `_astro/` asset directory.

The production origin is defined once, in
[`src/lib/site.ts`](../src/lib/site.ts) as `SITE_URL`. It drives `site` in the
Astro config, canonical URLs, Open Graph URLs and the sitemap. If the domain
ever moves, change it there and keep [`public/robots.txt`](../public/robots.txt)
and `public/CNAME` in step.

## Headers

[`public/_headers`](../public/_headers) is **not active on GitHub Pages**, which
serves static files with its own fixed headers and reads no per-site header
file. The file is retained as the reviewed policy — a strict CSP, HSTS,
`nosniff`, `frame-ancestors 'none'`, a restrictive `Permissions-Policy` and
immutable caching for fingerprinted assets — and applies unchanged behind any
host that reads it.

What still holds on GitHub Pages without it: the site loads nothing from a third
party, sets no cookies, runs no analytics and has no forms, so the headers were
defence in depth rather than the thing keeping the site safe. HTTPS is enforced
by Pages. If response headers become a requirement, that needs a host in front
of Pages — a deliberate decision, not a config tweak.

If a third-party script is ever added, the policy must be updated deliberately —
not widened to `*` to make an error go away.

## Verifying a deployment

1. Actions → the run for the pushed commit is green, both jobs.
2. `https://lcrlabs.de/` serves the built site.
3. Spot-check a product route, `/sitemap.xml` and `/robots.txt`.
4. An unknown path returns the 404 page.

## Pre-launch checklist

- [x] Real domain configured; `SITE_URL`, `robots.txt` and `CNAME` updated.
- [ ] Imprint completed and legally reviewed; `DraftNotice` removed.
- [ ] Privacy notice completed, hosting details filled in (GitHub Pages, GitHub
      Inc.), reviewed; `DraftNotice` removed.
- [x] Support contact address added; `DraftNotice` removed.
- [ ] Product screenshots added in both appearances, or their absence accepted
      knowingly.
- [x] Build clean, `npm run check` clean.
- [ ] Checked in Safari at desktop and phone widths, both appearances.
- [ ] Keyboard pass: skip link, header, menu, every CTA.
- [x] Confirmed no checkout code, no paid-download link, no secrets in the
      built output.
