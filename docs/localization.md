# Localization

The site is published in English and German. This document is the contract that
implementation follows: what is fixed, what a future language is allowed to
change, and where a third locale would have to be touched. `CLAUDE.md` states
the same rules in short form; where the two disagree, `CLAUDE.md` is the rule
and this file is out of date.

Nothing here is aspirational — it describes the implementation as it stands and
is verified by `npm run check`, `npm run build` and the checks at the end.

## The shape of it

English is the default language and carries **no prefix**; German lives under
`/de/`. There is no `/en/`, and nothing redirects — the URL a reader asks for is
the page they get. `lcrlabs.de` therefore serves English, always, to everyone.

```
/                            /de/
/products/                   /de/products/
/products/<slug>/            /de/products/<slug>/
/about/                      /de/about/
/support/                    /de/support/
/privacy/                    /de/privacy/
/imprint/                    /de/imprint/
/404.html                    (English only — see below)
```

| Piece | Where | Responsibility |
|---|---|---|
| Locale configuration | [`src/i18n/index.ts`](../src/i18n/index.ts) | `LOCALES`, `DEFAULT_LOCALE`, the prefix per locale, the set of translated paths, and every path helper. |
| Source dictionary | [`src/i18n/en.ts`](../src/i18n/en.ts) | Every UI string, in English. The shape all other dictionaries are typed against. |
| Translations | [`src/i18n/de.ts`](../src/i18n/de.ts) | The same keys in German. `satisfies typeof en`, so a missing or extra key fails the build. |
| Page bodies | [`src/views/`](../src/views/) | One body per page, written once, taking a `locale`. |
| Routes | [`src/pages/`](../src/pages/) | Thin wrappers — an import and one element. English at the root, German under `de/`. |
| Product data | [`src/content/products/`](../src/content/products/) | Facts at the top level, prose under `localized`, once per language. |
| Head and metadata | [`src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) | `<html lang>`, title, description, canonical, `hreflang`, Open Graph locale. |
| Sitemap | [`src/pages/sitemap.xml.ts`](../src/pages/sitemap.xml.ts) | Every canonical path, once per locale, each declaring its alternates. |
| Language control | [`src/components/LanguageSwitcher.astro`](../src/components/LanguageSwitcher.astro) | Real links to the equivalent page in each language. |

`/404` is the one page with no counterpart: GitHub Pages serves a single
`404.html` for the whole domain, so there is nowhere a German one could be
served from. It declares no `hreflang` alternates — claiming alternates it does
not have would be worse than declaring none — and the switcher on it falls back
to the other language's homepage rather than to a URL that does not exist.

## Invariants

These hold today and must keep holding.

- **English is the default and is unprefixed.** No `/en/` route is ever
  introduced, and no redirect is ever added — not for a locale, not for a
  browser language, not for a stored preference.
- **`en.ts` is the source dictionary**; every other dictionary is typed against
  it. There is no silent fallback to English anywhere, in UI copy or in product
  content: a missing translation is a build failure.
- **`src/i18n/index.ts` owns locale routing.** Prefixes, the canonical-path
  arithmetic and the list of translated paths live there and nowhere else.
- **A page body is written once.** It lives in `src/views/`, takes a `locale`,
  and is rendered by a route file of three lines. A page is never copied to
  translate it.
- **Every internal link goes through `localePath`** — a canonical (English) path
  plus the current locale. Hard-coding `/de/...` in a component is how a German
  page ends up linking to an English one.
- **Product technical metadata is language-independent.** The name, order,
  platform, minimum OS, version, status and screenshot files sit at the top
  level of the product JSON, because they are the same fact in every language.
- **Product prose is localized.** Short and long description, status note,
  features, highlights, privacy note and screenshot `alt` sit under `localized`,
  once per language, all required.
- **The switcher goes to the equivalent logical page**, and falls back to that
  language's homepage only where no counterpart exists.
- **Canonicals are self-referential.** `/about/` is canonical for itself and
  `/de/about/` is canonical for itself; neither points at the other.
- **Every translated page emits three `hreflang` links** — `en`, `de` and
  `x-default` — and both language versions emit the same set.
- **`x-default` is English**, on every page and in the sitemap. It is derived
  from `DEFAULT_LOCALE`, not written out by hand.
- **Both locales appear in the sitemap**, each entry declaring the full set of
  alternates, so the two versions are indexed as one page in two languages.
- **No external translation service or localization API.** See *Privacy*.

## Storage: `lcr-language`

The language preference is stored under `lcr-language`, alongside `lcr-theme`.
Its behaviour is deliberate and must not change without a decision that says so:

- Written **only** when a reader clicks the language control. Nothing else
  writes it — not a page load, not a first visit, not a build.
- Holds a supported locale value and nothing else.
- **Read by nothing that changes navigation.** There is no browser-language
  detection, no automatic redirect, no locale negotiation and no first paint in
  a language the URL did not ask for.
- Not used for analytics, advertising, profiling, personalization or
  measurement of any kind. It never leaves the browser.
- Failing to write it (private browsing, blocked storage) is caught and
  ignored — the choice simply does not persist.

The consequence is the property worth protecting: visiting `lcrlabs.de` gives
English, to a reader and to a crawler, every time, whatever the browser asks
for and whatever was stored earlier. German is reached by a URL, and only by a
URL.

Both privacy pages disclose `lcr-language` and `lcr-theme` by name. They are the
only browser storage the site uses; if that ever changes, both pages change with
it.

## Privacy

Localization is fully local and fully static. Translations are written into the
repository and bundled at build time; the built pages contain the finished text
and request nothing to produce it.

Never introduce:

- a translation API or machine-translation service called at runtime,
- an external localization script, CDN-hosted dictionary or locale bundle,
- localization telemetry, or any measurement of language choice,
- analytics or advertising keyed on language,
- language-based tracking, fingerprinting or segmentation of any kind.

A visitor's language choice is not data the site collects. It is a URL they
navigated to.

## Legal pages

The legal pages are the one place a page body is not shared: legal text is not a
translation of a dictionary key, so the four bodies are written out in
[`src/views/legal/`](../src/views/legal/) and share only the `LegalPage` frame.

- **The German pages are the source text.** `ImprintDe.astro` and
  `PrivacyDe.astro` carry the finalized German wording and are the versions that
  discharge the duty.
- **The English pages are translations** for accessibility and international
  readers. Each says so and links to the German version as the authoritative
  one.
- **The law does not change with the language.** The site is operated from
  Germany, so both language versions state German and EU duties — GDPR, DDG,
  TDDDG. German or EU references are never replaced with US or other foreign
  law, and no foreign-law section is ever added to the English version.
- **The facts are identical across the pair.** Operator name, postal address,
  contact address, hosting and infrastructure disclosures, supervisory
  authority, storage keys and dates must match exactly. Official names of
  authorities and companies stay in their own language in both versions — they
  are names, not prose.
- **An edit to one version triggers a check of the other.** Change a fact in one
  and it changes in both, or neither is true. The same applies when the
  implementation changes: if the site starts or stops depending on a service,
  all four legal pages are reviewed, not just the German ones.

Legal wording here is written, not lawyer-reviewed; independent review is still
an open item in [`deployment.md`](deployment.md).

## A product is not finished until it is localized

A new public product page is incomplete unless all of the following are true:

- [ ] English copy exists — description, long description, status note,
      features, highlights.
- [ ] German copy exists for the same keys. The schema requires both, so this is
      a build failure rather than a review finding.
- [ ] Localized metadata: title and meta description resolve in both languages,
      and the JSON-LD `description` and `inLanguage` follow the page.
- [ ] Screenshot `alt` text is written in both languages.
- [ ] Every internal link on the page goes through `localePath`.
- [ ] Both route variants build — `/products/<slug>/` and
      `/de/products/<slug>/`.
- [ ] The page pair appears in the sitemap and emits `en`, `de` and `x-default`.

**Localized screenshot images are not required.** An English screenshot may
stand on a German page while no German capture exists, provided the `alt` text
is German and nothing on the page claims the screenshot is localized. A
translated caption over an English screenshot is honest; a claim that the app is
shown in German when it is not, is not.

## Adding a locale later

The architecture is built to take more languages — French, Spanish, Italian and
Chinese are all plausible — and adding one must never require redesigning the
routing. The work is:

1. Add the locale to `LOCALES` and give it a prefix in `PREFIX`
   (`src/i18n/index.ts`).
2. Add its dictionary next to `en.ts` and `de.ts`, typed against `en`, and
   register it in `DICTIONARIES`.
3. Add its static routes under `src/pages/<locale>/` — thin wrappers around the
   existing views, exactly like `src/pages/de/`.
4. Extend the localized product content and let the existing helpers carry the
   metadata: `hreflang`, `og:locale`, the switcher and the sitemap all read
   `LOCALES`.
5. Translate the legal and product content accurately, under the rules above.

Nothing on that list is a structural change. What it touches, and how much of it
the compiler catches:

| File | What a new locale needs | Caught by `astro check`? |
|---|---|---|
| `src/i18n/index.ts` — `LOCALES`, `PREFIX`, `DICTIONARIES` | the locale, its prefix, its dictionary | **Yes** — `PREFIX` is a `Record<Locale, …>` and `DICTIONARIES` is `satisfies Record<Locale, typeof en>` |
| `src/i18n/index.ts` — `alternatePaths` | the new locale in the returned object | **Yes** — the return type is `Record<Locale, string>` |
| `src/i18n/<locale>.ts` | the whole dictionary, including its own `languages` map | **Yes** — typed against `typeof en` |
| `src/i18n/en.ts`, `de.ts` — `languages` | the new language's name, in each language | **Yes** — via the same typing |
| `src/content.config.ts` — `localized()` | the locale in the Zod object | **Yes** — `content()` in `lib/products.ts` indexes `localized` by `Locale` |
| `src/pages/<locale>/…` | one wrapper per page | No — a missing route is a missing page, not an error |
| `src/i18n/index.ts` — `localeFromPath`, `canonicalPath` | they test for `/de/` and strip three characters | **No** — silently wrong for a third prefix |
| `src/layouts/BaseLayout.astro` | three literal `<link rel="alternate">` tags, and `og:locale:alternate`, which assumes exactly one other language | **No** — typechecks, emits an incomplete set |
| `src/pages/sitemap.xml.ts` | nothing | — already maps `LOCALES` |
| `src/components/LanguageSwitcher.astro` | nothing | — already maps `LOCALES` |
| `TRANSLATED_PATHS`, `localePath`, `hasTranslation`, `alternatePath` | nothing | — canonical paths are locale-independent |

The last two rows of the "No" group are the whole list of places that would go
quietly wrong. They are known, not hidden, and both are a few lines: the head
block becomes a loop over `LOCALES`, and the two path helpers derive the prefix
from `PREFIX` instead of testing for `/de/`. They are left as they are because
the site has two languages today and speculative generality is its own cost —
but a third locale starts here, not in the routing.

Do not add French, Spanish, Italian or Chinese without an explicit instruction:
a language nobody can proof-read is worse than one the site does not offer.

## Verifying localization

After any change that touches i18n, routing or metadata, on the built `dist/`:

1. `npm run check` — 0 errors. This is what enforces dictionary parity.
2. `npm run build` — succeeds, and emits both variants of every page.
3. Route pairs: every English page has its counterpart, and no `/en/` path
   exists anywhere in the output or the sitemap.
4. `<html lang>` matches the directory the page is in.
5. Each page's canonical points at itself, and each emits `en`, `de` and
   `x-default`, with `x-default` on the English URL.
6. The sitemap lists both locales for every canonical path.
7. Internal links: no English page links into `/de/` and no German page links
   back out, except the language switcher and the legal cross-references.
8. Read the German pages for English strings and the English pages for German
   ones. Product names, brand names, technical terms, company and authority
   names, postal addresses, URLs and storage-key values are language-neutral by
   design and are not findings.
9. Use the switcher on every page in both directions: it must land on the same
   page in the other language, and no page may mix languages.
