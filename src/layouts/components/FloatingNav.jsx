import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { site } from '@/config/site'
import { track } from '@/shared/lib/analytics'
import { cartTotals, useCartStore } from '@/shared/store/cart.store'
import { useUiStore } from '@/shared/store/ui.store'
import { Button, Drawer, Logo } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import CartButton from './CartButton'

const linkCls =
  'rounded-full px-4 py-2 font-display text-sm font-semibold text-ink-soft transition-colors hover:text-ink'

/** Pill nav: transparan di atas halaman, berubah jadi kaca buram setelah scroll 80px. */
export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  // Nav tampil lagi saat isi keranjang berubah, agar pengguna selalu melihat konfirmasinya
  const cartCount = useCartStore((s) => cartTotals(s.lines).count)
  const [seenCount, setSeenCount] = useState(cartCount)
  if (cartCount !== seenCount) {
    setSeenCount(cartCount)
    setHidden(false)
  }
  const openBooking = useUiStore((s) => s.openBooking)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)
      // Sembunyi saat scroll turun (setelah 400px), muncul lagi saat scroll naik
      setHidden(y > lastY.current && y > 400)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 px-[var(--gutter)] pt-4 transition-transform duration-500 ease-out-expo focus-within:translate-y-0',
        hidden && !menuOpen && '-translate-y-full'
      )}
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <nav
        aria-label="Navigasi utama"
        className={cn(
          'mx-auto flex h-14 max-w-[96rem] items-center justify-between rounded-full border transition-[background-color,border-color,box-shadow,backdrop-filter,padding] duration-500 ease-out-expo',
          scrolled
            ? 'border-ink/10 bg-white/75 pl-4 pr-2 shadow-[0_8px_30px_-12px_rgb(15_23_42/0.18)] backdrop-blur-xl'
            : 'border-transparent bg-transparent px-0'
        )}
      >
        <Link to="/" aria-label="SalutJaya, ke beranda">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) =>
            item.to.includes('#') ? (
              <Link key={item.label} to={item.to} className={linkCls}>
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => cn(linkCls, isActive && 'text-ink')}
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => {
              track('cta_click', { id: 'nav_consult' })
              openBooking()
            }}
          >
            Konsultasi sekarang
          </Button>
          <CartButton />
          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="grid size-10 place-items-center rounded-full hover:bg-ink/5 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </nav>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <ul className="flex flex-col gap-1">
          {site.nav.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-panel px-3 py-4 font-display text-3xl font-extrabold tracking-tight hover:bg-ink/5"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button
          to="/#konsultasi"
          size="lg"
          className="mt-8 w-full"
          onClick={() => setMenuOpen(false)}
        >
          Konsultasi sekarang
        </Button>
      </Drawer>
    </header>
  )
}
