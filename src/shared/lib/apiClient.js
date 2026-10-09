import { env } from '@/config/env'

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const toQuery = (params) => {
  const sp = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v))
  })
  const s = sp.toString()
  return s ? `?${s}` : ''
}

/**
 * Wrapper fetch tunggal untuk seluruh API.
 * @param {string} path  contoh: '/products'
 * @param {{ method?: string, params?: object, body?: unknown, signal?: AbortSignal }} [opts]
 */
export async function request(path, { method = 'GET', params, body, signal } = {}) {
  const res = await fetch(`${env.apiUrl}${path}${toQuery(params)}`, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok)
    throw new ApiError(data?.message ?? `Permintaan gagal (${res.status})`, {
      status: res.status,
      data,
    })
  return data
}

/**
 * Validasi respons dengan skema zod. Bila tidak sesuai kontrak, lempar ApiError dengan pesan ramah
 * (detail teknis hanya ke console), bukan membocorkan isi error zod ke pengguna.
 */
export function parseResponse(schema, data) {
  const result = schema.safeParse(data)
  if (result.success) return result.data
  console.error('[API] Respons tidak sesuai kontrak:', result.error.issues, data)
  throw new ApiError('Data dari server tidak sesuai format yang diharapkan.', {
    status: 0,
    data: result.error.issues,
  })
}
