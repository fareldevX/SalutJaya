import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDialog } from '@/shared/hooks/useDialog'
import { useLockScroll } from '@/shared/hooks/useLockScroll'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { cn } from '@/shared/lib/cn'

const sides = {
  right: { hidden: { x: '100%' }, cls: 'right-0 inset-y-0 w-full max-w-md' },
  left: { hidden: { x: '-100%' }, cls: 'left-0 inset-y-0 w-full max-w-md' },
  bottom: { hidden: { y: '100%' }, cls: 'inset-x-0 bottom-0 max-h-[88svh] w-full rounded-t-tile' },
}

export const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

/**
 * Panel geser (dialog modal) untuk menu mobile, booking, dan filter.
 * `side`: 'right' | 'left' | 'bottom'. Esc / klik latar menutup, fokus terkunci dan dikembalikan saat ditutup.
 */
export default function Drawer({ open, onClose, title, side = 'right', className, children }) {
  const panelRef = useRef(null)
  const reduce = useReducedMotion()
  useLockScroll(open)
  useDialog(open, onClose, panelRef)
  const s = sides[side]

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={s.hidden}
            animate={{ x: 0, y: 0 }}
            exit={s.hidden}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 36 }}
            data-lenis-prevent
            className={cn(
              'absolute flex flex-col bg-snow shadow-2xl outline-none',
              s.cls,
              className
            )}
          >
            <header className="flex items-center justify-between px-6 py-5">
              <h2 className="font-display text-xl font-extrabold tracking-tight">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup panel"
                className="grid size-10 place-items-center rounded-full hover:bg-ink/5"
              >
                <CloseIcon />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
