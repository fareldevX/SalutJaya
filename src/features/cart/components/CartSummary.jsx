import { formatIDR } from '@/shared/lib/formatters'

/** Ringkasan: total hanya untuk item beli langsung; item penawaran dihitung terpisah. */
export default function CartSummary({ totals }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-ink-soft">Beli langsung ({totals.buyLines.length} produk)</dt>
        <dd className="font-semibold">{formatIDR(totals.subtotal)}</dd>
      </div>
      {totals.quoteLines.length > 0 && (
        <div className="flex justify-between">
          <dt className="text-ink-soft">Minta penawaran</dt>
          <dd className="font-semibold">{totals.quoteLines.length} produk</dd>
        </div>
      )}
      <div className="flex justify-between border-t border-ink/10 pt-3 font-display text-lg font-extrabold tracking-tight">
        <dt>Subtotal</dt>
        <dd>{formatIDR(totals.subtotal)}</dd>
      </div>
      <p className="text-xs text-ink-soft">
        Harga B2B belum termasuk PPN. Pajak dan ongkos kirim dihitung pada invoice.
      </p>
    </dl>
  )
}
