import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from './gsap'
import { lenisRef } from './lenisStore'

/** Smooth scroll (Lenis) yang disinkronkan dengan ticker GSAP dan ScrollTrigger. Nonaktif bila reduced-motion. */
export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.085 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return children
}
