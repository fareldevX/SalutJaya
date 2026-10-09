import { Link, useParams } from 'react-router-dom'
import { formatIDR } from '@/shared/lib/formatters'
import { useUiStore } from '@/shared/store/ui.store'
import { Badge, Button, Skeleton } from '@/shared/ui'
import ProductArt from '../components/ProductArt'
import { SpecList } from '../components/ProductQuickView'
import { usePageMeta } from '@/shared/hooks/usePageMeta'
import { JsonLd } from '@/shared/ui'
import { CATEGORY_LABEL } from '../constants'
import { useAddToCart } from '../hooks/useAddToCart'
import { useProduct } from '../hooks/useProducts'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { data: p, isPending, isError } = useProduct(slug)
  const openBooking = useUiStore((s) => s.openBooking)
  const { addToCart, added } = useAddToCart(p ?? { id: '', stock: 0 })
  usePageMeta(
    p
      ? {
          title: p.name,
          description: `${p.name}: ${p.specSummary.join(', ')}. Harga B2B, minta penawaran atau beli langsung di SalutJaya.`,
        }
      : { title: 'Produk' }
  )

  return (
    <section className="container-x pb-32 pt-32">
      <Link
        to="/katalog"
        className="text-sm font-bold text-emerald-700 underline underline-offset-4"
      >
        Kembali ke katalog
      </Link>

      {isPending && <Skeleton className="mt-8 h-[28rem] rounded-tile" />}
      {isError && (
        <div className="mt-12">
          <h1 className="text-h2">Produk tidak ditemukan.</h1>
          <Button className="mt-8" to="/katalog">
            Lihat katalog
          </Button>
        </div>
      )}
      {p && (
        <>
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: p.name,
              brand: { '@type': 'Brand', name: p.brand },
              category: CATEGORY_LABEL[p.category],
              offers: {
                '@type': 'Offer',
                priceCurrency: 'IDR',
                price: p.price,
                availability:
                  p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              },
            }}
          />
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Badge tone="slate">{CATEGORY_LABEL[p.category]}</Badge>
              <h1 className="mt-4 text-h1">{p.name}</h1>
              <div className="mt-10 rounded-tile border border-ink/10 bg-white p-10">
                <ProductArt category={p.category} className="h-auto w-full" />
              </div>
            </div>
            <div className="flex flex-col gap-8 lg:pt-24">
              <SpecList specs={p.specs} />
              <div>
                <p className="font-display text-4xl font-extrabold tracking-tight">
                  {formatIDR(p.price)}
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  Harga B2B sebelum PPN. {p.stock ? `Stok ${p.stock} unit.` : 'Stok sedang habis.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="lg" onClick={addToCart}>
                  {added
                    ? 'Ditambahkan'
                    : p.stock === 0
                      ? 'Tambah (minta penawaran)'
                      : 'Tambah ke keranjang'}
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() =>
                    openBooking({
                      service: 'hardware',
                      kind: 'quote',
                      note: `Minta penawaran untuk ${p.name}. `,
                    })
                  }
                >
                  Minta penawaran
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() =>
                    openBooking({
                      service: 'hardware',
                      kind: 'consultation',
                      note: `Konsultasi pemilihan ${p.name}. `,
                    })
                  }
                >
                  Konsultasi dulu
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
