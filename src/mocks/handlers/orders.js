import { delay, http, HttpResponse } from 'msw'
import products from '../data/products.json'

const ref = (p) => `${p}-${Date.now().toString(36).toUpperCase()}`

/** Meniru validasi server: stok dan harga dihitung ulang dari katalog, bukan dari klien. */
export const orderHandlers = [
  http.post('*/api/v1/orders', async ({ request }) => {
    await delay(900)
    const body = await request.json()
    const byId = Object.fromEntries(products.map((p) => [p.id, p]))
    const lines = body.lines ?? []

    const conflicts = lines
      .filter((l) => l.mode === 'buy' && (!byId[l.productId] || l.qty > byId[l.productId].stock))
      .map((l) => ({ productId: l.productId, available: byId[l.productId]?.stock ?? 0 }))
    if (conflicts.length)
      return HttpResponse.json(
        { message: 'Stok sebagian produk berubah.', conflicts },
        { status: 409 }
      )

    const buy = lines.filter((l) => l.mode === 'buy')
    const quote = lines.filter((l) => l.mode === 'quote')
    const subtotal = buy.reduce((n, l) => n + byId[l.productId].price * l.qty, 0)
    return HttpResponse.json(
      {
        orderId: buy.length ? ref('ORD') : null,
        quoteId: quote.length ? ref('QT') : null,
        totals: { subtotal },
      },
      { status: 201 }
    )
  }),
]
