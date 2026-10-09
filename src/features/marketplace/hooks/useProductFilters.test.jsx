import { act, renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useProductFilters } from './useProductFilters'

const wrap = (initial) => {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>
  )
  return Wrapper
}

describe('useProductFilters (URL = sumber kebenaran)', () => {
  it('membaca filter dari URL dan menghitung filter aktif (sort tidak dihitung)', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: wrap('/katalog?cat=router&q=cisco&sort=name'),
    })
    expect(result.current.filters).toMatchObject({
      cat: 'router',
      q: 'cisco',
      sort: 'name',
      brand: '',
    })
    expect(result.current.activeCount).toBe(2)
  })
  it('set / reset memperbarui URL tanpa menghapus param lain (mis. ?p=)', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: wrap('/katalog?p=dell-poweredge-r760'),
    })
    act(() => result.current.set('cat', 'server'))
    expect(result.current.filters.cat).toBe('server')
    act(() => result.current.reset())
    expect(result.current.filters.cat).toBe('')
    expect(result.current.activeCount).toBe(0)
  })
})
