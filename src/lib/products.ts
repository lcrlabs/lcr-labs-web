import { getCollection, type CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>;
export type ProductStatus = Product['data']['status'];

/** Products in their configured display order. Adding a JSON file is enough. */
export async function getProducts(): Promise<Product[]> {
  const products = await getCollection('products');
  return products.sort((a, b) => a.data.order - b.data.order);
}

const STATUS_LABELS: Record<ProductStatus, string> = {
  available: 'Available',
  beta: 'Beta',
  'coming-soon': 'Coming soon',
  'in-development': 'In development',
  'in-planning': 'In planning',
};

export function statusLabel(product: Product): string {
  return STATUS_LABELS[product.data.status];
}

/**
 * The one status label a group of products shares, or `null` when they differ.
 *
 * Lets a section be headed by what its products actually are — "In planning" —
 * without that heading being able to outlive the data it describes.
 */
export function sharedStatusLabel(products: Product[]): string | null {
  const labels = [...new Set(products.map(statusLabel))];
  return labels.length === 1 ? labels[0] : null;
}

/** The product page URL. Every product in the collection has one. */
export function productHref(product: Product): string {
  return `/products/${product.id}/`;
}
