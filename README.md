# SalutJaya Web (Fase 1-4 selesai)

React 19 + Vite (JavaScript), Tailwind CSS 3, Framer Motion, GSAP + Lenis (terpasang, dipakai mulai Fase 2),
TanStack Query, Zustand, React Hook Form + zod, MSW.

## Menjalankan
```bash
npm install
npm run dev        # http://localhost:5173  (mock API aktif lewat .env.development)
npm run lint       # ESLint + aturan batas folder
npm test           # Vitest (store, skema, hook, kontrak mock API)
npm run e2e        # Playwright (katalog→keranjang→checkout, booking, stok, aksesibilitas)
npm run build
```
Halaman internal design system: `/playground` (hanya mode dev).

## Aturan arsitektur
- `features/*` hanya boleh mengimpor dari `shared` dan `config`, atau dari fitur yang sama. Dijaga `eslint-plugin-boundaries`.
- `shared` tidak boleh mengimpor dari `features` atau `layouts`.
- Alias `@/` = `src/`. Tanpa TypeScript: kontrak data = skema zod (`features/*/schemas`) + JSDoc.
- Warna dan skala tipografi hanya didefinisikan di `src/styles/tokens.css`; Tailwind membacanya dari sana.

## Mock API (MSW) → backend Go
Endpoint tiruan ada di `src/mocks/handlers`. Saat Go siap: set `VITE_API_URL` ke server asli dan
`VITE_USE_MOCKS=false`. Kode MSW otomatis terbuang dari bundle produksi.

## Sistem animasi (`src/shared/motion`)
- Impor GSAP hanya dari `shared/motion/gsap.js` (plugin didaftarkan sekali). Token durasi/easing di `tokens.js`.
- `SmoothScrollProvider`: Lenis + ticker GSAP + ScrollTrigger. Mati otomatis bila `prefers-reduced-motion`.
- Semua animasi scroll dibungkus `gsap.matchMedia()` dengan `NO_REDUCE`; pengguna reduced-motion melihat halaman statis penuh.
- Atmosfer global ada di `layouts/components/AmbientBackground` (gradien panjang, orb, canvas node). Section tidak boleh punya background sendiri.

## Fitur Fase 3
- `features/consulting`: `ServiceStage` (chapter ter-pin di desktop, bertumpuk di mobile/reduced-motion), `BookingDrawer` (form 3 langkah, zod per langkah, dimuat lazy).
- `features/marketplace`: `BentoGrid` (tata letak per grup 7 sel, tanpa lubang), filter berbasis URL (`/katalog?cat=router&q=...&p=slug`), paginasi tak terbatas, quick view (`?p=slug`), `CompareTray`, halaman `/katalog/:slug`.
- Pemicu lintas fitur (mis. membuka booking dari hero, nav, atau tile) lewat `shared/store/ui.store.js`. Komposisi lintas fitur dilakukan di `app/HomePage.jsx`.

## Fase 4
- Keranjang (`shared/store/cart.store.js`, persist): tiap item bisa **beli langsung** atau **minta penawaran**. Berada di `shared` karena dipakai lintas fitur; UI-nya di `features/cart`.
- Checkout `/checkout` (layout minimal), stok disinkronkan tiap 15 dtk (`useStockSync`), konflik stok (409) ditangani.
- Polesan: nav sembunyi saat scroll turun, wipe antar halaman, gelembung kursor "Lihat" di tile, badge keranjang berputar.
- SEO/aksesibilitas: judul+deskripsi per halaman, JSON-LD (Organization, Product), OG image, `robots.txt`, live region pengumuman rute, skip link.
- Analitik: `shared/lib/analytics.js` mendorong event ke `window.dataLayer` (cta_click, add_to_cart, checkout_start, booking_submit, order_submit).
- **Integrasi Go:** baca `docs/API_CONTRACT.md`. Cukup set `VITE_USE_MOCKS=false` dan `VITE_API_URL` / `VITE_PROXY_TARGET`.

## Yang masih placeholder (sengaja)
- Foto produk: `ProductArt` (SVG per kategori) menggantikan foto sampai foto asli ada (`image` di data).
- Naskah layanan (`features/consulting/data/services.js`) perlu ditinjau tim SalutJaya.
- Metode pembayaran (transfer/invoice) belum tersambung gateway; instruksi pembayaran dikirim manual oleh tim. PPN/ongkir dihitung pada invoice.
- `index.html`: `og:image` perlu URL absolut domain produksi. Sitemap belum dibuat (butuh domain final).
- `features/landing/data/content.js`: teks status hero (24/7) adalah klaim bisnis, pastikan benar sebelum rilis.
- `src/config/site.js`: email, telepon, alamat adalah data contoh. Ganti dengan data resmi.
- `src/mocks/data/products.json`: 28 produk contoh dengan harga fiktif. `image` masih `null`.
