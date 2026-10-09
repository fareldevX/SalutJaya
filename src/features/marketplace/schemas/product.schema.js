import { z } from 'zod'

export const CATEGORIES = ['server', 'switch', 'router']

export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.enum(CATEGORIES),
  price: z.number().positive(), // IDR, harga B2B sebelum PPN
  stock: z.number().int().min(0),
  featured: z.boolean().default(false),
  image: z.string().nullable(),
  specSummary: z.array(z.string()), // 3 spesifikasi inti untuk chip
  specs: z.record(z.string(), z.union([z.string(), z.number()])),
})

export const productListSchema = z.object({
  items: z.array(productSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
  facets: z.object({
    categories: z.record(z.string(), z.number()),
    brands: z.record(z.string(), z.number()),
    formFactors: z.record(z.string(), z.number()).default({}),
    price: z.object({ min: z.number(), max: z.number() }),
  }),
})

/** @typedef {import('zod').infer<typeof productSchema>} Product */
/** @typedef {import('zod').infer<typeof productListSchema>} ProductList */
