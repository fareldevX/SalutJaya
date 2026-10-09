import { useId } from 'react'
import { cn } from '@/shared/lib/cn'

/** Select native (aksesibel, ramah mobile) dengan gaya pill. Label ditampilkan visual bila `showLabel`. */
export default function Select({ label, showLabel = false, value, onChange, options, className }) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={showLabel ? 'font-display text-sm font-bold' : 'sr-only'}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-full border border-ink/15 bg-white pl-4 pr-10 text-sm font-semibold text-ink hover:border-ink/30 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}
