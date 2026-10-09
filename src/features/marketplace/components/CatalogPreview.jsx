import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScrollTrigger } from '@/shared/motion/gsap'
import { Button } from '@/shared/ui'
import { useFeaturedProducts } from '../hooks/useProducts'
import BentoGrid from './BentoGrid'
import BentoSkeleton from './BentoSkeleton'

/** Jembatan konsultasi → perangkat, dengan 5 produk unggulan dalam bento grid. Dipakai di beranda. */
export default function CatalogPreview() {
  const { data, isPending, isError } = useFeaturedProducts(5)
  const navigate = useNavigate()

  // Tinggi section berubah saat data tiba: posisi ScrollTrigger di bawahnya harus dihitung ulang
  useEffect(() => {
    if (data) requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [data])

  return (
    <section
      id="katalog"
      aria-label="Hardware unggulan"
      className="container-x relative pb-32 pt-24"
    >
      <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
        <h2 className="max-w-[12ch] text-h2">Dari konsultasi ke perangkat.</h2>
        <div className="max-w-sm">
          <p className="text-lead text-ink-soft">
            Rekomendasi kami langsung terhubung ke katalog, jadi perangkat yang dirancang bisa
            dipesan di tempat yang sama.
          </p>
          <Button className="mt-6" variant="dark" to="/katalog">
            Lihat seluruh katalog
          </Button>
        </div>
      </div>
      {isPending && <BentoSkeleton count={5} />}
      {isError && (
        <p role="alert" className="rounded-panel bg-rose-50 p-5 text-rose-800">
          Katalog belum bisa dimuat. Coba muat ulang halaman.
        </p>
      )}
      {data && <BentoGrid products={data.items} onOpen={(p) => navigate(`/katalog?p=${p.slug}`)} />}
    </section>
  )
}
