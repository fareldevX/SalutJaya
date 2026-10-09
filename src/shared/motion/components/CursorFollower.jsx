import { useEffect, useRef } from 'react'
import { gsap } from '../gsap'

/**
 * Gelembung kursor berlabel yang muncul di atas elemen ber-atribut data-cursor="Label" (mis. tile produk).
 * Bagian interaktif di dalamnya (data-cursor-off) menyembunyikannya. Hanya pointer presisi, tanpa reduced-motion.
 */
export default function CursorFollower() {
  const pos = useRef(null)
  const bubble = useRef(null)
  const text = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches)
      return
    const xTo = gsap.quickTo(pos.current, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(pos.current, 'y', { duration: 0.35, ease: 'power3' })
    gsap.set(bubble.current, { scale: 0 })

    const show = (label) => {
      text.current.textContent = label
      gsap.to(bubble.current, { scale: 1, duration: 0.45, ease: 'expo.out', overwrite: true })
    }
    const hide = () =>
      gsap.to(bubble.current, { scale: 0, duration: 0.3, ease: 'power2.in', overwrite: true })

    let current = null
    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      const host = e.target.closest?.('[data-cursor]')
      const off = e.target.closest?.('[data-cursor-off]')
      const next = host && !off ? host.dataset.cursor : null
      if (next !== current) {
        current = next
        next ? show(next) : hide()
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div ref={pos} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[45]">
      <div
        ref={bubble}
        className="-ml-8 -mt-8 grid size-16 scale-0 place-items-center rounded-full bg-emerald-500 shadow-[0_10px_30px_-8px_rgb(16_185_129/0.6)]"
      >
        <span ref={text} className="font-display text-xs font-extrabold text-ink" />
      </div>
    </div>
  )
}
