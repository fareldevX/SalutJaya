import { motion } from 'framer-motion'
import { formatIDR } from '@/shared/lib/formatters'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui'
import { CATEGORY_LABEL } from '../constants'
import { useAddToCart } from '../hooks/useAddToCart'
import { useCompareStore } from '../store/compare.store'
import ProductArt from './ProductArt'
import SpecChips from './SpecChips'

const hover = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.06, rotate: -2 },
}

// Variasi tampilan menurut ukuran sel di bento grid
const variants = {
  xl: {
    pad: 'p-8',
    art: 'absolute -right-10 top-16 w-[58%]',
    title: 'text-h3 max-w-[12ch]',
    chips: 4,
  },
  tall: {
    pad: 'p-6',
    art: 'mx-auto mt-5 w-[104%] max-w-none -translate-x-[2%]',
    title: 'text-2xl',
    chips: 3,
  },
  wide: {
    pad: 'p-6',
    art: 'absolute -right-4 top-1/2 w-[36%] -translate-y-1/2',
    title: 'text-2xl max-w-[18ch]',
    chips: 3,
  },
  compact: {
    pad: 'p-5',
    art: 'absolute -right-6 top-4 w-[44%] opacity-90',
    title: 'text-lg max-w-[14ch]',
    chips: 2,
  },
}

function StockLabel({ stock }) {
  if (stock === 0) return <Badge tone="slate">Stok habis</Badge>
  if (stock <= 3) return <Badge tone="sky">Stok terbatas</Badge>
  return null // stok normal tidak perlu label; hindari kebisingan visual
}

/**
 * Tile produk. `variant`: xl | tall | wide | compact. Seluruh kartu bisa diklik (tombol nama meluas),
 * tombol aksi lain berada di atasnya (z-10).
 */
export default function ProductTile({ product, variant = 'compact', onOpen }) {
  const v = variants[variant]
  const { addToCart, added } = useAddToCart(product)
  const inCompare = useCompareStore((s) => s.items.some((p) => p.id === product.id))
  const toggleCompare = useCompareStore((s) => s.toggle)
  const full = useCompareStore((s) => s.items.length >= 3)

  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover="hover"
      data-cursor="Lihat"
      className={cn(
        'group relative flex h-full flex-col justify-between overflow-hidden rounded-tile border border-ink/10 bg-white',
        v.pad
      )}
    >
      <motion.div
        aria-hidden="true"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute -right-10 bottom-0 size-72 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(16 185 129 / 0.22), transparent)' }}
      />

      <div className="relative z-10 flex items-center gap-2">
        <Badge tone="slate">{CATEGORY_LABEL[product.category]}</Badge>
        <StockLabel stock={product.stock} />
      </div>

      {variant === 'tall' && (
        <motion.div
          layoutId={`art-${product.id}`}
          variants={hover}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className={v.art}
        >
          <ProductArt category={product.category} className="h-auto w-full" />
        </motion.div>
      )}
      {variant !== 'tall' && (
        <motion.div
          layoutId={`art-${product.id}`}
          variants={hover}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className={cn('pointer-events-none', v.art)}
        >
          <ProductArt category={product.category} className="h-auto w-full" />
        </motion.div>
      )}

      <div className="relative mt-4">
        <h3 className="font-display font-extrabold leading-[1.02] tracking-tight">
          <motion.button
            layoutId={`title-${product.id}`}
            type="button"
            onClick={() => onOpen?.(product)}
            className={cn(
              'text-left outline-offset-4 after:absolute after:inset-0 after:z-0 after:content-[""]',
              v.title
            )}
          >
            {product.name}
          </motion.button>
        </h3>
        <div className="mt-3">
          <SpecChips items={product.specSummary} limit={v.chips} />
        </div>
        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl font-extrabold tracking-tight">
            {formatIDR(product.price)}
          </p>
          <div
            data-cursor-off
            className="flex items-center gap-1.5 transition-[opacity,transform] duration-300 lg:translate-y-2 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          >
            <button
              type="button"
              aria-pressed={inCompare}
              disabled={!inCompare && full}
              onClick={() => toggleCompare(product)}
              className={cn(
                'rounded-full border px-3.5 py-2 text-xs font-bold transition-colors disabled:opacity-40',
                inCompare ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink/50'
              )}
            >
              {inCompare ? 'Dipilih' : 'Bandingkan'}
            </button>
            <button
              type="button"
              onClick={addToCart}
              aria-label={`Tambah ${product.name} ke keranjang`}
              className="rounded-full bg-emerald-500 px-3.5 py-2 text-xs font-bold text-ink hover:bg-emerald-400"
            >
              {added ? 'Ditambahkan' : '+ Keranjang'}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
