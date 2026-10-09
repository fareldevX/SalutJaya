import { motion } from 'framer-motion'

/** Fade-up sederhana saat masuk viewport. Pakai hemat: hanya untuk elemen pendukung, bukan di setiap section. */
export default function Reveal({ as = 'div', delay = 0, className, children }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  )
}
