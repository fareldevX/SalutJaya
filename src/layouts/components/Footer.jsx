import { Link } from 'react-router-dom'
import { site } from '@/config/site'
import { Logo } from '@/shared/ui'

export default function Footer() {
  return (
    <footer id="kontak" className="mt-8 px-[var(--gutter)] pb-10 pt-24">
      <div className="mx-auto grid max-w-[96rem] gap-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-ink-soft">{site.tagline}</p>
        </div>
        <div>
          <h2 className="font-display text-base font-bold">Jelajahi</h2>
          <ul className="mt-4 space-y-2 text-ink-soft">
            {site.nav.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-base font-bold">Hubungi kami</h2>
          <ul className="mt-4 space-y-2 text-ink-soft">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-ink">
                {site.email}
              </a>
            </li>
            <li>{site.phone}</li>
            <li>{site.address}</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-20 max-w-[96rem] text-sm text-ink-soft">
        © {new Date().getFullYear()} {site.name}. Seluruh hak cipta dilindungi.
      </p>
    </footer>
  )
}
