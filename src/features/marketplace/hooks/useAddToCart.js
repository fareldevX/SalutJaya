import { useEffect, useRef, useState } from 'react'
import { track } from '@/shared/lib/analytics'
import { useCartStore } from '@/shared/store/cart.store'

/** Tambah produk ke keranjang (stok habis otomatis masuk sebagai permintaan penawaran) + umpan balik singkat. */
export function useAddToCart(product) {
  const add = useCartStore((s) => s.add)
  const [added, setAdded] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const addToCart = () => {
    add(product)
    track('add_to_cart', { id: product.id, mode: product.stock === 0 ? 'quote' : 'buy' })
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1400)
  }
  return { addToCart, added }
}
