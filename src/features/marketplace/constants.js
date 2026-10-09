export const CATEGORY_LABEL = { server: 'Server', switch: 'Switch', router: 'Router' }

// Rentang harga B2B (IDR). Dikirim ke API sebagai min/max.
export const PRICE_PRESETS = [
  { value: '', label: 'Semua harga' },
  { value: 'lt25', label: 'Di bawah Rp 25 jt', max: 25_000_000 },
  { value: '25-100', label: 'Rp 25 jt – 100 jt', min: 25_000_000, max: 100_000_000 },
  { value: '100-300', label: 'Rp 100 jt – 300 jt', min: 100_000_000, max: 300_000_000 },
  { value: 'gt300', label: 'Di atas Rp 300 jt', min: 300_000_000 },
]

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Unggulan' },
  { value: 'price_asc', label: 'Harga terendah' },
  { value: 'price_desc', label: 'Harga tertinggi' },
  { value: 'name', label: 'Nama A–Z' },
]

export const PAGE_SIZE = 14
