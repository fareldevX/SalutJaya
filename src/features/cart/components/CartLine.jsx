import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { formatIDR } from '@/shared/lib/formatters'
import { MAX_QUOTE_QTY, useCartStore } from '@/shared/store/cart.store'
import QtyStepper from './QtyStepper'

const MODES = [
  { value: 'buy', label: 'Beli langsung' },
  { value: 'quote', label: 'Minta penawaran' },
]

export default function CartLine({ line, onNavigate }) {
  const { setQty, setMode, remove } = useCartStore.getState()
  const max = line.mode === 'buy' ? Math.max(1, line.stock) : MAX_QUOTE_QTY
  return (
    <li className="py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/katalog/${line.slug}`}
            onClick={onNavigate}
            className="font-display text-lg font-extrabold leading-tight tracking-tight hover:underline"
          >
            {line.name}
          </Link>
          <p className="mt-1 font-mono text-xs text-ink-soft">{line.specSummary.join(' · ')}</p>
        </div>
        <button
          type="button"
          onClick={() => remove(line.productId)}
          aria-label={`Hapus ${line.name} dari keranjang`}
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-ink/10 hover:text-ink"
        >
          ×
        </button>
      </div>

      <div
        role="radiogroup"
        aria-label={`Mode untuk ${line.name}`}
        className="mt-3 inline-flex rounded-full bg-ink/[0.06] p-1 text-xs font-bold"
      >
        {MODES.map((m) => {
          const disabled = m.value === 'buy' && line.stock === 0
          return (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={line.mode === m.value}
              disabled={disabled}
              title={disabled ? 'Stok habis, hanya bisa diminta penawaran' : undefined}
              onClick={() => setMode(line.productId, m.value)}
              className={cn(
                'rounded-full px-3 py-1.5 transition-colors disabled:opacity-40',
                line.mode === m.value ? 'bg-ink text-white' : 'hover:bg-ink/10'
              )}
            >
              {m.label}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <QtyStepper
          value={line.qty}
          max={max}
          label={line.name}
          onChange={(n) => setQty(line.productId, n)}
        />
        <div className="text-right">
          <p className="font-display text-lg font-extrabold tracking-tight">
            {formatIDR(line.price * line.qty)}
          </p>
          <p className="text-xs text-ink-soft">
            {line.mode === 'quote' ? 'Harga indikatif' : `${formatIDR(line.price)} / unit`}
          </p>
        </div>
      </div>
      {line.mode === 'buy' && line.stock > 0 && line.stock <= 3 && (
        <p className="mt-2 text-xs font-semibold text-sky-500">Stok tersisa {line.stock} unit</p>
      )}
    </li>
  )
}
