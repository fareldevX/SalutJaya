import Marquee from '@/shared/motion/components/Marquee'
import { scope } from '../data/content'
import NodeGlyph from './NodeGlyph'

/** Pita teks raksasa yang naik menimpa dasar hero. Memudar di kiri-kanan, tanpa garis batas. */
export default function ManifestoStrip() {
  return (
    <section aria-label="Cakupan layanan" className="relative z-10 -mt-16 py-10">
      <p className="sr-only">{scope.join(', ')}</p>
      <Marquee duration={60} className="mask-fade-x">
        {scope.map((word, i) => (
          <span
            key={word}
            aria-hidden="true"
            className="flex items-center gap-[3vw] pr-[3vw] font-display text-h1"
          >
            <span className={i % 2 ? 'text-outline' : ''}>{word}</span>
            <NodeGlyph />
          </span>
        ))}
      </Marquee>
    </section>
  )
}
