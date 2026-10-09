import { z } from 'zod'
import { parseResponse, request } from '@/shared/lib/apiClient'

const stockSchema = z.record(z.string(), z.number().int().min(0))
const orderSchema = z.object({
  orderId: z.string().nullable(),
  quoteId: z.string().nullable(),
  totals: z.object({ subtotal: z.number() }),
})

/** Stok terkini: { "p-001": 6, ... } */
export async function getStock(ids, signal) {
  return parseResponse(
    stockSchema,
    await request('/stock', { params: { ids: ids.join(',') }, signal })
  )
}

/** Kirim pesanan. Server menghitung ulang harga dan stok; 409 bila stok berubah (data.conflicts). */
export async function submitOrder(payload) {
  return parseResponse(orderSchema, await request('/orders', { method: 'POST', body: payload }))
}
