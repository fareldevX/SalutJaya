import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/shared/motion/gsap'
import { NO_REDUCE } from '@/shared/motion/tokens'

/**
 * Satu garis jaringan panjang yang "menjahit" seluruh section. Digambar progresif mengikuti scroll.
 * Taruh di dalam wrapper `relative` setinggi seluruh halaman.
 */
export default function NetworkThread({ trigger }) {
  const path = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(NO_REDUCE, () => {
      gsap.set(path.current, { strokeDashoffset: 1 })
      gsap.to(path.current, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })
    })
    return () => mm.revert()
  })

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 -z-10 size-full opacity-60"
    >
      <defs>
        <linearGradient id="thread" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(16 185 129)" />
          <stop offset="0.6" stopColor="rgb(20 184 166)" />
          <stop offset="1" stopColor="rgb(56 189 248)" />
        </linearGradient>
      </defs>
      <path
        ref={path}
        pathLength="1"
        strokeDasharray="1"
        d="M 82 0 C 96 9, 62 15, 70 26 S 18 40, 34 52 S 88 64, 62 76 S 28 88, 50 100"
        fill="none"
        stroke="url(#thread)"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
