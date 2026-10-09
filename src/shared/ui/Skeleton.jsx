import { cn } from '@/shared/lib/cn'

/** Blok placeholder dengan shimmer. Atur bentuk lewat className (h-*, w-*, rounded-*). */
export default function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn('skeleton rounded-panel', className)} />
}
