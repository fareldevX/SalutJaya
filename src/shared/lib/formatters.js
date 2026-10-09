const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})
const idrCompact = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 245000000 => "Rp 245.000.000" */
export const formatIDR = (value) => idr.format(value)
/** 245000000 => "Rp 245 jt" */
export const formatCompactIDR = (value) => idrCompact.format(value)
