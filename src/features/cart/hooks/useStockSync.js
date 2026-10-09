import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCartStore } from '@/shared/store/cart.store'
import { getStock } from '../api/cart.api'

/**
 * Polling stok (15 dtk) hanya saat `enabled` (drawer keranjang terbuka / halaman checkout).
 * Hasilnya diterapkan ke store: qty otomatis disesuaikan dan pengguna diberi notifikasi.
 * Bisa diganti SSE/WebSocket tanpa mengubah pemanggil hook ini.
 */
export function useStockSync(enabled) {
  const ids = useCartStore((s) => s.lines.map((l) => l.productId).join(','))
  const syncStock = useCartStore((s) => s.syncStock)
  const q = useQuery({
    queryKey: ['stock', ids],
    queryFn: ({ signal }) => getStock(ids.split(','), signal),
    enabled: enabled && ids.length > 0,
    refetchInterval: 15_000,
    staleTime: 0,
  })
  useEffect(() => {
    if (q.data) syncStock(q.data)
  }, [q.data, q.dataUpdatedAt, syncStock])
  return q
}
