import { useEffect } from 'react'

const DEFAULT_TITLE = 'SalutJaya | Konsultasi IT dan Hardware Infrastruktur'
const DEFAULT_DESC =
  'Konsultasi IT dan marketplace perangkat keras (server, switch, router) untuk perusahaan.'

const setMeta = (name, content, attr = 'name') => {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Judul dan deskripsi per halaman (tanpa library tambahan). Tanpa argumen = nilai bawaan situs. */
export function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const t = title ? `${title} | SalutJaya` : DEFAULT_TITLE
    const d = description ?? DEFAULT_DESC
    document.title = t
    setMeta('description', d)
    setMeta('og:title', t, 'property')
    setMeta('og:description', d, 'property')
  }, [title, description])
}
