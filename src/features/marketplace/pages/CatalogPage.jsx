import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePageMeta } from '@/shared/hooks/usePageMeta'
import { useUiStore } from '@/shared/store/ui.store'
import { Button } from '@/shared/ui'
import BentoGrid from '../components/BentoGrid'
import BentoSkeleton from '../components/BentoSkeleton'
import CompareTray from '../components/CompareTray'
import FilterRail from '../components/FilterRail'
import ProductQuickView from '../components/ProductQuickView'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useProductFilters } from '../hooks/useProductFilters'

export default function CatalogPage() {
  usePageMeta({
    title: 'Katalog hardware',
    description:
      'Katalog server, switch, dan router untuk perusahaan. Harga B2B, beli langsung atau minta penawaran.',
  })
  const { filters, set, reset, activeCount } = useProductFilters()
  const {
    items,
    total,
    facets,
    isPending,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useProducts(filters)
  const openBooking = useUiStore((s) => s.openBooking)

  // Quick view dikendalikan param ?p=slug agar bisa dibagikan dan dibuka dari beranda
  const [params, setParams] = useSearchParams()
  const slug = params.get('p')
  const listed = items.find((p) => p.slug === slug)
  const fetched = useProduct(listed ? null : slug)
  const product = listed ?? fetched.data
  const open = (p) => setParams((prev) => new URLSearchParams([...prev, ['p', p.slug]]))
  const close = () =>
    setParams(
      (prev) => {
        const n = new URLSearchParams(prev)
        n.delete('p')
        return n
      },
      { replace: true }
    )

  // Muat halaman berikutnya otomatis saat sentinel mendekati viewport
  const sentinel = useRef(null)
  useEffect(() => {
    const el = sentinel.current
    if (!el || !hasNextPage) return
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && !isFetchingNextPage && fetchNextPage(),
      { rootMargin: '400px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, items.length])

  return (
    <section className="container-x pb-32 pt-32">
      <h1 className="max-w-[12ch] text-h1">Katalog hardware.</h1>
      <p className="mb-12 mt-6 max-w-xl text-lead text-ink-soft">
        Server, switch, dan router untuk infrastruktur perusahaan. Harga B2B, bisa langsung diminta
        penawarannya.
      </p>

      <FilterRail
        filters={filters}
        set={set}
        reset={reset}
        activeCount={activeCount}
        facets={facets}
        total={total}
        shown={items.length}
      />

      <div className="mt-8">
        {isPending && <BentoSkeleton count={7} />}

        {isError && (
          <div role="alert" className="rounded-tile bg-rose-50 p-8 text-rose-900">
            <p className="font-display text-xl font-extrabold">Katalog gagal dimuat.</p>
            <p className="mt-1 text-sm">{error.message}</p>
            <Button className="mt-5" variant="dark" onClick={() => refetch()}>
              Coba lagi
            </Button>
          </div>
        )}

        {!isPending && !isError && items.length === 0 && (
          <div className="rounded-tile border border-dashed border-ink/20 p-12 text-center">
            <p className="font-display text-2xl font-extrabold">Tidak ada produk yang cocok.</p>
            <p className="mx-auto mt-2 max-w-md text-ink-soft">
              Coba longgarkan filter, atau ceritakan kebutuhan Anda dan kami bantu pilihkan.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="dark" onClick={reset}>
                Reset filter
              </Button>
              <Button
                variant="ghost"
                onClick={() => openBooking({ service: 'hardware', kind: 'consultation' })}
              >
                Bicara dengan konsultan
              </Button>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <BentoGrid
            products={items}
            onOpen={open}
            editorialAt={items.length > 4 ? 3 : null}
            fading={isFetching && isPlaceholderData}
          />
        )}

        <div ref={sentinel} className="mt-10 flex justify-center">
          {hasNextPage && (
            <Button variant="ghost" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? 'Memuat…' : 'Muat lebih banyak'}
            </Button>
          )}
        </div>
      </div>

      <ProductQuickView
        product={product}
        loading={Boolean(slug) && fetched.isPending && !listed}
        onClose={close}
      />
      <CompareTray />
    </section>
  )
}
