import { Skeleton } from '@/shared/ui'
import { placeCells } from './bentoLayout'

const span = {
  '12x2': 'lg:col-span-12 lg:row-span-2',
  '6x2': 'lg:col-span-6 lg:row-span-2',
  '6x1': 'lg:col-span-6',
  '3x2': 'lg:col-span-3 lg:row-span-2',
  '3x1': 'lg:col-span-3',
}

/** Kerangka yang meniru bentuk bento grid, bukan spinner. */
export default function BentoSkeleton({ count = 7 }) {
  return (
    <ul
      aria-hidden="true"
      className="grid gap-4 [grid-auto-flow:dense] md:grid-cols-2 lg:auto-rows-[14rem] lg:grid-cols-12"
    >
      {placeCells(count).map(([c, r], i) => (
        <li
          key={i}
          className={`${span[`${c}x${r}`]} min-h-[13rem] lg:min-h-0 ${c >= 6 ? 'md:col-span-2' : ''}`}
        >
          <Skeleton className="size-full rounded-tile" />
        </li>
      ))}
    </ul>
  )
}
