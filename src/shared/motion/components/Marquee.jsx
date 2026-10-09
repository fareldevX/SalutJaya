import { useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { gsap, ScrollTrigger, useGSAP } from '../gsap'
import { NO_REDUCE } from '../tokens'

/**
 * Teks/elemen berjalan tanpa putus. Kecepatannya bertambah (dan arahnya mengikuti) saat pengguna scroll.
 * Anak ditulis sekali; salinan kedua otomatis dibuat dan disembunyikan dari pembaca layar.
 * Setiap anak harus punya jarak di sisi kanannya (padding), agar sambungan loop rapi.
 */
export default function Marquee({ children, duration = 50, reverse = false, className }) {
  const track = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(NO_REDUCE, () => {
        const tween = gsap.fromTo(
          track.current,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 }
        )
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6)
            gsap
              .timeline({ overwrite: true })
              .to(tween, { timeScale: self.direction * boost, duration: 0.2 })
              .to(tween, { timeScale: 1, duration: 1.2 })
          },
        })
        return () => st.kill()
      })
      return () => mm.revert()
    },
    { scope: track }
  )

  return (
    <div className={cn('overflow-hidden', className)}>
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((i) => (
          <div key={i} aria-hidden={i === 1 || undefined} className="flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
