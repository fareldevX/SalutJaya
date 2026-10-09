import { useRef } from 'react'
import ServiceStage from '@/features/consulting/components/ServiceStage'
import FinalCTA from '@/features/landing/components/FinalCTA'
import Hero from '@/features/landing/components/hero/Hero'
import ManifestoStrip from '@/features/landing/components/ManifestoStrip'
import TrustMarquee from '@/features/landing/components/TrustMarquee'
import CatalogPreview from '@/features/marketplace/components/CatalogPreview'
import NetworkThread from '@/shared/ambient/NetworkThread'
import { usePageMeta } from '@/shared/hooks/usePageMeta'
import { JsonLd } from '@/shared/ui'

/** Beranda: komposisi lintas fitur dilakukan di lapisan app, karena fitur tidak boleh saling impor. */
export default function HomePage() {
  const page = useRef(null)
  usePageMeta()
  return (
    <div ref={page} className="relative">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'SalutJaya',
          description: 'Konsultasi IT dan marketplace hardware infrastruktur untuk perusahaan.',
        }}
      />
      <NetworkThread trigger={page} />
      <Hero />
      <ManifestoStrip />
      <ServiceStage />
      <CatalogPreview />
      <TrustMarquee />
      <FinalCTA />
    </div>
  )
}
