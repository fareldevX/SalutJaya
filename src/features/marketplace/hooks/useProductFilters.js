import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const KEYS = ['cat', 'brand', 'ff', 'q', 'price', 'sort']

/**
 * Filter katalog dengan URL sebagai sumber kebenaran: bisa dibagikan, dan tombol back berfungsi.
 * Param lain (mis. `p` untuk quick view) dibiarkan utuh.
 */
export function useProductFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo(
    () => Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? ''])),
    [params]
  )
  const activeCount = KEYS.filter((k) => k !== 'sort' && filters[k]).length

  const set = useCallback(
    (key, value, { replace = false } = {}) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value) next.set(key, value)
          else next.delete(key)
          return next
        },
        { replace }
      ),
    [setParams]
  )

  const reset = useCallback(
    () =>
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        KEYS.forEach((k) => next.delete(k))
        return next
      }),
    [setParams]
  )

  return { filters, set, reset, activeCount }
}
