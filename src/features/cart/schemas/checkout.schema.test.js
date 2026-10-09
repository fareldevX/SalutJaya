import { describe, expect, it } from 'vitest'
import { makeCheckoutSchema } from './checkout.schema'

const customer = { company: 'PT A', name: 'Budi', email: 'budi@a.co.id', phone: '081234567890' }
const paths = (schema, v) => {
  const r = schema.safeParse(v)
  return r.success ? [] : r.error.issues.map((i) => i.path.join('.'))
}

describe('checkout schema', () => {
  it('hanya penawaran: alamat dan pembayaran tidak wajib', () => {
    expect(paths(makeCheckoutSchema(false), customer)).toEqual([])
  })

  it('ada item beli: alamat, kode pos 5 digit, dan metode bayar wajib', () => {
    const p = paths(makeCheckoutSchema(true), customer)
    expect(p).toEqual(expect.arrayContaining(['address', 'city', 'postalCode', 'payment']))
    const ok = {
      ...customer,
      address: 'Jl. Contoh No. 1, Jakarta',
      city: 'Jakarta',
      postalCode: '12345',
      payment: 'transfer',
    }
    expect(paths(makeCheckoutSchema(true), ok)).toEqual([])
    expect(paths(makeCheckoutSchema(true), { ...ok, postalCode: '123' })).toEqual(['postalCode'])
  })

  it('NPWP opsional, tetapi bila diisi harus 15 atau 16 digit', () => {
    const s = makeCheckoutSchema(false)
    expect(paths(s, { ...customer, npwp: '' })).toEqual([])
    expect(paths(s, { ...customer, npwp: '01.234.567.8-901.000' })).toEqual([])
    expect(paths(s, { ...customer, npwp: '12345' })).toEqual(['npwp'])
  })
})
