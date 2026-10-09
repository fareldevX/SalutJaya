import { create } from 'zustand'

/**
 * State UI lintas fitur. Fitur tidak boleh saling impor, jadi pemicu bersama (mis. membuka form booking
 * dari hero, nav, atau katalog) lewat store ini.
 */
export const useUiStore = create((set) => ({
  booking: { open: false, nonce: 0, defaults: {} },
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  /** @param {{ service?: string, kind?: 'consultation'|'quote', note?: string }} [defaults] */
  openBooking: (defaults = {}) =>
    set((s) => ({ booking: { open: true, nonce: s.booking.nonce + 1, defaults } })),
  closeBooking: () => set((s) => ({ booking: { ...s.booking, open: false } })),
}))
