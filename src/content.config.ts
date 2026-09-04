import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * A product screenshot, in both appearances.
 *
 * The two files must show the same app state, the same window size and the
 * same crop, so that switching between them reads as a change of appearance
 * and nothing else. `darkSrc` is optional: a screenshot with no dark variant
 * keeps the light one in both appearances rather than being hidden.
 *
 * `width` and `height` are the file's real pixel dimensions and are required.
 * They reserve the space before anything is loaded, which is what keeps the
 * first paint and every later theme swap free of layout shift.
 */
const screenshotSchema = z.object({
  lightSrc: z.string(),
  darkSrc: z.string().optional(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
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
     * The lead product on the homepage: told at full width with its
     * screenshot. Everything else is listed compactly below it. Moving the
     * emphasis to another product is a change to this flag and nothing else.
     */
    featured: z.boolean().default(false),

    /** Path under /public/products, or null while no icon exists yet. */
    icon: z.string().nullable().default(null),
    screenshots: z.array(screenshotSchema).default([]),

    platform: z.enum(['macOS', 'iOS', 'iPadOS', 'Other']).default('macOS'),
    minimumOS: z.string().optional(),
    architecture: z.string().optional(),
    version: z.string().optional(),

    /**
     * Where the product actually is. `coming-soon` is reserved for a release
     * that is genuinely imminent — a product being worked on is
     * `in-development`, and one that is still an idea is `in-planning`.
     * Saying less than the truth is fine here; saying more is not.
     */
    status: z.enum([
      'available',
      'beta',
      'coming-soon',
      'in-development',
      'in-planning',
    ]),
    /** Short, honest note about why a product is not yet available. */
    statusNote: z.string().optional(),

    features: z
      .array(z.object({ title: z.string(), description: z.string() }))
      .default([]),
    /** Terse benefit lines for the homepage lead. Keep to three or four. */
    highlights: z.array(z.string()).default([]),

    /** One or two sentences on how this product handles user data. */
    privacyNote: z.string().optional(),
  }),
});

export const collections = { products };
