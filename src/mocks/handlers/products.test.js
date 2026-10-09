import { describe, expect, it } from 'vitest'
import { queryProducts } from './products'

const q = (s) => queryProducts(new URLSearchParams(s))

describe('mock API produk (kontrak untuk backend Go)', () => {
  it('memfilter kategori, brand, dan pencarian', () => {
    expect(q('cat=router').items.every((p) => p.category === 'router')).toBe(true)
    expect(q('brand=Cisco').items.every((p) => p.brand === 'Cisco')).toBe(true)
    expect(q('q=mikrotik').items.map((p) => p.brand)).toEqual(['MikroTik', 'MikroTik'])
  })
  it('memfilter rentang harga dan mengurutkan', () => {
    const r = q('min=100000000&max=300000000&sort=price_asc')
    expect(r.items.every((p) => p.price >= 100e6 && p.price <= 300e6)).toBe(true)
    const prices = r.items.map((p) => p.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })
  it('paginasi: total tetap, halaman terakhir lebih pendek', () => {
    const p1 = q('limit=12&page=1')
    const p3 = q('limit=12&page=3')
    expect(p1.total).toBe(28)
    expect(p1.items).toHaveLength(12)
    expect(p3.items).toHaveLength(4)
  })
  it('facet mencakup kategori, brand, form factor, dan rentang harga', () => {
    const { facets } = q('')
    expect(Object.keys(facets.categories).sort()).toEqual(['router', 'server', 'switch'])
    expect(facets.price.min).toBeLessThan(facets.price.max)
    expect(Object.keys(facets.formFactors).length).toBeGreaterThan(0)
  })
})
