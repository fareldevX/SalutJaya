import { useEffect, useRef } from 'react'
import { gsap } from '../gsap'

/**
 * Efek magnetik: elemen ditarik ke arah kursor saat kursor berada dalam `radius` px dari tepinya.
 * Hanya aktif pada perangkat dengan pointer presisi dan tanpa reduced-motion.
 * @returns {import('react').RefObject<HTMLElement>}
 */
export function useMagnetic({ radius = 80, strength = 0.35 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ok = window.matchMedia(
      '(pointer: fine) and (prefers-reduced-motion: no-preference)'
    ).matches
    if (!ok) return

    const toX = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const toY = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      // r sudah mencakup offset transform saat ini; kurangi agar pusat asli stabil
      const cx = r.left + r.width / 2 - gsap.getProperty(el, 'x')
      const cy = r.top + r.height / 2 - gsap.getProperty(el, 'y')
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const near = Math.abs(dx) < r.width / 2 + radius && Math.abs(dy) < r.height / 2 + radius
      toX(near ? dx * strength : 0)
      toY(near ? dy * strength : 0)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [radius, strength])

  return ref
}
