import { describe, expect, it } from 'vitest'
import { bookingSchema, contactStep, minBookingDate, needsStep, whenStep } from './booking.schema'

const issues = (schema, v) => {
  const r = schema.safeParse(v)
  return r.success ? [] : r.error.issues.map((i) => i.path.join('.'))
}

describe('booking schema', () => {
  it('langkah 1: layanan dan kebutuhan wajib', () => {
    expect(issues(needsStep, { service: '', needs: '' })).toEqual(
      expect.arrayContaining(['service', 'needs'])
    )
    expect(issues(needsStep, { service: 'network', needs: 'Migrasi tiga cabang kantor' })).toEqual(
      []
    )
  })

  it('langkah 2: konsultasi mewajibkan tanggal (mulai besok) dan waktu', () => {
    expect(issues(whenStep, { kind: 'consultation', date: '', slot: null })).toContain('slot')
    expect(issues(whenStep, { kind: 'consultation', date: '2020-01-01', slot: 'pagi' })).toEqual([
      'date',
    ])
    expect(
      issues(whenStep, { kind: 'consultation', date: minBookingDate(), slot: 'pagi' })
    ).toEqual([])
  })

  it('langkah 2: penawaran tidak butuh tanggal/waktu, dan radio kosong (null) aman', () => {
    expect(issues(whenStep, { kind: 'quote', date: '', slot: null })).toEqual([])
  })

  it('langkah 3: validasi email dan telepon', () => {
    const base = { company: 'PT A', name: 'Budi', email: 'budi@a.co.id', phone: '0812 3456 7890' }
    expect(issues(contactStep, base)).toEqual([])
    expect(issues(contactStep, { ...base, email: 'salah' })).toEqual(['email'])
    expect(issues(contactStep, { ...base, phone: '12' })).toEqual(['phone'])
  })

  it('skema gabungan menerima payload lengkap', () => {
    const r = bookingSchema.safeParse({
      service: 'security',
      needs: 'Audit keamanan jaringan',
      kind: 'quote',
      date: '',
      slot: null,
      company: 'PT A',
      name: 'Budi',
      email: 'budi@a.co.id',
      phone: '081234567890',
    })
    expect(r.success).toBe(true)
  })
})
