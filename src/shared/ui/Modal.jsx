import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDialog } from '@/shared/hooks/useDialog'
import { useLockScroll } from '@/shared/hooks/useLockScroll'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { cn } from '@/shared/lib/cn'
import { CloseIcon } from './Drawer'

/** Dialog di tengah layar. Isi bebas; anak boleh memakai layoutId Framer untuk transisi elemen bersama. */
export default function Modal({ open, onClose, title, className, children }) {
  const panelRef = useRef(null)
  const reduce = useReducedMotion()
  useLockScroll(open)
  useDialog(open, onClose, panelRef)

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className={cn(
              'relative max-h-[90svh] w-full max-w-4xl overflow-y-auto rounded-tile bg-snow shadow-2xl outline-none',
              className
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/80 hover:bg-white"
            >
              <CloseIcon />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
