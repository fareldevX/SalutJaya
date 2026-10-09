import { useEffect, useState } from 'react'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { cn } from '@/shared/lib/cn'
import { Button, Drawer, Select } from '@/shared/ui'
import { CATEGORY_LABEL, PRICE_PRESETS, SORT_OPTIONS } from '../constants'

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
)

function Controls({ filters, set, facets, stacked }) {
  const cats = [
    { value: '', label: 'Semua' },
    ...Object.keys(CATEGORY_LABEL).map((c) => ({
      value: c,
      label: CATEGORY_LABEL[c],
      n: facets?.categories?.[c],
    })),
  ]
  const opts = (obj, all) => [
    { value: '', label: all },
    ...Object.keys(obj ?? {})
      .sort()
      .map((k) => ({ value: k, label: `${k} (${obj[k]})` })),
  ]
  const sel = (label, key, options) => (
    <Select
      showLabel={stacked}
      label={label}
      value={filters[key]}
      onChange={(v) => set(key, v)}
      options={options}
    />
  )

  return (
    <>
      <div role="group" aria-label="Kategori" className="flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <button
            key={c.value}
            type="button"
            aria-pressed={filters.cat === c.value}
            onClick={() => set('cat', c.value)}
            className={cn(
              'h-11 rounded-full px-4 font-display text-sm font-bold transition-colors',
              filters.cat === c.value ? 'bg-ink text-white' : 'bg-ink/[0.06] hover:bg-ink/10'
            )}
          >
            {c.label}
            {c.n != null && <span className="ml-1.5 font-mono text-xs opacity-60">{c.n}</span>}
          </button>
        ))}
      </div>
      <div className={cn('flex gap-2', stacked ? 'flex-col' : 'flex-wrap')}>
        {sel('Brand', 'brand', opts(facets?.brands, 'Semua brand'))}
        {sel('Form factor', 'ff', opts(facets?.formFactors, 'Semua form factor'))}
        {sel('Rentang harga', 'price', PRICE_PRESETS)}
        {sel('Urutkan', 'sort', SORT_OPTIONS)}
      </div>
    </>
  )
}

/** Bilah filter: inline di desktop, bottom sheet di mobile. Pencarian di-debounce 300 ms sebelum masuk ke URL. */
export default function FilterRail({ filters, set, reset, activeCount, facets, total, shown }) {
  const [text, setText] = useState(filters.q)
  const [sheet, setSheet] = useState(false)
  const debounced = useDebouncedValue(text, 300)

  useEffect(() => {
    if (debounced !== filters.q) set('q', debounced, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])
  // Sinkron bila URL berubah dari luar (reset / back). Perubahan yang berasal dari debounce kita sendiri diabaikan.
  const [prevQ, setPrevQ] = useState(filters.q)
  if (filters.q !== prevQ) {
    setPrevQ(filters.q)
    if (filters.q !== debounced) setText(filters.q)
  }

  const search = (
    <label className="relative block min-w-0 flex-1 lg:w-60 lg:flex-none">
      <span className="sr-only">Cari produk</span>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
        <SearchIcon />
      </span>
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cari produk"
        className="h-11 w-full rounded-full border border-ink/15 bg-white pl-10 pr-4 text-sm font-medium placeholder:text-ink-soft/70 hover:border-ink/30 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
      />
    </label>
  )

  return (
    <div>
      <div className="flex items-center gap-2 lg:hidden">
        {search}
        <Button variant="ghost" size="sm" onClick={() => setSheet(true)} className="h-11 shrink-0">
          Filter{activeCount ? ` (${activeCount})` : ''}
        </Button>
      </div>
      <Drawer open={sheet} onClose={() => setSheet(false)} side="bottom" title="Filter produk">
        <div className="flex flex-col gap-5">
          <Controls filters={filters} set={set} facets={facets} stacked />
          <Button onClick={() => setSheet(false)}>Tampilkan {total} produk</Button>
        </div>
      </Drawer>

      <div className="hidden flex-wrap items-center gap-3 rounded-[1.75rem] border border-ink/10 bg-white/80 p-3 backdrop-blur-lg lg:flex">
        {search}
        <Controls filters={filters} set={set} facets={facets} />
      </div>

      <p className="mt-4 flex items-center gap-4 text-sm text-ink-soft" aria-live="polite">
        <span>
          Menampilkan {shown} dari {total} produk
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="font-bold text-emerald-700 underline underline-offset-4"
          >
            Reset filter
          </button>
        )}
      </p>
    </div>
  )
}
