import { getCollection, type CollectionEntry } from 'astro:content';
import { localePath, useTranslations, type Locale } from '../i18n';

export type Product = CollectionEntry<'products'>;
export type ProductStatus = Product['data']['status'];
export type ProductContent = Product['data']['localized']['en'];

/** Products in their configured display order. Adding a JSON file is enough. */
export async function getProducts(): Promise<Product[]> {
  const products = await getCollection('products');
  return products.sort((a, b) => a.data.order - b.data.order);
}

/**
 * A product's copy in one language.
 *
 * Every component that shows prose goes through here rather than reaching into
 * `data.localized` itself, so there is one place a language can be wrong.
 */
export function content(product: Product, locale: Locale): ProductContent {
  return product.data.localized[locale];
}

export function statusLabel(product: Product, locale: Locale): string {
  const t = useTranslations(locale);
  return product.data.status === 'available' && product.data.appStoreUrl
    ? t.product.appStoreStatus
    : t.status[product.data.status];
}

/**
 * The one status label a group of products shares, or `null` when they differ.
 *
 * Lets a section be headed by what its products actually are — "In planning" —
 * without that heading being able to outlive the data it describes.
 */
export function sharedStatusLabel(products: Product[], locale: Locale): string | null {
  const statuses = [...new Set(products.map((product) => product.data.status))];
  return statuses.length === 1 ? useTranslations(locale).status[statuses[0]] : null;
}

/** The product page URL in a given language. */
export function productHref(product: Product, locale: Locale): string {
  return localePath(`/products/${product.id}/`, locale);
}
