import { useCartStore } from '@/shared/store/cart.store'

/** Pemberitahuan bila stok berubah dan keranjang disesuaikan otomatis. */
export default function StockNotices() {
  const notices = useCartStore((s) => s.notices)
  const dismiss = useCartStore((s) => s.dismissNotices)
  if (!notices.length) return null
  return (
    <div role="status" className="mb-4 rounded-panel bg-sky-400/15 p-4 text-sm">
      <p className="font-bold">Stok berubah, keranjang disesuaikan:</p>
      <ul className="mt-1 list-disc pl-5">
        {notices.map((n, i) => (
          <li key={i}>
            {n.name}:{' '}
            {n.type === 'out'
              ? 'stok habis, dialihkan ke permintaan penawaran.'
              : `jumlah dikurangi menjadi ${n.to} unit.`}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={dismiss}
        className="mt-2 font-bold underline underline-offset-4"
      >
        Tutup
      </button>
    </div>
  )
}
