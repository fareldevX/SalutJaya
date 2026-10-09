import { describe, expect, it } from 'vitest'
import { placeCells } from './bentoLayout'

describe('bento layout', () => {
  it('setiap grup mengisi persegi panjang penuh 12 kolom (tanpa lubang), untuk 1..40 sel', () => {
    for (let n = 1; n <= 40; n++) {
      const cells = placeCells(n)
      expect(cells).toHaveLength(n)
      // Luas tiap grup harus kelipatan 12 kolom
      let i = 0
      while (i < n) {
        const size = Math.min(7, n - i)
        const area = cells.slice(i, i + size).reduce((a, [c, r]) => a + c * r, 0)
        expect(area % 12, `n=${n} grup mulai ${i}`).toBe(0)
        i += size
      }
    }
  })
})
