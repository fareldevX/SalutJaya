import { useUiStore } from '@/shared/store/ui.store'
import { Button } from '@/shared/ui'
import ServiceVisual from './ServiceVisual'

/** Satu chapter layanan: teks oversized di kiri, ilustrasi di kanan. Dipakai di mode pinned maupun bertumpuk. */
export default function ServiceChapter({ service, index, pinned, active }) {
  const openBooking = useUiStore((s) => s.openBooking)
  return (
    <article
      data-chapter
      aria-labelledby={`svc-${service.id}`}
      className={`relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] ${pinned ? '[grid-area:1/1]' : ''} ${pinned && !active ? 'pointer-events-none' : ''}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 -top-24 select-none font-display font-extrabold leading-none tracking-tighter text-emerald-500/[0.09] [font-size:clamp(10rem,24vw,24rem)]"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative">
        <h3
          id={`svc-${service.id}`}
          className="font-display font-extrabold leading-[0.95] tracking-[-0.035em] [font-size:clamp(2.5rem,5vw,5.25rem)]"
        >
          {service.title}
        </h3>
        <p className="mt-6 max-w-xl text-lead text-ink-soft">{service.description}</p>
        <ul className="mt-8 space-y-3">
          {service.deliverables.map((d) => (
            <li key={d} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-[0.6em] size-2 shrink-0 rounded-full bg-emerald-500"
              />
              {d}
            </li>
          ))}
        </ul>
        <Button
          className="mt-10"
          variant="dark"
          onClick={() => openBooking({ service: service.id })}
        >
          Minta penawaran layanan ini
        </Button>
      </div>

      <div data-visual className="relative mx-auto w-full max-w-[30rem] lg:ml-auto">
        <ServiceVisual id={service.id} label={`Ilustrasi ${service.title}`} />
      </div>
    </article>
  )
}
