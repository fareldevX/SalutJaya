import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/shared/motion/gsap'
import { NO_REDUCE } from '@/shared/motion/tokens'
import { MIN_H, placeCells, SPAN, variantOf } from './bentoLayout'
import EditorialTile from './EditorialTile'
import ProductTile from './ProductTile'

/**
 * Bento grid produk. `editorialAt`: indeks sel yang diisi tile editorial (opsional).
 * Tile yang baru muncul masuk berkelompok (ScrollTrigger.batch); yang sudah tampil tidak dianimasikan ulang.
 */
export default function BentoGrid({ products, onOpen, editorialAt = null, fading = false }) {
  const root = useRef(null)
  const cells = [...products]
  if (editorialAt !== null && cells.length > editorialAt)
    cells.splice(editorialAt, 0, { id: '__editorial' })
  const places = placeCells(cells.length)
  const key = cells.map((c) => c.id).join()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(NO_REDUCE, () => {
        const fresh = gsap.utils.toArray('[data-tile]:not([data-in])', root.current)
        if (!fresh.length) return
        gsap.set(fresh, { y: 60, scale: 0.96, opacity: 0 })
        ScrollTrigger.batch(fresh, {
          start: 'top 94%',
          once: true,
          onEnter: (batch) => {
            batch.forEach((el) => el.setAttribute('data-in', ''))
            gsap.to(batch, {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.9,
              ease: 'expo.out',
              stagger: 0.08,
              overwrite: true,
            })
          },
        })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [key], revertOnUpdate: true }
  )

  return (
    <ul
      ref={root}
      className={`grid gap-4 transition-opacity duration-300 [grid-auto-flow:dense] md:grid-cols-2 lg:auto-rows-[14rem] lg:grid-cols-12 ${fading ? 'opacity-60' : ''}`}
    >
      {cells.map((cell, i) => {
        const [c, r] = places[i]
        const variant = variantOf(c, r)
        return (
          <li
            key={cell.id}
            data-tile
            className={`${SPAN[`${c}x${r}`]} ${MIN_H[variant]} lg:min-h-0`}
          >
            {cell.id === '__editorial' ? (
              <EditorialTile />
            ) : (
              <ProductTile product={cell} variant={variant} onOpen={onOpen} />
            )}
          </li>
        )
      })}
    </ul>
  )
}
