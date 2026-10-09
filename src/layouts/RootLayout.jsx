import { Outlet } from 'react-router-dom'
import BookingDrawer from '@/features/consulting/components/BookingDrawer'
import GrainOverlay from '@/shared/ambient/GrainOverlay'
import CursorFollower from '@/shared/motion/components/CursorFollower'
import PageTransition from '@/shared/motion/components/PageTransition'
import CartDrawer from '@/features/cart/components/CartDrawer'
import AmbientBackground from './components/AmbientBackground'
import FloatingNav from './components/FloatingNav'
import ScrollManager from './components/ScrollManager'
import Footer from './components/Footer'

export default function RootLayout() {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-bold focus:text-white"
      >
        Lewati ke konten utama
      </a>
      <ScrollManager />
      <div className="relative isolate overflow-x-clip">
        <AmbientBackground />
        <FloatingNav />
        <main id="konten" className="min-h-[100svh]">
          <Outlet />
        </main>
        <Footer />
      </div>
      <BookingDrawer />
      <CartDrawer />
      <PageTransition />
      <CursorFollower />
      <GrainOverlay />
    </>
  )
}
