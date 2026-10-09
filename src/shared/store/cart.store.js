import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Maks. kuantitas untuk item "minta penawaran" (tidak dibatasi stok). */
export const MAX_QUOTE_QTY = 999

const clampQty = (line, qty) => {
  const n = Math.max(1, Math.floor(Number(qty) || 1))
  return line.mode === 'buy' ? Math.min(n, Math.max(1, line.stock)) : Math.min(n, MAX_QUOTE_QTY)
}

/**
 * Keranjang B2B. Tiap baris punya mode: 'buy' (beli langsung, dibatasi stok) atau 'quote' (minta penawaran).
 * Disimpan di localStorage hanya sebagai kenyamanan: harga & stok SELALU divalidasi ulang server saat checkout.
 * Berada di `shared` karena dipakai lintas fitur (katalog, nav, checkout).
 */
export const useCartStore = create(
  persist(
    (set) => ({
      lines: [],
      notices: [], // pemberitahuan penyesuaian akibat perubahan stok

      /** @param {{id:string,slug:string,name:string,category:string,price:number,stock:number}} product */
      add: (product, mode = 'buy') =>
        set((s) => {
          const m = product.stock === 0 ? 'quote' : mode
          const exist = s.lines.find((l) => l.productId === product.id)
          if (exist)
            return {
              lines: s.lines.map((l) =>
                l === exist ? { ...l, qty: clampQty(l, l.qty + 1), stock: product.stock } : l
              ),
            }
          const line = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            specSummary: product.specSummary?.slice(0, 2) ?? [],
            price: product.price,
            stock: product.stock,
            qty: 1,
            mode: m,
          }
          return { lines: [...s.lines, line] }
        }),

      setQty: (id, qty) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.productId === id ? { ...l, qty: clampQty(l, qty) } : l)),
        })),

      setMode: (id, mode) =>
        set((s) => ({
          lines: s.lines.map((l) => {
            if (l.productId !== id || (mode === 'buy' && l.stock === 0)) return l
            const next = { ...l, mode }
            return { ...next, qty: clampQty(next, l.qty) }
          }),
        })),

      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.productId !== id) })),
      clear: () => set({ lines: [], notices: [] }),
      dismissNotices: () => set({ notices: [] }),

      /** Terapkan stok terbaru ({id: stok}). Item "beli" yang melebihi stok disesuaikan dan dicatat di `notices`. */
      syncStock: (stockMap) =>
        set((s) => {
          const notices = []
          const lines = s.lines.map((l) => {
            const stock = stockMap[l.productId]
            if (stock === undefined || stock === l.stock) return l
            const next = { ...l, stock }
            if (l.mode === 'buy' && stock === 0) {
              notices.push({ id: l.productId, name: l.name, type: 'out' })
              return { ...next, mode: 'quote' }
            }
            if (l.mode === 'buy' && l.qty > stock) {
              notices.push({ id: l.productId, name: l.name, type: 'reduced', to: stock })
              return { ...next, qty: stock }
            }
            return next
          })
          return { lines, notices: notices.length ? [...s.notices, ...notices] : s.notices }
        }),
    }),
    { name: 'salutjaya-cart', version: 1, partialize: (s) => ({ lines: s.lines }) }
  )
)

/** Ringkasan turunan dari daftar baris (fungsi murni, mudah diuji). */
export function cartTotals(lines) {
  const buyLines = lines.filter((l) => l.mode === 'buy')
  const quoteLines = lines.filter((l) => l.mode === 'quote')
  return {
    count: lines.reduce((n, l) => n + l.qty, 0),
    buyLines,
    quoteLines,
    subtotal: buyLines.reduce((n, l) => n + l.price * l.qty, 0), // sebelum PPN
  }
}
