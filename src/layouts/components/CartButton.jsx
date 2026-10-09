import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { cartTotals, useCartStore } from '@/shared/store/cart.store'
import { useUiStore } from '@/shared/store/ui.store'

/** Tombol keranjang di nav. Angka berganti dengan efek "odometer", badge berdenyut tiap jumlah berubah. */
export default function CartButton() {
  const count = useCartStore((s) => cartTotals(s.lines).count)
  const openCart = useUiStore((s) => s.openCart)
  const reduce = useReducedMotion()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Buka keranjang, ${count} item`}
      className="relative grid size-10 place-items-center rounded-full hover:bg-ink/5"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 4h2l2.4 11h10.2L20 8H6.2" />
        <circle cx="9" cy="19.5" r="1.3" />
        <circle cx="17" cy="19.5" r="1.3" />
      </svg>
      {count > 0 && (
        <motion.span
          key={`pop-${count}`}
          initial={reduce ? false : { scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center overflow-hidden rounded-full bg-emerald-500 px-1 font-mono text-[0.7rem] font-bold text-ink"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              initial={reduce ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: -14, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      )}
    </button>
  )
}
