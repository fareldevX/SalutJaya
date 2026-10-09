import { beforeEach, describe, expect, it } from 'vitest'
import { cartTotals, MAX_QUOTE_QTY, useCartStore } from './cart.store'

const product = (o = {}) => ({
  id: 'p-1',
  slug: 'p-1',
  name: 'Switch A',
  category: 'switch',
  price: 1_000_000,
  stock: 3,
  specSummary: ['a', 'b', 'c'],
  ...o,
})
const get = () => useCartStore.getState()

describe('cart store', () => {
  beforeEach(() => {
    localStorage.clear()
    get().clear()
  })

  it('menambah produk dan menaikkan qty bila sudah ada', () => {
    get().add(product())
    get().add(product())
    expect(get().lines).toHaveLength(1)
    expect(get().lines[0].qty).toBe(2)
  })

  it('membatasi qty "beli" pada stok, tetapi tidak membatasi "penawaran"', () => {
    get().add(product({ stock: 2 }))
    get().setQty('p-1', 10)
    expect(get().lines[0].qty).toBe(2)
    get().setMode('p-1', 'quote')
    get().setQty('p-1', 10)
    expect(get().lines[0].qty).toBe(10)
    get().setQty('p-1', 99_999)
    expect(get().lines[0].qty).toBe(MAX_QUOTE_QTY)
  })

  it('produk stok habis otomatis masuk mode penawaran dan tidak bisa dialihkan ke beli', () => {
    get().add(product({ stock: 0 }))
    expect(get().lines[0].mode).toBe('quote')
    get().setMode('p-1', 'buy')
    expect(get().lines[0].mode).toBe('quote')
  })

  it('syncStock menyesuaikan qty dan mencatat notifikasi', () => {
    get().add(product({ stock: 5 }))
    get().setQty('p-1', 5)
    get().syncStock({ 'p-1': 2 })
    expect(get().lines[0]).toMatchObject({ qty: 2, stock: 2, mode: 'buy' })
    expect(get().notices).toEqual([{ id: 'p-1', name: 'Switch A', type: 'reduced', to: 2 }])
    get().syncStock({ 'p-1': 0 })
    expect(get().lines[0].mode).toBe('quote')
    expect(get().notices.at(-1).type).toBe('out')
  })

  it('syncStock tidak mengubah item penawaran dan mengabaikan id yang tidak dikenal', () => {
    get().add(product(), 'quote')
    get().setQty('p-1', 50)
    get().syncStock({ 'p-1': 1, zzz: 9 })
    expect(get().lines[0]).toMatchObject({ qty: 50, mode: 'quote', stock: 1 })
    expect(get().notices).toHaveLength(0)
  })

  it('cartTotals: subtotal hanya dari item beli langsung', () => {
    get().add(product({ id: 'a', price: 2_000_000, stock: 5 }))
    get().setQty('a', 2)
    get().add(product({ id: 'b', price: 9_000_000 }), 'quote')
    const t = cartTotals(get().lines)
    expect(t.subtotal).toBe(4_000_000)
    expect(t.count).toBe(3)
    expect(t.buyLines).toHaveLength(1)
    expect(t.quoteLines).toHaveLength(1)
  })
})
