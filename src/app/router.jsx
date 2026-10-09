import { createBrowserRouter } from 'react-router-dom'
import CheckoutLayout from '@/layouts/CheckoutLayout'
import RootLayout from '@/layouts/RootLayout'

// Setiap halaman di-lazy-load: bundle awal tetap kecil.
const page = (loader) => async () => ({ Component: (await loader()).default })

export const router = createBrowserRouter([
  {
    element: <CheckoutLayout />,
    children: [
      { path: 'checkout', lazy: page(() => import('@/features/cart/pages/CheckoutPage')) },
    ],
  },
  {
    element: <RootLayout />,
    children: [
      { index: true, lazy: page(() => import('@/app/HomePage')) },
      { path: 'katalog', lazy: page(() => import('@/features/marketplace/pages/CatalogPage')) },
      {
        path: 'katalog/:slug',
        lazy: page(() => import('@/features/marketplace/pages/ProductDetailPage')),
      },
      ...(import.meta.env.DEV
        ? [{ path: 'playground', lazy: page(() => import('@/app/PlaygroundPage')) }]
        : []),
      { path: '*', lazy: page(() => import('@/app/NotFoundPage')) },
    ],
  },
])
