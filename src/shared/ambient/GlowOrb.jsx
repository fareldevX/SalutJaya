import { cn } from '@/shared/lib/cn'

const tones = { emerald: '--emerald-500', teal: '--teal', sky: '--sky' }

/** Bola cahaya lembut (radial-gradient, tanpa filter blur agar murah di GPU). Posisikan lewat className. */
export default function GlowOrb({ tone = 'emerald', opacity = 0.3, className, ref, ...props }) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none absolute rounded-full', className)}
      style={{
        background: `radial-gradient(closest-side, rgb(var(${tones[tone]}) / ${opacity}), transparent)`,
      }}
      {...props}
    />
  )
}
