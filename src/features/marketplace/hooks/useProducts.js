import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getProduct, getProducts } from '../api/products.api'
import { PAGE_SIZE, PRICE_PRESETS } from '../constants'

/** Ubah filter URL menjadi parameter API. */
const toParams = ({ price, ...rest }) => {
  const preset = PRICE_PRESETS.find((p) => p.value === price)
  return { ...rest, cat: rest.cat, min: preset?.min, max: preset?.max }
}

/** Daftar produk dengan paginasi tak terbatas. keepPreviousData: grid tidak kosong saat filter berubah. */
export function useProducts(filters = {}) {
  const q = useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam, signal }) =>
      getProducts({ ...toParams(filters), page: pageParam, limit: PAGE_SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page * last.pageSize < last.total ? last.page + 1 : undefined,
    placeholderData: keepPreviousData,
  })
  const pages = q.data?.pages
  return {
    ...q,
    items: pages?.flatMap((p) => p.items) ?? [],
    total: pages?.[0]?.total ?? 0,
    facets: pages?.[0]?.facets,
  }
}

export const useFeaturedProducts = (limit = 5) =>
  useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: ({ signal }) => getProducts({ sort: 'featured', limit }, signal),
  })

/** Satu produk berdasarkan slug. `enabled` false bila slug kosong. */
export const useProduct = (slug) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: ({ signal }) => getProduct(slug, signal),
    enabled: Boolean(slug),
  })
