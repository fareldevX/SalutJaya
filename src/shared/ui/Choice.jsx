import { cn } from '@/shared/lib/cn'

/** Radio/checkbox bergaya chip. Input asli tetap ada (sr-only) sehingga keyboard dan pembaca layar berfungsi. */
export default function Choice({ type = 'radio', children, className, ref, ...props }) {
  return (
    <label className={cn('block cursor-pointer', className)}>
      <input ref={ref} type={type} className="peer sr-only" {...props} />
      <span className="flex items-center gap-2 rounded-panel border border-ink/15 bg-white px-4 py-3 text-sm font-semibold transition-colors hover:border-ink/35 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-500/30">
        {children}
      </span>
    </label>
  )
}
