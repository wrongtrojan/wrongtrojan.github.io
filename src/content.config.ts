import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const common = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional().default(''),
  date: z.coerce.date().optional(),
  draft: z.boolean().optional().default(false),
  weight: z.number().optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  series: z.array(z.string()).optional().default([]),
  series_order: z.number().optional().default(0),
});

const note = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/note' }),
  schema: common,
});

const create = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/create' }),
  schema: common,
});

export const collections = { note, create };
