import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/shared/motion/gsap'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { services } from '../data/services'
import ServiceChapter from './ServiceChapter'

const drawables = (el) => ({
  paths: el.querySelectorAll('[data-draw]'),
  nodes: el.querySelectorAll('[data-node]:not([data-led]):not([data-pulse])'),
})

/** Animasi gambar-sendiri untuk satu chapter, ditambahkan ke timeline `tl` pada waktu `at`. */
function drawChapter(tl, chapter, at) {
  const { paths, nodes } = drawables(chapter)
  tl.fromTo(
    paths,
    { strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: 'power2.inOut' },
    at
  ).fromTo(
    nodes,
    { scale: 0 },
    { scale: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(2)' },
    at + 0.5
  )
}

/**
 * Tiga layanan sebagai "chapter". Desktop: satu panel di-pin dan chapter berganti mengikuti scroll,
 * dengan ilustrasi yang menggambar dirinya sendiri. Mobile / reduced-motion: chapter bertumpuk, tanpa pin.
 */
export default function ServiceStage() {
  const root = useRef(null)
  const stage = useRef(null)
  const fill = useRef(null)
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const pinned = wide && !reduce

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray('[data-chapter]', stage.current)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // LED berkedip dan pemindai keamanan berputar
        gsap.utils.toArray('[data-led]', stage.current).forEach((el) =>
          gsap.to(el, {
            opacity: 0.25,
            duration: gsap.utils.random(0.2, 0.5),
            repeat: -1,
            yoyo: true,
            repeatDelay: gsap.utils.random(0.4, 2),
            delay: gsap.utils.random(0, 1.5),
          })
        )
        gsap.to('[data-spin]', {
          rotation: 360,
          svgOrigin: '200 205',
          duration: 6,
          repeat: -1,
          ease: 'none',
        })
        gsap.to('[data-pulse]', {
          scale: 1.5,
          opacity: 0,
          duration: 1.8,
          repeat: -1,
          ease: 'power1.out',
        })

        if (!pinned) {
          // Bertumpuk: setiap ilustrasi menggambar diri saat masuk viewport
          chapters.forEach((ch) => {
            const tl = gsap.timeline({ paused: true })
            drawChapter(tl, ch, 0)
            ScrollTrigger.create({
              trigger: ch,
              start: 'top 75%',
              once: true,
              onEnter: () => tl.play(),
            })
            tl.progress(0)
          })
          return
        }

        // Pinned: chapter 2..n tersembunyi; timeline scrub menukar chapter dan menggambar ilustrasinya
        const rest = chapters.slice(1)
        gsap.set(rest, { autoAlpha: 0 })
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage.current,
            start: 'top top',
            end: `+=${(chapters.length - 1) * 110}%`,
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              const t = self.progress * tl.duration()
              setActive(Math.min(chapters.length - 1, Math.max(0, Math.floor((t + 0.5) / 2))))
            },
          },
        })
        rest.forEach((ch, i) => {
          const t = 2 * (i + 1) - 1
          tl.to(chapters[i], { autoAlpha: 0, y: -40, duration: 0.6, ease: 'power2.out' }, t).fromTo(
            ch,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            t + 0.55
          )
          drawChapter(tl, ch, t + 0.7)
        })
        tl.to({}, { duration: 0.6 })
        tl.fromTo(fill.current, { scaleY: 0 }, { scaleY: 1, duration: tl.duration() }, 0)

        // Chapter pertama menggambar diri saat panel mulai terlihat
        const first = gsap.timeline({ paused: true })
        drawChapter(first, chapters[0], 0)
        first.progress(0)
        ScrollTrigger.create({
          trigger: stage.current,
          start: 'top 70%',
          once: true,
          onEnter: () => first.play(),
        })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [pinned], revertOnUpdate: true }
  )

  return (
    <section ref={root} id="layanan" aria-label="Layanan konsultasi">
      <div className="container-x pb-20 pt-40">
        <h2 className="max-w-[14ch] text-h2">Tiga layanan, satu tim yang sama.</h2>
      </div>

      <div ref={stage} className={pinned ? 'relative h-[100svh]' : ''}>
        <div
          className={
            pinned ? 'container-x grid h-full items-center' : 'container-x space-y-40 pb-24'
          }
        >
          {services.map((s, i) => (
            <ServiceChapter
              key={s.id}
              service={s}
              index={i}
              pinned={pinned}
              active={active === i}
            />
          ))}
        </div>

        {pinned && (
          <ol
            aria-label="Progres layanan"
            className="absolute right-[var(--gutter)] top-1/2 flex -translate-y-1/2 flex-col items-center gap-0"
          >
            <div className="absolute inset-y-3 w-px bg-ink/10">
              <div ref={fill} className="size-full origin-top bg-emerald-500" />
            </div>
            {services.map((s, i) => (
              <li key={s.id} className="relative py-7">
                <span
                  className={`block size-3 rounded-full border-2 transition-colors duration-300 ${active >= i ? 'border-emerald-500 bg-emerald-500' : 'border-ink/25 bg-snow'}`}
                />
                <span className="sr-only">
                  {s.title}
                  {active === i ? ' (aktif)' : ''}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
