import { useEffect, useRef } from 'react'
import { gsap } from '@/shared/motion/gsap'

const LINK = 150 // jarak maksimum dua node tersambung (px)
const PUSH = 140 // radius tolakan kursor

/**
 * Jaringan node melayang di latar tetap. Bereaksi pada kursor (menolak halus) dan scroll (parallax per kedalaman).
 * Berhenti otomatis saat tab tidak aktif (ticker GSAP), dan menjadi gambar statis bila reduced-motion.
 */
export default function NetworkCanvas({ className }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const state = { alpha: reduce ? 1 : 0 }
    const pointer = { x: -9999, y: -9999 }
    let w = 0
    let h = 0
    let nodes = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = w < 768 ? 22 : (navigator.hardwareConcurrency ?? 8) <= 4 ? 28 : 42
      while (nodes.length < count)
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          z: 0.3 + Math.random() * 0.7,
        })
      nodes.length = count
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const scroll = window.scrollY
      const pts = nodes.map((n) => {
        if (!reduce) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
        }
        // parallax: node "dekat" (z besar) bergeser lebih banyak saat scroll
        const y = (((n.y - scroll * 0.12 * n.z) % h) + h) % h
        const dx = n.x - pointer.x
        const dy = y - pointer.y
        const d = Math.hypot(dx, dy)
        if (d < PUSH && d > 0) {
          n.x += (dx / d) * (1 - d / PUSH) * 2.2
          n.y += (dy / d) * (1 - d / PUSH) * 2.2
        }
        return { x: n.x, y, z: n.z }
      })

      ctx.lineWidth = 1
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < LINK) {
            ctx.strokeStyle = `rgba(16,185,129,${(1 - d / LINK) * 0.2 * state.alpha})`
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = `rgba(5,150,105,${0.5 * state.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.4 + p.z * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    resize()
    window.addEventListener('resize', resize)
    if (reduce) {
      draw()
      return () => window.removeEventListener('resize', resize)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    gsap.ticker.add(draw)
    const fade = gsap.to(state, { alpha: 1, duration: 2.4, delay: 0.8, ease: 'power2.out' })

    return () => {
      fade.kill()
      gsap.ticker.remove(draw)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
