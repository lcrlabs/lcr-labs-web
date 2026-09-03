import type { APIRoute } from 'astro';
import { getProducts, productHref } from '../lib/products';
import { SITE_URL } from '../lib/site';

/**
 * The sitemap. Product URLs come from the same collection the pages are built
 * from, so adding a product file is enough — nothing here needs editing.
 */
const STATIC_PATHS = ['/', '/products/', '/about/', '/support/', '/privacy/', '/imprint/'];

export const GET: APIRoute = async () => {
  const products = await getProducts();
  const productPaths = products
    .map(productHref)
    .filter((href): href is string => href !== null);

  const urls = [...STATIC_PATHS, ...productPaths]
    .map((path) => `  <url><loc>${new URL(path, SITE_URL).href}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
