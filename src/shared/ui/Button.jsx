import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-bold ' +
  'transition-[background-color,border-color,color,transform] duration-300 ease-out-expo ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants = {
  // Teks ink di atas emerald-500 = kontras ±6.6:1 (putih di atas emerald hanya ±2.5:1)
  primary: 'bg-emerald-500 text-ink hover:bg-emerald-400',
  dark: 'bg-ink text-white hover:bg-ink/85',
  ghost: 'border border-ink/20 text-ink hover:border-ink/50 hover:bg-white',
  quiet: 'text-ink hover:bg-ink/5',
}
const sizes = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-base',
  lg: 'h-14 px-9 text-lg',
}

/**
 * Tombol serbaguna. Beri `to` untuk link internal, `href` untuk link eksternal.
 * @param {{ variant?: keyof typeof variants, size?: keyof typeof sizes, to?: string, href?: string }} props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  className,
  children,
  ...props
}) {
  const cls = cn(base, variants[variant], sizes[size], className)
  if (to)
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  if (href)
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    )
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}
