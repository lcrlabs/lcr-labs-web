import type { APIRoute } from 'astro';
import { getProducts } from '../lib/products';
import { SITE_URL } from '../lib/site';
import { LOCALES, DEFAULT_LOCALE, localePath } from '../i18n';

/**
 * The sitemap.
 *
 * Product URLs come from the same collection the pages are built from, and
 * every path is emitted once per language from the same canonical list, so
 * adding a product or a language needs no edit here.
 *
 * Each entry also declares its alternates, so the two language versions are
 * indexed as one page in two languages rather than as duplicates of each
 * other. The 404 page is deliberately absent: it is not a destination.
 */
const STATIC_PATHS = ['/', '/products/', '/about/', '/support/', '/privacy/', '/imprint/'];

const absolute = (path: string) => new URL(path, SITE_URL).href;

export const GET: APIRoute = async () => {
  const products = await getProducts();
  const canonicalPaths = [
    ...STATIC_PATHS,
    ...products.map((product) => `/products/${product.id}/`),
  ];

  const urls = canonicalPaths
    .flatMap((path) => {
      const alternates = [
        ...LOCALES.map(
          (locale) =>
            `    <xhtml:link rel="alternate" hreflang="${locale}" href="${absolute(localePath(path, locale))}" />`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(localePath(path, DEFAULT_LOCALE))}" />`,
      ].join('\n');

      return LOCALES.map(
        (locale) =>
          `  <url>\n    <loc>${absolute(localePath(path, locale))}</loc>\n${alternates}\n  </url>`,
      );
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
