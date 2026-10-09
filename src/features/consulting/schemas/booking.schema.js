import { z } from 'zod'

export const SERVICE_OPTIONS = [
  { value: 'network', label: 'Network architecture' },
  { value: 'server', label: 'Server maintenance' },
  { value: 'security', label: 'Cybersecurity' },
  { value: 'hardware', label: 'Pengadaan hardware' },
]
export const SLOT_OPTIONS = [
  { value: 'pagi', label: 'Pagi (09.00–12.00)' },
  { value: 'siang', label: 'Siang (13.00–16.00)' },
]

const tomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}
export const minBookingDate = tomorrow

// Satu skema per langkah form, jadi validasi hanya mengecek field yang sedang tampil.
export const needsStep = z.object({
  service: z.enum(
    SERVICE_OPTIONS.map((s) => s.value),
    { error: 'Pilih salah satu layanan.' }
  ),
  needs: z
    .string()
    .trim()
    .min(10, 'Ceritakan kebutuhan Anda minimal 10 karakter.')
    .max(1000, 'Maksimal 1000 karakter.'),
})

export const whenStep = z
  .object({
    kind: z.enum(['consultation', 'quote']),
    // Radio yang belum dipilih bernilai null di react-hook-form, jadi pakai nullish
    date: z.string().nullish(),
    slot: z.string().nullish(),
  })
  .superRefine((v, ctx) => {
    if (v.kind !== 'consultation') return
    if (!v.date)
      ctx.addIssue({ code: 'custom', path: ['date'], message: 'Pilih tanggal konsultasi.' })
    else if (v.date < tomorrow())
      ctx.addIssue({ code: 'custom', path: ['date'], message: 'Pilih tanggal mulai besok.' })
    if (!v.slot)
      ctx.addIssue({ code: 'custom', path: ['slot'], message: 'Pilih waktu yang diinginkan.' })
  })

export const contactStep = z.object({
  company: z.string().trim().min(2, 'Nama perusahaan wajib diisi.'),
  name: z.string().trim().min(2, 'Nama Anda wajib diisi.'),
  email: z.string().trim().email('Format email tidak valid.'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{7,16}$/, 'Nomor telepon tidak valid.'),
})

export const STEP_SCHEMAS = [needsStep, whenStep, contactStep]
export const bookingSchema = z.object({
  ...needsStep.shape,
  ...whenStep.shape,
  ...contactStep.shape,
})
export const STEP_FIELDS = [
  Object.keys(needsStep.shape),
  Object.keys(whenStep.shape),
  Object.keys(contactStep.shape),
]

export const bookingResponseSchema = z.object({ id: z.string(), status: z.string() })
