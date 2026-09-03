# LCR Labs Web — GitHub Pages Deployment

**Date:** 2026-09-03
**Repository:** `lucaiscodingstuff/lcr-labs-web`
**Production URL:** https://lcrlabs.de

---

## 1. Result

**Completed.** https://lcrlabs.de serves the built LCR Labs site over HTTPS,
published by GitHub Actions to GitHub Pages. Verified by fetching every route
after deployment (§7).

The production origin moved from the `https://lcrlabs.com` placeholder to
`https://lcrlabs.de`, and hosting moved from Cloudflare Pages to GitHub Pages.
No design, markup, product data or dependency changed.

---

## 2. Files changed

### Created

| File | Purpose |
|---|---|
| `.github/workflows/deploy.yml` | Install → check → build → upload → deploy |
| `public/CNAME` | `lcrlabs.de`, copied into the published artifact |
| `public/.nojekyll` | Keeps Jekyll away from Astro's `_astro/` directory |

### Changed

| File | Change |
|---|---|
| `src/lib/site.ts` | `SITE_URL` → `https://lcrlabs.de`; comment no longer calls it a placeholder |
| `public/robots.txt` | `Sitemap:` → `https://lcrlabs.de/sitemap.xml` |
| `astro.config.mjs` | Comments describe GitHub Pages and record why there is no `base` |
| `public/_headers` | Header comment now states the file is inert on GitHub Pages |
| `docs/deployment.md` | Rewritten for the GitHub Actions → Pages setup |
| `README.md` | Domain and hosting references |
| `CLAUDE.md` | "deployed to Cloudflare Pages" → GitHub Actions / GitHub Pages |

### Deleted

None. The repository-root `CNAME` created earlier through the GitHub web UI was
left in place (see §5).

---

## 3. Production domain configuration

`SITE_URL` in `src/lib/site.ts` is the single definition of the origin. It feeds
`site` in `astro.config.mjs`, which drives every absolute URL Astro emits.

| Surface | Source | Value in the build |
|---|---|---|
| Astro `site` | `SITE_URL` | `https://lcrlabs.de` |
| Canonical URLs | `Astro.site` in `BaseLayout` | `https://lcrlabs.de/<path>/` |
| Open Graph `og:url` / `og:image` | `Astro.site` in `BaseLayout` | `https://lcrlabs.de/…` |
| Sitemap | `SITE_URL` in `sitemap.xml.ts` | 9 URLs, all `https://lcrlabs.de` |
| robots.txt | literal | `https://lcrlabs.de/sitemap.xml` |
| CNAME | literal | `lcrlabs.de` |
| Structured data | `products/[slug].astro` | contains no URLs — nothing to change |

`grep` over the whole repository and over `dist/` returns **zero** remaining
`lcrlabs.com` references.

---

## 4. GitHub Pages configuration

| Setting | Before | After |
|---|---|---|
| Build type | `legacy` (branch `main`, folder `/`) | `workflow` (GitHub Actions) |
| Custom domain | `lcrlabs.de` | `lcrlabs.de` (unchanged) |
| Enforce HTTPS | on | on (unchanged) |
| Certificate | approved, covers apex + `www` | unchanged, expires 2026-12-02 |
| Status | `errored` | `built` |

The build type was changed via the API
(`PUT /repos/lucaiscodingstuff/lcr-labs-web/pages`, `build_type=workflow`). This
was necessary: the branch-based method was publishing the repository *source*,
which has no `index.html` at its root — which is why Pages read `errored` and
every previous `pages build and deployment` run failed.

DNS was not touched. No Cloudflare involvement.

There is **no `base`** in the Astro config. The site is at the root of an apex
domain, so a `/lcr-labs-web/` base would have broken every root-relative asset
and link.

---

## 5. CNAME

Required, and it must be **in the published artifact**, not just in the
repository: `public/CNAME` → `dist/CNAME`. It contains exactly `lcrlabs.de` with
no other domain. GitHub also stores the custom domain in the Pages settings;
shipping the file means a settings reset cannot silently drop the domain.
Verified live: `https://lcrlabs.de/CNAME` returns 11 bytes.

The `CNAME` at the repository root (added through the web UI before this work)
is what the *branch-based* method read. The Actions method does not read it, so
it is now redundant. It was left in place — it holds the same value and removing
it gains nothing — and `docs/deployment.md` records why there are two.

---

## 6. Workflow

`.github/workflows/deploy.yml`, on push to `main` and on manual dispatch.

| Step | Action / command |
|---|---|
| Checkout | `actions/checkout@v7` |
| Node | `actions/setup-node@v7`, Node 22, npm cache |
| Install | `npm ci` — exactly the `package-lock.json` pin |
| Type check | `npm run check` (`astro check`) |
| Build | `npm run build` → `dist/` |
| Configure | `actions/configure-pages@v6` |
| Upload | `actions/upload-pages-artifact@v5`, `path: dist` |
| Deploy | `actions/deploy-pages@v5` (separate job, `needs: build`) |

Failure behaviour: `npm ci`, `astro check` and `astro build` all exit non-zero on
failure, which fails the `build` job. The `deploy` job has `needs: build`, so
nothing is published and the previous deployment stays live.

Permissions are the minimum Pages requires — `contents: read`, `pages: write`,
`id-token: write`. No secrets are used and none are needed. Concurrency group
`pages` with `cancel-in-progress: false`, so a running publish is never cut off.

No generated output is committed; `main` holds source only.

---

## 7. Build, check and verification results

### Local (before commit)

| Command | Result |
|---|---|
| `npm ci` | Success |
| `npm run check` | **0 errors, 0 warnings, 0 hints** (28 files) |
| `npm run build` | **Success** — 10 pages |

