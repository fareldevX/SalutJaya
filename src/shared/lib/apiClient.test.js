import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ApiError, parseResponse } from './apiClient'

describe('parseResponse', () => {
  const schema = z.object({ id: z.string() })
  it('mengembalikan data yang valid', () => {
    expect(parseResponse(schema, { id: 'x' })).toEqual({ id: 'x' })
  })
  it('melempar ApiError ramah (tanpa membocorkan detail zod) bila respons menyimpang', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      parseResponse(schema, '<html>bukan json</html>')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      expect(e.message).toBe('Data dari server tidak sesuai format yang diharapkan.')
      expect(e.message).not.toMatch(/expected|invalid_type/)
    }
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
