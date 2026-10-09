import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/inter'
import './styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'

async function enableMocking() {
  // Dibaca langsung dari import.meta.env agar MSW terbuang dari bundle produksi
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
}

// Tahan render pertama sampai font siap (maks 1,2 dtk) agar tidak ada pergeseran layout saat font berganti.
const fontsReady = Promise.race([
  Promise.all([
    document.fonts.load('800 1em "Plus Jakarta Sans Variable"'),
    document.fonts.load('400 1em "Inter Variable"'),
  ]),
  new Promise((r) => setTimeout(r, 1200)),
]).catch(() => {})

Promise.all([enableMocking(), fontsReady]).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
