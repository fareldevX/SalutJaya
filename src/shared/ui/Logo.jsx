import { cn } from '@/shared/lib/cn'

/** Wordmark SalutJaya: tiga node terhubung (simbol jaringan) + nama. */
export default function Logo({ className, showName = true }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" className="fill-ink" />
        <path
          d="M9 21l7-10 7 10"
          fill="none"
          className="stroke-emerald-500"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [9, 21],
          [16, 11],
          [23, 21],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="2.6" className="fill-emerald-500" />
        ))}
      </svg>
      {showName && (
        <span className="font-display text-xl font-extrabold tracking-tight">SalutJaya</span>
      )}
    </span>
  )
}
