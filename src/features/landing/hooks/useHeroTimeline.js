import { EASE, NO_REDUCE, STAGGER } from '@/shared/motion/tokens'
import { gsap, useGSAP } from '@/shared/motion/gsap'

/** Orkestrasi intro hero + parallax scroll. Semua elemen dicari lewat atribut data-hero di dalam `scope`. */
export function useHeroTimeline(scope) {
  useGSAP(
    () => {
      const q = gsap.utils.selector(scope)
      const mm = gsap.matchMedia()

      mm.add(NO_REDUCE, () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.out } })
        tl.from(
          q('[data-hero=line]'),
          {
            yPercent: 115,
            rotate: 3,
            transformOrigin: '0% 100%',
            duration: 1.3,
            stagger: STAGGER.lines,
          },
          0.15
        )
          .from(q('[data-hero=rack]'), { xPercent: 14, opacity: 0, duration: 1.8 }, 0.3)
          .from(q('[data-hero=lead]'), { y: 24, opacity: 0, duration: 1 }, 0.8)
          .from(q('[data-hero=cta]'), { scale: 0.9, opacity: 0, duration: 0.9, stagger: 0.1 }, 1.0)
          .from(q('[data-hero=chip]'), { y: -12, opacity: 0, duration: 0.8 }, 1.2)
          .from(q('[data-hero=cue]'), { opacity: 0, duration: 0.8 }, 1.7)
          // kata outline terisi warna setelah headline selesai
          .from(
            q('[data-hero=outline]'),
            { color: 'rgba(5,150,105,0)', duration: 1.2, ease: 'power2.inOut' },
            1.5
          )

        // LED berkedip acak
        q('[data-led]').forEach((led) =>
          gsap.to(led, {
            opacity: gsap.utils.random(0.15, 0.45),
            duration: gsap.utils.random(0.15, 0.5),
            delay: gsap.utils.random(0, 2),
            repeat: -1,
            yoyo: true,
            repeatDelay: gsap.utils.random(0.3, 2.4),
          })
        )

        // Parallax berlapis: rak naik paling jauh, teks sedikit terangkat dan memudar
        const scrub = { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to(q('[data-hero=rack-wrap]'), { yPercent: -22, ease: 'none', scrollTrigger: scrub })
        gsap.to(q('[data-hero=copy]'), {
          y: -70,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: scrub,
        })
      })

      return () => mm.revert()
    },
    { scope }
  )
}
