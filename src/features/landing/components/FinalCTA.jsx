import { useRef } from 'react'
import { site } from '@/config/site'
import GlowOrb from '@/shared/ambient/GlowOrb'
import MagneticButton from '@/shared/motion/components/MagneticButton'
import { gsap, SplitText, useGSAP } from '@/shared/motion/gsap'
import { EASE, NO_REDUCE, STAGGER } from '@/shared/motion/tokens'
import { track } from '@/shared/lib/analytics'
import { useUiStore } from '@/shared/store/ui.store'
import { Button } from '@/shared/ui'

export default function FinalCTA() {
  const heading = useRef(null)
  const openBooking = useUiStore((s) => s.openBooking)

  // Reveal per baris, dipicu saat heading masuk viewport. autoSplit membagi ulang bila lebar berubah.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(NO_REDUCE, () => {
        SplitText.create(heading.current, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              ease: EASE.out,
              stagger: STAGGER.lines,
              scrollTrigger: { trigger: heading.current, start: 'top 82%' },
            }),
        })
      })
      return () => mm.revert()
    },
    { scope: heading }
  )

  return (
    <section id="konsultasi" className="container-x relative pb-24 pt-40">
      <GlowOrb
        tone="emerald"
        opacity={0.22}
        className="-bottom-[14vmax] -left-[8vmax] size-[36vmax]"
      />
      <h2 ref={heading} className="max-w-[13ch] text-h1">
        Siap membicarakan infrastruktur Anda?
      </h2>
      <div className="mt-14 flex flex-wrap items-center gap-3">
        <MagneticButton
          size="lg"
          onClick={() => {
            track('cta_click', { id: 'final_consult' })
            openBooking()
          }}
        >
          Konsultasi sekarang
        </MagneticButton>
        <Button size="lg" variant="ghost" to="/katalog">
          Lihat katalog hardware
        </Button>
      </div>
      <p className="mt-10 text-ink-soft">
        Atau hubungi langsung di{' '}
        <a
          href={`mailto:${site.email}`}
          className="font-semibold text-emerald-700 underline underline-offset-4"
        >
          {site.email}
        </a>
        .
      </p>
    </section>
  )
}
