import { parseResponse, request } from '@/shared/lib/apiClient'
import { productListSchema, productSchema } from '../schemas/product.schema'

/**
 * @param {{ cat?: string, brand?: string, q?: string, min?: number, max?: number,
 *           ff?: string, sort?: 'featured'|'price_asc'|'price_desc'|'name', page?: number, limit?: number }} params
 * @returns {Promise<import('../schemas/product.schema').ProductList>}
 */
export async function getProducts(params = {}, signal) {
  const data = await request('/products', { params, signal })
  return parseResponse(productListSchema, data) // kontrak API divalidasi saat runtime
}

/** @returns {Promise<import('../schemas/product.schema').Product>} */
export async function getProduct(slug, signal) {
  return parseResponse(
    productSchema,
    await request(`/products/${encodeURIComponent(slug)}`, { signal })
  )
}
