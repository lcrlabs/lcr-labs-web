/**
 * Site-wide constants.
 *
 * `SITE_URL` is the production origin. It affects canonical URLs, Open Graph
 * URLs and the generated sitemap — change it in one place if the domain ever
 * moves, and keep `public/robots.txt` and `public/CNAME` in step with it.
 *
 * Nothing here is language-dependent: the tagline, the site description and
 * every navigation label live in `src/i18n`, and the links below carry the
 * canonical (English) path plus the dictionary key that names it.
 */
export const SITE_URL = 'https://lcrlabs.de';

export const SITE_NAME = 'LCR Labs';

/**
 * The one contact and support address. Used on the support page, the imprint
 * and the privacy notice — one address everywhere, changed in one place.
 */
export const CONTACT_EMAIL = 'info.lcrlabs@gmx.de';

/** Shown in the footer and imprint. */
export const COPYRIGHT_YEAR = 2026;

/**
 * Header navigation. `path` is the canonical English path; `localePath` turns
 * it into the current locale's URL, and `key` names the label in `t.nav`.
 */
export const NAV_LINKS = [
  { key: 'products', path: '/products/' },
  { key: 'about', path: '/about/' },
  { key: 'support', path: '/support/' },
] as const;

/** Footer navigation: the header's links plus the two legal pages. */
export const FOOTER_LINKS = [
  ...NAV_LINKS,
  { key: 'privacy', path: '/privacy/' },
  { key: 'imprint', path: '/imprint/' },
] as const;
