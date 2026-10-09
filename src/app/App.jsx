import { RouterProvider } from 'react-router-dom'
import SmoothScrollProvider from '@/shared/motion/SmoothScrollProvider'
import QueryProvider from './providers/QueryProvider'
import { router } from './router'

export default function App() {
  return (
    <QueryProvider>
      <SmoothScrollProvider>
        <RouterProvider router={router} />
      </SmoothScrollProvider>
    </QueryProvider>
  )
}
