import { delay, http, HttpResponse } from 'msw'
import products from '../data/products.json'

const count = (list, key) =>
  list.reduce((acc, p) => ({ ...acc, [p[key]]: (acc[p[key]] ?? 0) + 1 }), {})

const sorters = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
}

/** Logika query murni, meniru perilaku endpoint Go GET /api/v1/products. */
export function queryProducts(sp) {
  const cat = sp.get('cat')
  const brand = sp.get('brand')
  const ff = sp.get('ff')
  const q = sp.get('q')?.toLowerCase().trim()
  const min = Number(sp.get('min')) || 0
  const max = Number(sp.get('max')) || Infinity
  const page = Math.max(1, Number(sp.get('page')) || 1)
  const pageSize = Math.min(48, Number(sp.get('limit')) || 12)

  const filtered = products
    .filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!brand || p.brand === brand) &&
        (!ff || p.specs['Form factor'] === ff)
    )
    .filter((p) => p.price >= min && p.price <= max)
    .filter((p) => !q || `${p.name} ${p.specSummary.join(' ')}`.toLowerCase().includes(q))
    .sort(sorters[sp.get('sort')] ?? sorters.featured)

  const prices = products.map((p) => p.price)
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
    facets: {
      categories: count(products, 'category'),
      brands: count(products, 'brand'),
      formFactors: Object.fromEntries(
        Object.entries(
          count(
            products.map((p) => ({ ff: p.specs['Form factor'] })),
            'ff'
          )
        )
      ),
      price: { min: Math.min(...prices), max: Math.max(...prices) },
    },
  }
}

export const productHandlers = [
  http.get('*/api/v1/products', async ({ request }) => {
    await delay(450)
    return HttpResponse.json(queryProducts(new URL(request.url).searchParams))
  }),
  http.get('*/api/v1/products/:slug', async ({ params }) => {
    await delay(300)
    const found = products.find((p) => p.slug === params.slug)
    return found
      ? HttpResponse.json(found)
      : HttpResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 })
  }),
  // Stok real-time: ?ids=p-001,p-002 => { "p-001": 6, ... }
  http.get('*/api/v1/stock', async ({ request }) => {
    await delay(200)
    const ids = new URL(request.url).searchParams.get('ids')?.split(',') ?? []
    return HttpResponse.json(
      Object.fromEntries(products.filter((p) => ids.includes(p.id)).map((p) => [p.id, p.stock]))
    )
  }),
]
