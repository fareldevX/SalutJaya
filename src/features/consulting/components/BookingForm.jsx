import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Choice, Input } from '@/shared/ui'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { track } from '@/shared/lib/analytics'
import { useCreateBooking } from '../hooks/useCreateBooking'
import {
  bookingSchema,
  minBookingDate,
  SERVICE_OPTIONS,
  SLOT_OPTIONS,
  STEP_FIELDS,
  STEP_SCHEMAS,
} from '../schemas/booking.schema'

const TITLES = [
  'Apa yang Anda butuhkan?',
  'Konsultasi atau penawaran?',
  'Bagaimana kami menghubungi Anda?',
]

function Success({ result, kind, onClose }) {
  return (
    <div className="flex flex-col items-start gap-6 pt-6">
      <svg viewBox="0 0 48 48" className="size-14" aria-hidden="true">
        <circle cx="24" cy="24" r="22" className="fill-emerald-100" />
        <motion.path
          d="M14 25l7 7 14-15"
          fill="none"
          className="stroke-emerald-700"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        />
      </svg>
      <h3 className="font-display text-3xl font-extrabold tracking-tight">
        {kind === 'quote' ? 'Permintaan penawaran terkirim.' : 'Jadwal konsultasi terkirim.'}
      </h3>
      <p className="text-ink-soft">
        Tim kami akan menghubungi Anda lewat email atau telepon yang Anda berikan untuk konfirmasi.
      </p>
      <p className="rounded-panel bg-white px-4 py-3 font-mono text-sm">
        Nomor referensi: <strong>{result.id}</strong>
      </p>
      <Button onClick={onClose}>Selesai</Button>
    </div>
  )
}

/** Form 3 langkah. Resolver memilih skema zod sesuai langkah aktif, sehingga tiap langkah divalidasi sendiri. */
export default function BookingForm({ defaults, onClose }) {
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  const reduce = useReducedMotion()
  const mutation = useCreateBooking()

  const form = useForm({
    mode: 'onSubmit', // validasi hanya saat Lanjut/Kirim; error dihapus saat field diubah
    defaultValues: {
      service: defaults.service ?? '',
      needs: defaults.note ?? '',
      kind: defaults.kind ?? 'consultation',
      date: '',
      slot: '',
      company: '',
      name: '',
      email: '',
      phone: '',
    },
    resolver: (values, ctx, opts) => zodResolver(STEP_SCHEMAS[stepRef.current])(values, ctx, opts),
  })
  const {
    register,
    handleSubmit,
    trigger,
    control,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = form
  // Error dihapus begitu pengguna mengubah field-nya; validasi ulang terjadi saat menekan Lanjut/Kirim
  const reg = (name) => register(name, { onChange: () => clearErrors(name) })
  const values = useWatch({ control })
  const kind = values.kind
  // Grup radio dikontrol manual: nilai dari setValue, bukan dari ref DOM (null bila belum dipilih)
  const radio = (name, value) => ({
    name,
    value,
    checked: values[name] === value,
    onChange: () => {
      setValue(name, value, { shouldDirty: true })
      clearErrors(name)
    },
  })
  // Resolver membaca langkah aktif dari ref; disinkronkan setelah render agar tidak menyentuh ref saat render
  useEffect(() => {
    stepRef.current = step
  }, [step])

  const go = (n) => {
    setStep(n)
  }
  const next = async () => {
    if (await trigger(STEP_FIELDS[step])) go(step + 1)
  }
  const submit = handleSubmit(() => {
    if (step < 2) return go(step + 1) // Enter di langkah awal = lanjut
    // Resolver hanya mengembalikan field langkah aktif, jadi payload lengkap diambil dari getValues
    const full = bookingSchema.safeParse(getValues())
    if (!full.success) return go(0)
    mutation.mutate(full.data, {
      onSuccess: () =>
        track('booking_submit', { kind: full.data.kind, service: full.data.service }),
    })
  })

  if (mutation.isSuccess) return <Success result={mutation.data} kind={kind} onClose={onClose} />

  const slide = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { duration: 0.3 },
      }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <div>
        <div className="flex gap-1.5" aria-hidden="true">
          {TITLES.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-emerald-500' : 'bg-ink/10'}`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm font-semibold text-ink-soft" aria-live="polite">
          Langkah {step + 1} dari 3
        </p>
        <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{TITLES[step]}</h3>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} {...slide} className="flex flex-col gap-5">
          {step === 0 && (
            <>
              <fieldset>
                <legend className="mb-2 font-display text-sm font-bold">Layanan</legend>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_OPTIONS.map((o) => (
                    <Choice key={o.value} value={o.value} {...radio('service', o.value)}>
                      {o.label}
                    </Choice>
                  ))}
                </div>
                {errors.service && (
                  <p className="mt-2 text-sm font-medium text-rose-700">{errors.service.message}</p>
                )}
              </fieldset>
              <Input
                multiline
                label="Ceritakan kebutuhan Anda"
                placeholder="Mis. migrasi 3 cabang ke jaringan terpusat, atau penggantian 6 server yang sudah tua."
                error={errors.needs?.message}
                {...reg('needs')}
              />
            </>
          )}

          {step === 1 && (
            <>
              <fieldset>
                <legend className="mb-2 font-display text-sm font-bold">Yang Anda inginkan</legend>
                <div className="grid grid-cols-2 gap-2">
                  <Choice {...radio('kind', 'consultation')}>Jadwalkan konsultasi</Choice>
                  <Choice {...radio('kind', 'quote')}>Minta penawaran</Choice>
                </div>
              </fieldset>
              {kind === 'consultation' ? (
                <>
                  <Input
                    type="date"
                    label="Tanggal"
                    min={minBookingDate()}
                    error={errors.date?.message}
                    {...reg('date')}
                  />
                  <fieldset>
                    <legend className="mb-2 font-display text-sm font-bold">Waktu</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {SLOT_OPTIONS.map((o) => (
                        <Choice key={o.value} value={o.value} {...radio('slot', o.value)}>
                          {o.label}
                        </Choice>
                      ))}
                    </div>
                    {errors.slot && (
                      <p className="mt-2 text-sm font-medium text-rose-700">
                        {errors.slot.message}
                      </p>
                    )}
                  </fieldset>
                </>
              ) : (
                <p className="rounded-panel bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Kami akan menyiapkan penawaran berdasarkan kebutuhan yang Anda tulis dan
                  mengirimkannya lewat email.
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Input
                label="Perusahaan"
                autoComplete="organization"
                error={errors.company?.message}
                {...reg('company')}
              />
              <Input
                label="Nama Anda"
                autoComplete="name"
                error={errors.name?.message}
                {...reg('name')}
              />
              <Input
                label="Email kerja"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...reg('email')}
              />
              <Input
                label="Telepon / WhatsApp"
                type="tel"
                autoComplete="tel"
                placeholder="0812 3456 7890"
                error={errors.phone?.message}
                {...reg('phone')}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {mutation.isError && (
        <p
          role="alert"
          className="rounded-panel bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
        >
          {mutation.error.message} Silakan coba lagi.
        </p>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        {step > 0 ? (
          <Button variant="quiet" onClick={() => go(step - 1)}>
            Kembali
          </Button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <Button onClick={next}>Lanjut</Button>
        ) : (
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Mengirim…' : 'Kirim'}
          </Button>
        )}
      </div>
    </form>
  )
}
