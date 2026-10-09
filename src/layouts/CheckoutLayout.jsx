import { Link, Outlet } from 'react-router-dom'
import { Logo } from '@/shared/ui'
import ScrollManager from './components/ScrollManager'

/** Layout minimal untuk checkout: tanpa efek sinematik dan tanpa navigasi yang mengalihkan perhatian. */
export default function CheckoutLayout() {
  return (
    <div className="min-h-svh bg-snow">
      <ScrollManager />
      <header className="container-x flex h-20 items-center justify-between">
        <Link to="/" aria-label="SalutJaya, ke beranda">
          <Logo />
        </Link>
        <Link
          to="/katalog"
          className="text-sm font-bold text-emerald-700 underline underline-offset-4"
        >
          Kembali ke katalog
        </Link>
      </header>
      <main id="konten" className="container-x pb-24 pt-6 outline-none" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
