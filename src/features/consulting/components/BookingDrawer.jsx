import { lazy, Suspense } from 'react'
import { useUiStore } from '@/shared/store/ui.store'
import { Drawer, Skeleton } from '@/shared/ui'

// Form (react-hook-form + resolver zod) baru diunduh saat drawer pertama kali dibuka
const BookingForm = lazy(() => import('./BookingForm'))

/** Dipasang sekali di layout. Dibuka dari mana saja lewat useUiStore().openBooking(). */
export default function BookingDrawer() {
  const { open, nonce, defaults } = useUiStore((s) => s.booking)
  const close = useUiStore((s) => s.closeBooking)
  return (
    <Drawer open={open} onClose={close} title="Konsultasi dan penawaran" className="sm:max-w-lg">
      <Suspense fallback={<Skeleton className="h-64 rounded-tile" />}>
        {/* key: form di-reset setiap kali dibuka dari titik masuk yang berbeda */}
        <BookingForm key={nonce} defaults={defaults} onClose={close} />
      </Suspense>
    </Drawer>
  )
}
