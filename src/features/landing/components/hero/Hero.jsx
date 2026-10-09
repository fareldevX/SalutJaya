import { useRef } from 'react'
import GlowOrb from '@/shared/ambient/GlowOrb'
import { track } from '@/shared/lib/analytics'
import { useUiStore } from '@/shared/store/ui.store'
import MagneticButton from '@/shared/motion/components/MagneticButton'
import { Button } from '@/shared/ui'
import { heroStatus } from '../../data/content'
import { useHeroTimeline } from '../../hooks/useHeroTimeline'
import RackVisual from './RackVisual'

// Setiap baris dibungkus mask (overflow-hidden) agar bisa "terangkat" masuk. Padding negatif menjaga descender tidak terpotong.
const Line = ({ className = '', children }) => (
  <span
    className={`-mb-[0.14em] -mt-[0.05em] block overflow-hidden pb-[0.14em] pt-[0.05em] ${className}`}
  >
    <span data-hero="line" className="block">
      {children}
    </span>
  </span>
)

export default function Hero() {
  const root = useRef(null)
  const openBooking = useUiStore((s) => s.openBooking)
  useHeroTimeline(root)

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-center pb-24 pt-32">
      <GlowOrb
        tone="emerald"
        opacity={0.2}
        className="-bottom-[22vmax] right-[8vw] size-[40vmax]"
      />

      {/* Rak server: menembus tepi kanan viewport, berada di belakang teks */}
      <div
        data-hero="rack-wrap"
        className="pointer-events-none absolute -right-[6vw] bottom-[6vh] hidden w-[min(35vw,540px)] md:block"
      >
        <div data-hero="rack" style={{ perspective: '1600px' }}>
          {/* Bayangan statis (bukan filter) agar LED yang berkedip tidak memicu repaint filter */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[6%] -bottom-[3%] h-[8%] rounded-[50%]"
            style={{
              background: 'radial-gradient(closest-side, rgb(15 23 42 / 0.2), transparent)',
            }}
          />
          <div
            className="relative"
            style={{ transform: 'rotateY(-16deg) rotateX(4deg) rotateZ(-1deg)' }}
          >
            <RackVisual />
          </div>
        </div>
      </div>

      <div data-hero="chip" className="absolute right-[var(--gutter)] top-28 hidden md:block">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 font-display text-sm font-bold backdrop-blur">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {heroStatus}
        </span>
      </div>

      <div data-hero="copy" className="container-x relative z-10">
        <h1 className="text-mega">
          <Line>Infrastruktur</Line>
          <Line className="md:ml-[6vw]">IT yang tidak</Line>
          <Line>
            pernah{' '}
            <span
              data-hero="outline"
              className="text-emerald-600 [-webkit-text-stroke:2px_rgb(var(--emerald-600))]"
            >
              tidur.
            </span>
          </Line>
        </h1>

        <p data-hero="lead" className="mt-10 max-w-xl text-lead text-ink-soft">
          Konsultasi arsitektur jaringan dan pengadaan hardware dalam satu mitra untuk perusahaan
          Anda.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <span data-hero="cta">
            <MagneticButton
              size="lg"
              onClick={() => {
                track('cta_click', { id: 'hero_consult' })
                openBooking()
              }}
            >
              Konsultasi sekarang
            </MagneticButton>
          </span>
          <span data-hero="cta">
            <Button
              size="lg"
              variant="ghost"
              to="/katalog"
              onClick={() => track('cta_click', { id: 'hero_catalog' })}
            >
              Lihat katalog hardware
            </Button>
          </span>
        </div>
      </div>

      <div
        data-hero="cue"
        aria-hidden="true"
        className="absolute bottom-10 right-[var(--gutter)] hidden items-center gap-3 text-sm font-semibold text-ink-soft [writing-mode:vertical-rl] md:flex"
      >
        <span>Gulir</span>
        <span className="h-14 w-px bg-ink/25" />
      </div>
    </section>
  )
}
