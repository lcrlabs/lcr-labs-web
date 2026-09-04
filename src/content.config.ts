import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * How a product is distributed commercially.
 *
 * Setapp is the distribution and monetization layer for LCR Labs macOS apps —
 * the website never sells, licenses or delivers anything itself. Every field
 * here is optional on purpose: the real values come from the LCR Labs Setapp
 * developer account and are filled in only once they exist. Nothing in the
 * site may invent a URL or an identifier.
 */
const setappSchema = z.object({
  /** Which Setapp commercial model this product uses, once decided. */
  model: z.enum(['membership', 'single-app', 'both']).optional(),
  /** Official app page on setapp.com. The CTA stays inactive without it. */
  productUrl: z.url().optional(),
  /** Official partner/referral link; preferred over `productUrl` when present. */
  partnerUrl: z.url().optional(),
  /** Only needed if the official "Available on Setapp" component requires it. */
  appId: z.string().optional(),
  vendorId: z.string().optional(),
  /**
   * Informational only, and only for Single-App Distribution. The transaction
   * still happens on Setapp — never render this as a price the site charges.
   */
  priceLabel: z.string().optional(),
});

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    /** Controls homepage and /products ordering. Lower comes first. */
    order: z.number(),
    /** One sentence. Used in listings, meta descriptions and cards. */
    shortDescription: z.string(),
    /** One or two paragraphs for the product page hero. */
    longDescription: z.string(),

    /**
     * True while the product has no confirmed public name or announced
     * details. Renders as a reserved slot instead of a product, so an
     * unannounced product never gets invented copy or a fake CTA.
     */
    placeholder: z.boolean().default(false),

    /** Path under /public/products, or null while no icon exists yet. */
    icon: z.string().nullable().default(null),
    screenshots: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),

    platform: z.enum(['macOS', 'iOS', 'iPadOS', 'Other']).default('macOS'),
    minimumOS: z.string().optional(),
    architecture: z.string().optional(),
    version: z.string().optional(),

    status: z.enum(['available', 'coming-soon', 'beta']),
    /** Short, honest note about why a product is not yet available. */
    statusNote: z.string().optional(),

    features: z
      .array(z.object({ title: z.string(), description: z.string() }))
      .default([]),
    /** Terse benefit lines for the homepage row. Keep to three or four. */
    highlights: z.array(z.string()).default([]),

    /** One sentence on how this product handles user data. */
    privacyNote: z.string().optional(),

    setapp: setappSchema.default({}),
  }),
});

export const collections = { products };
