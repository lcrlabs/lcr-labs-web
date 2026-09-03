import { getCollection, type CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>;

/** Products in their configured display order. Adding a JSON file is enough. */
export async function getProducts(): Promise<Product[]> {
  const products = await getCollection('products');
  return products.sort((a, b) => a.data.order - b.data.order);
}

/**
 * The Setapp destination for a product, or `null` when none is configured.
 *
 * The partner link is preferred when present so referral attribution survives,
 * falling back to the plain product page. A URL is only ever read from the
 * product's own data — the site never derives, guesses or templates one.
 */
export function setappHref(product: Product): string | null {
  const { partnerUrl, productUrl } = product.data.setapp;
  return partnerUrl ?? productUrl ?? null;
}

/**
 * Whether to render an actionable "View on Setapp" control.
 *
 * Both conditions matter: a product still in development must not link out
 * even if a URL was configured early, and an available product without a
 * confirmed destination gets no CTA rather than an invented one.
 */
export function hasSetappDestination(product: Product): boolean {
  return product.data.status === 'available' && setappHref(product) !== null;
}

const STATUS_LABELS: Record<Product['data']['status'], string> = {
  available: 'Available',
  'coming-soon': 'Coming soon',
  beta: 'Beta',
};

export function statusLabel(product: Product): string {
  return STATUS_LABELS[product.data.status];
}

/** The product page URL. Placeholder slots have no page of their own. */
export function productHref(product: Product): string | null {
  return product.data.placeholder ? null : `/products/${product.id}/`;
}
