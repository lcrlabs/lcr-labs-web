import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * A value that exists once per language.
 *
 * Both languages are required rather than optional, so a product cannot ship
 * with a German page that quietly falls back to an English sentence — the
 * build fails instead.
 */
const localized = <T extends z.ZodType>(value: T) => z.object({ en: value, de: value });

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
 *
 * The image is the same in both languages; only its description is not.
 */
const screenshotSchema = z.object({
  lightSrc: z.string(),
  darkSrc: z.string().optional(),
  alt: localized(z.string()),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/**
 * Everything about a product that is prose, in one language.
 *
 * Technical metadata — the name, the platform, the minimum OS, the status, the
 * screenshot files — is deliberately outside this block: it is the same fact
 * in every language and duplicating it would only create a way for the two to
 * disagree.
 */
const contentSchema = z.object({
  /** One sentence. Used in listings, meta descriptions and cards. */
  shortDescription: z.string(),
  /** One or two paragraphs for the product page hero. */
  longDescription: z.string(),
  /** Short, honest note about a product’s availability. */
  statusNote: z.string().optional(),
  features: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .default([]),
  /** Terse benefit lines for the homepage lead. Keep to three or four. */
  highlights: z.array(z.string()).default([]),
  /** One or two sentences on how this product handles user data. */
  privacyNote: z.string().optional(),
});

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    /** Controls homepage and /products ordering. Lower comes first. */
    order: z.number(),

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
    /** Prose rather than an identifier, so it is written per language. */
    architecture: localized(z.string()).optional(),
    version: z.string().optional(),
    /** Official store listing, supplied only for a released product. */
    appStoreUrl: z.url({ protocol: /^https$/, hostname: /^apps\.apple\.com$/ }).optional(),

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

    /** The product's copy, once per language. */
    localized: localized(contentSchema),
  }),
});

export const collections = { products };
