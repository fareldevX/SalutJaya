import { cn } from '@/shared/lib/cn'

const tones = {
  emerald: 'bg-emerald-100 text-emerald-700',
  slate: 'bg-ink/[0.06] text-ink-soft',
  sky: 'bg-sky-400/15 text-sky-500',
  dark: 'bg-ink text-white',
}

export default function Badge({ tone = 'emerald', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
