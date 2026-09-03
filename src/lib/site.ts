/**
 * Site-wide constants.
 *
 * `SITE_URL` is a placeholder until the real LCR Labs domain is registered and
 * pointed at Cloudflare Pages. It only affects canonical URLs, Open Graph URLs
 * and the generated sitemap — change it in one place when the domain is final.
 */
export const SITE_URL = 'https://lcrlabs.com';

export const SITE_NAME = 'LCR Labs';
export const SITE_TAGLINE = 'Thoughtful software for macOS.';
export const SITE_DESCRIPTION =
  'LCR Labs is an independent software label building small, focused macOS utilities that are native, private and deliberately simple.';

/** Shown in the footer and imprint. */
export const COPYRIGHT_YEAR = 2026;

export const NAV_LINKS = [
  { label: 'Products', href: '/products/' },
  { label: 'About', href: '/about/' },
  { label: 'Support', href: '/support/' },
] as const;