### Build-output inspection

- `lcrlabs.com` in `dist/`: **none**.
- `localhost` / `127.0.0.1` / `:4321` / filesystem paths in `dist/`: **none**.
- Every `href`/`src` in every built page checked programmatically: all
  root-relative, all resolve to a real file or directory index. **No broken
  asset paths, no broken product routes.**
- The only absolute URLs in the built HTML are the site's own canonical and
  Open Graph URLs. **No third-party origin is referenced anywhere.**
- `dist/index.html` present; `404.html`, `CNAME`, `.nojekyll`, `robots.txt`,
  `sitemap.xml` and all three product routes present.

### Design-change check

The pre-change commit was built in a scratch worktree and its `dist/` diffed
against the new one. The **only** differences are the first line of each page
(canonical + `og:url` + `og:image` host), `robots.txt`, the `_headers` comment,
and the two added files. Page bodies are identical and the fingerprinted asset
names are unchanged (`BaseLayout.wM9qJYYa.css`, `index.2ouUstnY.css`,
`page.CMFgH77u.js`) — content-hashed names cannot survive a CSS or JS edit, so
this is proof that no style or script changed.

### Live verification (after deployment)

All over HTTPS against `https://lcrlabs.de`:

| Route | Status |
|---|---|
| `/`, `/products/`, `/about/`, `/support/`, `/privacy/`, `/imprint/` | 200 `text/html` |
| `/products/background-doctor/`, `/products/edgehold/`, `/products/threadmark/` | 200 `text/html` |
| `/sitemap.xml` | 200 `application/xml` |
| `/robots.txt` | 200 `text/plain` |
| `/CNAME` | 200 |
| `/brand/og-default.jpg`, `/favicon-32.png` | 200 |
| unknown path | 404 serving the site's own page (`<title>Page not found — LCR Labs</title>`) |
| `/_astro/*.css`, `/_astro/*.js` | 200, correct content types |

Redirects: `http://lcrlabs.de/` → `https://lcrlabs.de/` (301);
`https://www.lcrlabs.de/` → `https://lcrlabs.de/` (301). Clean URLs work — the
directory `index.html` layout is served without host-side rewrites. The live
canonical on the homepage reads `https://lcrlabs.de/`.

### Not performed

Safari visual QA was skipped by explicit decision, on the evidence above that no
markup, CSS or JS changed. Nothing else in the project's verification list was
skipped.

---

## 8. Commits and push

| Commit | Subject |
|---|---|
| `5624990` | Deploy to GitHub Pages at lcrlabs.de |
| `e5989b0` | Use current major versions of the Pages actions |

The first push was rejected as non-fast-forward: `origin/main` held three web-UI
commits (`0ac669c`, `e696b90`, `96722f5` — creating, deleting and recreating the
root `CNAME`) that were not local. The work was rebased onto `origin/main`; no
conflicts, nothing discarded.

**Push:** succeeded, `96722f5..e5989b0 main -> main`, then `5624990..e5989b0`.
Local `main` and `origin/main` are level at `e5989b0`.

The second commit exists because the first (green) run warned that
`checkout@v4`, `setup-node@v4` and `configure-pages@v5` target the deprecated
Node 20 runtime and were being forced onto Node 24. Moving to the current majors
removes that warning.

---

## 9. Deployment status

| Run | Result |
|---|---|
| `33788065943` (commit `5624990`) | **success** — build 29s, deploy 8s |
| `33788216323` (commit `e5989b0`) | **success** — build 37s, deploy 9s, no annotations |

Pages API now reports `status: built`, `build_type: workflow`, `cname:
lcrlabs.de`, `https_enforced: true`.

**The site is live and serving the built LCR Labs website at
https://lcrlabs.de.**

---

## 10. Security and privacy

Unchanged in substance, with one honest loss.

- No analytics, cookies, trackers or external services were added. The built
  HTML references no third-party origin at all.
- No secrets exist in the repository or the workflow. The workflow uses the
  ephemeral `GITHUB_TOKEN` with three scopes and OIDC for the Pages deployment.
- No commerce code, no paid download, no `/download/` route, no invented Setapp
  URL — confirmed by inspecting the build.
- **Response headers no longer apply.** GitHub Pages serves static files with
  its own fixed headers and reads no per-site header file, so the CSP, HSTS,
  `nosniff`, `Permissions-Policy` and `frame-ancestors` rules in
  `public/_headers` are inert. Confirmed on the live response. The file is kept
  and clearly labelled rather than deleted, since it is the reviewed policy and
  applies unchanged behind any host that reads it. HTTPS is still enforced by
  Pages and both `http://` and `www.` redirect to the canonical origin.

This is a real reduction in defence in depth. It is not a live vulnerability —
the site loads nothing third-party, sets no cookies, has no forms and runs no
analytics — but restoring those headers would require a host in front of Pages,
which is a deliberate decision, not a config tweak.

---

## 11. Remaining manual steps

**None required for the site to be live.** It already is.

One thing worth knowing: the Pages **Source** must stay on *GitHub Actions*
(Settings → Pages). Switching it back to a branch would publish the repository
source instead of the build and break the site.

Unrelated to deployment, the pre-launch checklist in `docs/deployment.md` still
has open items that are content, not configuration: the imprint, privacy notice
and support address are scaffolds carrying a visible `DraftNotice`, and the
privacy page's hosting section should now name GitHub Pages / GitHub Inc. rather
than Cloudflare. Those are legal-content decisions and were deliberately not
touched here.

---

## 12. Next step

Complete and review the legal pages — imprint, privacy (including the corrected
hosting disclosure), support contact — and remove their `DraftNotice` components.
That is the last thing standing between the current state and a site that can be
publicised.
