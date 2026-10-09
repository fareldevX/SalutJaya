import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { lenisRef } from '@/shared/motion/lenisStore'

/**
 * Setiap pindah rute: scroll ke #hash (halus; Lenis membaca scroll-padding-top) atau ke atas,
 * lalu umumkan judul halaman ke pembaca layar lewat live region.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  const [announce, setAnnounce] = useState('')

  useEffect(() => {
    const lenis = lenisRef.current
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) lenis ? lenis.scrollTo(target, { duration: 1.4 }) : target.scrollIntoView()
    else lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
  }, [pathname, hash])

  useEffect(() => {
    // Judul diperbarui oleh halaman setelah render; baca sesudah jeda singkat
    const t = setTimeout(() => setAnnounce(document.title), 150)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {announce}
    </div>
  )
}
