import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatIDR } from '@/shared/lib/formatters'
import { useUiStore } from '@/shared/store/ui.store'
import { Badge, Button, Modal, Skeleton } from '@/shared/ui'
import { CATEGORY_LABEL } from '../constants'
import { useAddToCart } from '../hooks/useAddToCart'
import ProductArt from './ProductArt'

export function SpecList({ specs }) {
  return (
    <dl className="divide-y divide-ink/10 text-sm">
      {Object.entries(specs).map(([k, v]) => (
        <div key={k} className="flex justify-between gap-6 py-2.5">
          <dt className="text-ink-soft">{k}</dt>
          <dd className="text-right font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Panel detail cepat. Foto dan judul berpindah mulus dari tile (layoutId yang sama). */
export default function ProductQuickView({ product, loading, onClose }) {
  const openBooking = useUiStore((s) => s.openBooking)
  const { addToCart, added } = useAddToCart(product ?? { id: '', stock: 0 })
  return (
    <Modal
      open={Boolean(product) || loading}
      onClose={onClose}
      title={product?.name ?? 'Memuat produk'}
    >
      {!product ? (
        <div className="p-8">
          <Skeleton className="h-80 rounded-tile" />
        </div>
      ) : (
        <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_1fr] md:p-10">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <Badge tone="slate">{CATEGORY_LABEL[product.category]}</Badge>
              <motion.h2
                layoutId={`title-${product.id}`}
                className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight"
              >
                {product.name}
              </motion.h2>
            </div>
            <motion.div layoutId={`art-${product.id}`} className="rounded-tile bg-white p-6">
              <ProductArt category={product.category} className="h-auto w-full" />
            </motion.div>
          </div>
          <div className="flex flex-col gap-6">
            <SpecList specs={product.specs} />
            <p className="font-display text-3xl font-extrabold tracking-tight">
              {formatIDR(product.price)}
            </p>
            <p className="-mt-4 text-sm text-ink-soft">
              Harga B2B sebelum PPN.{' '}
              {product.stock ? `Stok ${product.stock} unit.` : 'Stok sedang habis.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={addToCart}>
                {added
                  ? 'Ditambahkan'
                  : product.stock === 0
                    ? 'Tambah (minta penawaran)'
                    : 'Tambah ke keranjang'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onClose()
                  openBooking({
                    service: 'hardware',
                    kind: 'quote',
                    note: `Minta penawaran untuk ${product.name}. `,
                  })
                }}
              >
                Minta penawaran
              </Button>
              <Button variant="ghost" to={`/katalog/${product.slug}`}>
                Halaman produk
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
