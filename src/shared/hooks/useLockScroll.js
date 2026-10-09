import { useEffect } from 'react'
import { lenisRef } from '@/shared/motion/lenisStore'

/** Kunci scroll body (tanpa lompatan layout akibat hilangnya scrollbar). */
export function useLockScroll(locked) {
  useEffect(() => {
    if (!locked) return
    const el = document.documentElement
    const gap = window.innerWidth - el.clientWidth
    const prev = { overflow: el.style.overflow, paddingRight: el.style.paddingRight }
    el.style.overflow = 'hidden'
    lenisRef.current?.stop()
    if (gap > 0) el.style.paddingRight = `${gap}px`
    return () => {
      el.style.overflow = prev.overflow
      lenisRef.current?.start()
      el.style.paddingRight = prev.paddingRight
    }
  }, [locked])
}
