import Marquee from '@/shared/motion/components/Marquee'
import { brands } from '../data/content'

export default function TrustMarquee() {
  return (
    <section aria-label="Brand perangkat di katalog" className="relative py-24">
      <p className="container-x mb-8 font-display text-sm font-bold text-ink-soft">
        Brand yang tersedia di katalog kami
      </p>
      <p className="sr-only">{brands.join(', ')}</p>
      <Marquee duration={45} reverse className="mask-fade-x">
        {brands.map((b) => (
          <span key={b} aria-hidden="true" className="pr-[6vw] font-display text-h3 text-ink/55">
            {b}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
