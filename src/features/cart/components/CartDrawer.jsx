import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartTotals, useCartStore } from '@/shared/store/cart.store'
import { useUiStore } from '@/shared/store/ui.store'
import { Button, Drawer } from '@/shared/ui'
import { useStockSync } from '../hooks/useStockSync'
import CartLine from './CartLine'
import CartSummary from './CartSummary'
import StockNotices from './StockNotices'

export default function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen)
  const close = useUiStore((s) => s.closeCart)
  const lines = useCartStore((s) => s.lines)
  const totals = useMemo(() => cartTotals(lines), [lines])
  const navigate = useNavigate()
  useStockSync(open)

  const checkout = () => {
    close()
    navigate('/checkout')
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      title={`Keranjang${totals.count ? ` (${totals.count})` : ''}`}
      className="sm:max-w-lg"
    >
      {lines.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-2xl font-extrabold tracking-tight">
            Keranjang masih kosong.
          </p>
          <p className="mx-auto mt-2 max-w-xs text-ink-soft">
            Pilih perangkat dari katalog, lalu beli langsung atau minta penawaran.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              close()
              navigate('/katalog')
            }}
          >
            Lihat katalog
          </Button>
        </div>
      ) : (
        <>
          <StockNotices />
          <ul className="divide-y divide-ink/10">
            {lines.map((l) => (
              <CartLine key={l.productId} line={l} onNavigate={close} />
            ))}
          </ul>
          <div className="sticky bottom-0 -mx-6 mt-4 space-y-4 border-t border-ink/10 bg-snow px-6 pb-2 pt-5">
            <CartSummary totals={totals} />
            <Button size="lg" className="w-full" onClick={checkout}>
              Lanjut ke checkout
            </Button>
          </div>
        </>
      )}
    </Drawer>
  )
}
