import { useRef } from 'react'
import GlowOrb from '@/shared/ambient/GlowOrb'
import NetworkCanvas from '@/shared/ambient/NetworkCanvas'
import { gsap, ScrollTrigger, useGSAP } from '@/shared/motion/gsap'
import { NO_REDUCE } from '@/shared/motion/tokens'

/**
 * Atmosfer global (satu layer untuk seluruh halaman):
 *  - gradien vertikal panjang: pengganti background per-section agar tidak ada batas kaku
 *  - 3 orb cahaya tetap yang berpindah mengikuti progres scroll
 *  - jaringan node (canvas)
 * Harus ditempatkan di dalam wrapper `relative isolate` setinggi seluruh halaman.
 */
export default function AmbientBackground() {
  const fixedLayer = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(NO_REDUCE, () => {
        const [a, b, c] = gsap.utils.toArray('[data-orb]', fixedLayer.current)
        gsap.from([a, b, c], { opacity: 0, duration: 2.2, ease: 'power2.out', stagger: 0.3 })
        const path = (el, to) =>
          gsap.to(el, {
            ...to,
            ease: 'none',
            scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 1.5 },
          })
        path(a, { x: '62vw', y: '70vh' })
        path(b, { x: '-60vw', y: '45vh' })
        path(c, { x: '25vw', y: '-70vh' })
      })
      return () => mm.revert()
    },
    { scope: fixedLayer }
  )

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(to bottom, #fff 0%, rgb(var(--snow)) 16%, rgb(var(--emerald-50)) 46%, rgb(var(--snow)) 76%, #fff 100%)',
        }}
      />
      <div
        ref={fixedLayer}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <GlowOrb
          data-orb
          tone="emerald"
          opacity={0.32}
          className="-left-[10vmax] -top-[12vmax] size-[55vmax]"
        />
        <GlowOrb
          data-orb
          tone="teal"
          opacity={0.2}
          className="-right-[12vmax] top-[10vh] size-[50vmax]"
        />
        <GlowOrb
          data-orb
          tone="sky"
          opacity={0.22}
          className="bottom-[-25vmax] left-[30vw] size-[52vmax]"
        />
        <NetworkCanvas className="absolute inset-0" />
      </div>
    </>
  )
}
