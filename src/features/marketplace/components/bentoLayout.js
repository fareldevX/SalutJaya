// Tata letak per grup. Setiap grup mengisi persegi panjang penuh 12 kolom, jadi tidak ada lubang.
// Entri = [kolom, baris]. Grup utuh berisi 7 sel; sisa di akhir memakai tata letak yang sesuai jumlahnya.
export const LAYOUT = {
  1: [[12, 2]],
  2: [
    [6, 2],
    [6, 2],
  ],
  3: [
    [6, 2],
    [3, 2],
    [3, 2],
  ],
  4: [
    [6, 2],
    [3, 2],
    [3, 1],
    [3, 1],
  ],
  5: [
    [6, 2],
    [3, 1],
    [3, 1],
    [3, 1],
    [3, 1],
  ],
  6: [
    [6, 2],
    [3, 2],
    [3, 2],
    [3, 1],
    [3, 1],
    [6, 1],
  ],
  7: [
    [6, 2],
    [3, 2],
    [3, 2],
    [3, 1],
    [3, 1],
    [6, 2],
    [6, 1],
  ],
}
export const SPAN = {
  '12x2': 'lg:col-span-12 lg:row-span-2 md:col-span-2',
  '6x2': 'lg:col-span-6 lg:row-span-2 md:col-span-2',
  '6x1': 'lg:col-span-6 lg:row-span-1 md:col-span-2',
  '3x2': 'lg:col-span-3 lg:row-span-2',
  '3x1': 'lg:col-span-3 lg:row-span-1',
}
export const MIN_H = {
  xl: 'min-h-[26rem]',
  tall: 'min-h-[25rem]',
  wide: 'min-h-[13rem]',
  compact: 'min-h-[13rem]',
}
export const variantOf = (c, r) =>
  c >= 6 && r >= 2 ? 'xl' : r >= 2 ? 'tall' : c >= 6 ? 'wide' : 'compact'

/** Hitung (kolom, baris) tiap sel. Sel dikelompokkan per 7; sisa grup mengikuti LAYOUT[sisa]. */
export const placeCells = (count) => {
  const out = []
  for (let g = 0; g < count; g += 7) {
    const size = Math.min(7, count - g)
    LAYOUT[size].forEach(([c, r]) => out.push([c, r]))
  }
  return out
}
