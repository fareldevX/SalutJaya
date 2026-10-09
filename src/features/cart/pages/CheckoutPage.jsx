import { useEffect, useMemo, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { usePageMeta } from '@/shared/hooks/usePageMeta'
import { track } from '@/shared/lib/analytics'
import { formatIDR } from '@/shared/lib/formatters'
import { cartTotals, useCartStore } from '@/shared/store/cart.store'
import { Button, Choice, Input } from '@/shared/ui'
import { submitOrder } from '../api/cart.api'
import CartLine from '../components/CartLine'
import CartSummary from '../components/CartSummary'
import StockNotices from '../components/StockNotices'
import { useStockSync } from '../hooks/useStockSync'
import { makeCheckoutSchema, PAYMENT_OPTIONS } from '../schemas/checkout.schema'

const Section = ({ n, title, children }) => (
  <section className="rounded-tile border border-ink/10 bg-white p-6 md:p-8">
    <h2 className="font-display text-xl font-extrabold tracking-tight">
      <span className="mr-2 font-mono text-sm text-emerald-700">{n}</span>
      {title}
    </h2>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
  </section>
)

function Done({ result }) {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <svg viewBox="0 0 48 48" className="mx-auto size-16" aria-hidden="true">
        <circle cx="24" cy="24" r="22" className="fill-emerald-100" />
        <path
          d="M14 25l7 7 14-15"
          fill="none"
          className="stroke-emerald-700"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className="mt-6 text-h2">Pesanan diterima.</h1>
      <p className="mt-4 text-lead text-ink-soft">
        Tim kami akan menghubungi Anda lewat email untuk konfirmasi
        {result.orderId ? ', pembayaran,' : ''} dan langkah berikutnya.
      </p>
      <ul className="mx-auto mt-8 inline-block space-y-2 rounded-panel bg-white px-6 py-4 text-left font-mono text-sm">
        {result.orderId && (
          <li>
            Nomor pesanan: <strong>{result.orderId}</strong>
          </li>
        )}
        {result.quoteId && (
          <li>
            Nomor penawaran: <strong>{result.quoteId}</strong>
          </li>
        )}
        {result.orderId && (
          <li>
            Subtotal: <strong>{formatIDR(result.totals.subtotal)}</strong> (belum PPN)
          </li>
        )}
      </ul>
      <div className="mt-8">
        <Button to="/katalog">Kembali ke katalog</Button>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  usePageMeta({
    title: 'Checkout',
    description: 'Selesaikan pesanan atau permintaan penawaran Anda.',
  })
  const lines = useCartStore((s) => s.lines)
  const totals = useMemo(() => cartTotals(lines), [lines])
  const hasBuy = totals.buyLines.length > 0
  const [done, setDone] = useState(null)
  const started = useRef(false)
  useStockSync(!done)

  const schema = useMemo(() => makeCheckoutSchema(hasBuy), [hasBuy])
  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: '',
      npwp: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      payment: '',
      note: '',
    },
    resolver: zodResolver(schema),
  })
  const payment = useWatch({ control, name: 'payment' })

  useEffect(() => {
    if (!started.current && lines.length) {
      started.current = true
      track('checkout_start', { source: 'page' })
    }
  }, [lines.length])

  const mutation = useMutation({
    mutationFn: submitOrder,
    onSuccess: (res) => {
      track('order_submit', {
        buy: totals.buyLines.length,
        quote: totals.quoteLines.length,
        value: res.totals.subtotal,
      })
      useCartStore.getState().clear()
      setDone(res)
    },
    onError: (e) => {
      // Server menolak karena stok berubah: terapkan stok yang tersedia, pengguna meninjau keranjang
      if (e.status === 409 && e.data?.conflicts)
        useCartStore
          .getState()
          .syncStock(Object.fromEntries(e.data.conflicts.map((c) => [c.productId, c.available])))
    },
  })

  const onSubmit = handleSubmit((v) => {
    const { company, npwp, name, email, phone, note, address, city, postalCode, payment: pay } = v
    mutation.mutate({
      customer: { company, npwp: npwp || undefined, name, email, phone },
      shipping: hasBuy ? { address, city, postalCode } : undefined,
      payment: hasBuy ? pay : undefined,
      note: note || undefined,
      lines: lines.map((l) => ({ productId: l.productId, qty: l.qty, mode: l.mode })),
    })
  })

  if (done) return <Done result={done} />

  if (lines.length === 0)
    return (
      <div className="py-24 text-center">
        <h1 className="text-h2">Keranjang kosong.</h1>
        <p className="mt-4 text-lead text-ink-soft">
          Tambahkan perangkat dari katalog untuk melanjutkan.
        </p>
        <Button className="mt-8" to="/katalog">
          Lihat katalog
        </Button>
      </div>
    )

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <h1 className="text-h2">Checkout.</h1>

        <Section n="1" title="Data perusahaan">
          <Input
            label="Nama perusahaan"
            autoComplete="organization"
            error={errors.company?.message}
            {...register('company')}
          />
          <Input
            label="NPWP (opsional)"
            inputMode="numeric"
            placeholder="15 atau 16 digit"
            error={errors.npwp?.message}
            {...register('npwp')}
          />
          <Input
            label="Penanggung jawab"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email kerja"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Telepon / WhatsApp"
            type="tel"
            autoComplete="tel"
            className="sm:col-span-2"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </Section>

        {hasBuy && (
          <>
            <Section n="2" title="Alamat pengiriman">
              <Input
                multiline
                label="Alamat lengkap"
                className="sm:col-span-2"
                autoComplete="street-address"
                error={errors.address?.message}
                {...register('address')}
              />
              <Input
                label="Kota"
                autoComplete="address-level2"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="Kode pos"
                inputMode="numeric"
                autoComplete="postal-code"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </Section>
            <Section n="3" title="Pembayaran">
              <fieldset className="sm:col-span-2">
                <legend className="sr-only">Metode pembayaran</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {PAYMENT_OPTIONS.map((o) => (
                    <Choice
                      key={o.value}
                      name="payment"
                      value={o.value}
                      checked={payment === o.value}
                      onChange={() => {
                        setValue('payment', o.value)
                        clearErrors('payment')
                      }}
                    >
                      {o.label}
                    </Choice>
                  ))}
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  {PAYMENT_OPTIONS.find((o) => o.value === payment)?.hint ??
                    'Pilih metode untuk item beli langsung.'}
                </p>
                {errors.payment && (
                  <p className="mt-2 text-sm font-medium text-rose-700">{errors.payment.message}</p>
                )}
              </fieldset>
            </Section>
          </>
        )}

        <Section n={hasBuy ? '4' : '2'} title="Catatan">
          <Input
            multiline
            label="Catatan untuk tim kami (opsional)"
            className="sm:col-span-2"
            error={errors.note?.message}
            {...register('note')}
          />
        </Section>
      </div>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-tile border border-ink/10 bg-white p-6">
          <h2 className="font-display text-xl font-extrabold tracking-tight">Ringkasan pesanan</h2>
          <StockNotices />
          <ul className="divide-y divide-ink/10">
            {lines.map((l) => (
              <CartLine key={l.productId} line={l} />
            ))}
          </ul>
          <div className="mt-4 space-y-4 border-t border-ink/10 pt-5">
            <CartSummary totals={totals} />
            {totals.quoteLines.length > 0 && (
              <p className="rounded-panel bg-emerald-50 p-3 text-sm text-emerald-700">
                Item &quot;minta penawaran&quot; tidak ditagih sekarang. Kami kirim penawaran resmi
                lewat email.
              </p>
            )}
            {mutation.isError && (
              <p
                role="alert"
                className="rounded-panel bg-rose-50 p-3 text-sm font-medium text-rose-800"
              >
                {mutation.error.status === 409
                  ? 'Stok sebagian produk berubah. Keranjang sudah disesuaikan, silakan periksa lalu kirim ulang.'
                  : `${mutation.error.message} Silakan coba lagi.`}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending
                ? 'Mengirim…'
                : hasBuy
                  ? 'Kirim pesanan'
                  : 'Kirim permintaan penawaran'}
            </Button>
            <p className="text-center text-xs text-ink-soft">
              Dengan mengirim, Anda setuju dihubungi tim kami terkait pesanan ini.
            </p>
          </div>
        </div>
        <Link
          to="/katalog"
          className="mt-4 block text-center text-sm font-bold text-emerald-700 underline underline-offset-4"
        >
          Lanjut belanja
        </Link>
      </aside>
    </form>
  )
}
