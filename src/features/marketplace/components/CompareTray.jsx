import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatIDR } from '@/shared/lib/formatters'
import { Button, Modal } from '@/shared/ui'
import { CATEGORY_LABEL } from '../constants'
import { MAX_COMPARE, useCompareStore } from '../store/compare.store'

function CompareTable({ items }) {
  const specKeys = [...new Set(items.flatMap((p) => Object.keys(p.specs)))]
  const rows = [
    ['Brand', (p) => p.brand],
    ['Kategori', (p) => CATEGORY_LABEL[p.category]],
    ['Harga', (p) => formatIDR(p.price)],
    ['Stok', (p) => (p.stock ? `${p.stock} unit` : 'Habis')],
    ...specKeys.map((k) => [k, (p) => p.specs[k] ?? '–']),
  ]
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead>
          <tr>
            <th className="w-36 py-3 pr-4" />
            {items.map((p) => (
              <th
                key={p.id}
                scope="col"
                className="py-3 pr-4 align-bottom font-display text-lg font-extrabold leading-tight tracking-tight"
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, get]) => (
            <tr key={label} className="border-t border-ink/10">
              <th scope="row" className="py-3 pr-4 font-semibold text-ink-soft">
                {label}
              </th>
              {items.map((p) => (
                <td key={p.id} className="py-3 pr-4 font-medium">
                  {get(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Tray melayang di bawah layar: produk terpilih (maks 3) dan tombol untuk membuka tabel perbandingan. */
export default function CompareTray() {
  const { items, remove, clear } = useCompareStore()
  const [open, setOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-3xl flex-wrap items-center gap-2 rounded-[1.75rem] border border-ink/10 bg-white/90 p-3 shadow-[0_20px_50px_-15px_rgb(15_23_42/0.3)] backdrop-blur-lg"
          >
            <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {items.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-1.5 rounded-full bg-ink/[0.06] py-1.5 pl-3.5 pr-1.5 text-sm font-semibold"
                >
                  <span className="max-w-[10rem] truncate">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    aria-label={`Hapus ${p.name} dari perbandingan`}
                    className="grid size-6 place-items-center rounded-full hover:bg-ink/10"
                  >
                    ×
                  </button>
                </li>
              ))}
              {items.length < 2 && (
                <li className="self-center text-sm text-ink-soft">
                  Pilih minimal 2 produk (maks {MAX_COMPARE}).
                </li>
              )}
            </ul>
            <Button variant="quiet" size="sm" onClick={clear}>
              Kosongkan
            </Button>
            <Button size="sm" disabled={items.length < 2} onClick={() => setOpen(true)}>
              Bandingkan {items.length}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal
        open={open && items.length >= 2}
        onClose={() => setOpen(false)}
        title="Perbandingan produk"
        className="p-8"
      >
        <h2 className="mb-6 font-display text-3xl font-extrabold tracking-tight">
          Bandingkan produk
        </h2>
        <CompareTable items={items} />
      </Modal>
    </>
  )
}
