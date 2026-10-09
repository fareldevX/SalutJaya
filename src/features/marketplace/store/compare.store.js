import { create } from 'zustand'

export const MAX_COMPARE = 3

/** Produk yang dipilih untuk dibandingkan (maks 3). Menyimpan objek produk agar tray tidak perlu fetch ulang. */
export const useCompareStore = create((set, get) => ({
  items: [],
  has: (id) => get().items.some((p) => p.id === id),
  toggle: (product) =>
    set((s) => {
      if (s.items.some((p) => p.id === product.id))
        return { items: s.items.filter((p) => p.id !== product.id) }
      return s.items.length >= MAX_COMPARE ? s : { items: [...s.items, product] }
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((p) => p.id !== id) })),
  clear: () => set({ items: [] }),
}))
