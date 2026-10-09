import { useUiStore } from '@/shared/store/ui.store'
import { Button } from '@/shared/ui'

/** Sela editorial di tengah grid: mengarahkan pembeli yang ragu ke konsultan. */
export default function EditorialTile() {
  const openBooking = useUiStore((s) => s.openBooking)
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-tile bg-ink p-6 text-white">
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 size-48 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(16 185 129 / 0.45), transparent)' }}
      />
      <p className="relative font-display text-xl font-extrabold leading-tight tracking-tight">
        Belum yakin spesifikasi mana yang tepat?
      </p>
      <Button
        size="sm"
        className="relative mt-4 self-start"
        onClick={() => openBooking({ service: 'hardware', kind: 'consultation' })}
      >
        Bicara dengan konsultan
      </Button>
    </div>
  )
}
