import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from '../gsap'

/**
 * Wipe emerald tipis saat pindah halaman. Panel langsung menutup layar pada frame pertama rute baru
 * (sebelum paint), lalu terangkat membuka halaman. Lewati load awal, perpindahan #hash, dan reduced-motion.
 */
export default function PageTransition() {
  const panel = useRef(null)
  const { pathname } = useLocation()
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(
      panel.current,
      { yPercent: 0, autoAlpha: 1 },
      {
        yPercent: -100,
        duration: 0.7,
        ease: 'expo.inOut',
        delay: 0.05,
        onComplete: () => gsap.set(panel.current, { autoAlpha: 0 }),
      }
    )
    return () => tween.kill()
  }, [pathname])

  return (
    <div
      ref={panel}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-[55] bg-emerald-500"
    />
  )
}
