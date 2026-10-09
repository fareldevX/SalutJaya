import { z } from 'zod'

const customer = {
  company: z.string().trim().min(2, 'Nama perusahaan wajib diisi.'),
  npwp: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d{15,16}$/.test(v.replace(/\D/g, '')), 'NPWP harus 15 atau 16 digit.'),
  name: z.string().trim().min(2, 'Nama penanggung jawab wajib diisi.'),
  email: z.string().trim().email('Format email tidak valid.'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{7,16}$/, 'Nomor telepon tidak valid.'),
  note: z.string().trim().max(500, 'Maksimal 500 karakter.').optional(),
}
const shipping = {
  address: z.string().trim().min(10, 'Alamat pengiriman minimal 10 karakter.'),
  city: z.string().trim().min(2, 'Kota wajib diisi.'),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'Kode pos harus 5 digit.'),
}

/** Alamat dan metode bayar hanya wajib bila ada item "beli langsung". */
export const makeCheckoutSchema = (hasBuy) =>
  z.object({
    ...customer,
    ...(hasBuy
      ? {
          ...shipping,
          payment: z.enum(['transfer', 'invoice'], { error: 'Pilih metode pembayaran.' }),
        }
      : {
          address: z.string().optional(),
          city: z.string().optional(),
          postalCode: z.string().optional(),
          payment: z.string().optional(),
        }),
  })

export const PAYMENT_OPTIONS = [
  {
    value: 'transfer',
    label: 'Transfer bank',
    hint: 'Instruksi pembayaran dikirim ke email setelah pesanan dikonfirmasi.',
  },
  {
    value: 'invoice',
    label: 'Invoice termin',
    hint: 'Memerlukan persetujuan tim keuangan kami sebelum diproses.',
  },
]
