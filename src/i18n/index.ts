import { en } from './en';
import { de } from './de';

/**
 * The site's two languages, and the route arithmetic that connects them.
 *
 * English is the default and carries no prefix, so every canonical URL the
 * site has ever had still resolves: `/about/` stays `/about/` and the German
 * page lives at `/de/about/`. There is deliberately no `/en/`, and nothing
 * here redirects — a reader who asks for a URL gets that URL.
 *
 * A "canonical path" below always means the English one. It is the single form
 * every other path is derived from, which is what keeps the language switcher,
 * the `hreflang` links and the sitemap from each having their own idea of
 * which pages exist.
 */
export const LOCALES = ['en', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** The prefix each locale's pages live under. English has none. */
const PREFIX: Record<Locale, string> = { en: '', de: '/de' };

const DICTIONARIES = { en, de } satisfies Record<Locale, typeof en>;

export type Translations = typeof en;

/** The dictionary for a locale. */
export function useTranslations(locale: Locale): Translations {
  return DICTIONARIES[locale];
}

/**
 * The canonical paths that exist in both languages.
 *
 * Patterns rather than a list of pairs, so every product page is covered by
 * one entry and adding a product still needs no change here. `/404` is
 * deliberately absent: GitHub Pages serves one `404.html` for the whole site,
 * so it has no German counterpart and the switcher falls back to `/de/`.
 */
const TRANSLATED_PATHS: readonly RegExp[] = [
  /^\/$/,
  /^\/products\/$/,
  /^\/products\/[^/]+\/$/,
  /^\/about\/$/,
  /^\/support\/$/,
  /^\/privacy\/$/,
  /^\/imprint\/$/,
];

/** One trailing slash, one leading slash, so paths compare as equals. */
function normalize(pathname: string): string {
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

/** The locale a URL belongs to, read from its prefix. */
export function localeFromPath(pathname: string | URL): Locale {
  const path = normalize(typeof pathname === 'string' ? pathname : pathname.pathname);
  return path === '/de/' || path.startsWith('/de/') ? 'de' : 'en';
}

/** The English path a URL corresponds to, whatever locale it is in. */
export function canonicalPath(pathname: string | URL): string {
  const path = normalize(typeof pathname === 'string' ? pathname : pathname.pathname);
  if (path === '/de/') return '/';
  return path.startsWith('/de/') ? path.slice(3) : path;
}

/** Where a canonical path lives in a given locale. */
export function localePath(canonical: string, locale: Locale): string {
  const path = normalize(canonical);
  return path === '/' ? `${PREFIX[locale]}/` : `${PREFIX[locale]}${path}`;
}

/** Whether a canonical path has a page in both languages. */
export function hasTranslation(canonical: string): boolean {
  const path = normalize(canonical);
  return TRANSLATED_PATHS.some((pattern) => pattern.test(path));
}

/**
 * The equivalent of the current URL in another locale.
 *
 * The same page wherever one exists, and that locale's homepage where one does
 * not — a switcher that lands on a 404 would be worse than one that lands a
 * level up.
 */
export function alternatePath(pathname: string | URL, locale: Locale): string {
  const canonical = canonicalPath(pathname);
  return localePath(hasTranslation(canonical) ? canonical : '/', locale);
}

/**
 * Every locale's version of the current page, for `hreflang` — or `null` where
 * the page exists in one language only and alternates would be a lie.
 */
export function alternatePaths(pathname: string | URL): Record<Locale, string> | null {
  const canonical = canonicalPath(pathname);
  if (!hasTranslation(canonical)) return null;
  return { en: localePath(canonical, 'en'), de: localePath(canonical, 'de') };
}

/**
 * Where an explicit language choice is remembered.
 *
 * Written only when a reader uses the switcher, read by nothing that changes
 * navigation: URLs stay explicit, so there is no redirect to loop, no flash
 * between languages and no reason for a crawler to see a different page than
 * a reader. Kept separate from `lcr-theme`, and disclosed on both privacy
 * pages alongside it.
 */
export const LANGUAGE_STORAGE_KEY = 'lcr-language';
