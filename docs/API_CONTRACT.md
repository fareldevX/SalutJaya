# Kontrak API SalutJaya (untuk backend Go)

Frontend memanggil `${VITE_API_URL}` (bawaan `/api/v1`) dan **memvalidasi setiap respons dengan zod saat runtime**
(`features/*/schemas`, `features/*/api`). Respons yang menyimpang dari kontrak ini akan memunculkan error jelas di console.
Implementasi acuan perilaku (mock) ada di `src/mocks/handlers/*` dan diuji di `*.test.js`.

Semua body/respons JSON, UTF-8. Mata uang IDR, bilangan bulat (tanpa desimal). Harga **sebelum PPN**.
Error: `{ "message": "teks untuk pengguna" }` dengan status HTTP yang sesuai.

## GET /products
Query (semua opsional): `cat` (server|switch|router), `brand`, `ff` (form factor), `q` (cari di nama + specSummary, case-insensitive),
`min`, `max` (harga), `sort` (featured|price_asc|price_desc|name; bawaan featured), `page` (mulai 1), `limit` (bawaan 12, maks 48).

```json
{
  "items": [{
    "id": "p-001", "slug": "dell-poweredge-r760", "name": "Dell PowerEdge R760", "brand": "Dell",
    "category": "server", "price": 189000000, "stock": 6, "featured": true, "image": null,
    "specSummary": ["2× Xeon Gold 5416S", "128 GB DDR5", "2× 10GbE"],
    "specs": { "Prosesor": "2× Xeon Gold 5416S", "Form factor": "1U rack", "Garansi": "3 tahun on-site" }
  }],
  "total": 28, "page": 1, "pageSize": 12,
  "facets": {
    "categories": { "server": 10, "switch": 10, "router": 8 },
    "brands": { "Dell": 4 },
    "formFactors": { "1U rack": 20 },
    "price": { "min": 2650000, "max": 612000000 }
  }
}
```
- `specs` bebas kunci/nilai (string|number): cocok dengan dokumen MongoDB. `specSummary` = 3 spesifikasi inti untuk chip.
- `facets` dihitung dari **seluruh katalog** (bukan hasil filter) agar pilihan filter stabil.
- `image`: URL atau `null` (frontend memakai ilustrasi SVG per kategori bila null).

## GET /products/:slug
Satu produk (objek yang sama dengan item di atas). `404 { message }` bila tidak ada.

## GET /stock?ids=p-001,p-002
`{ "p-001": 6, "p-002": 0 }`. Dipolling tiap 15 dtk saat keranjang/checkout terbuka. Id tak dikenal boleh dihilangkan.

## POST /bookings  |  POST /quotes
Dari form konsultasi (`features/consulting/schemas/booking.schema.js`). `bookings` bila `kind=consultation`, `quotes` bila `kind=quote`.
```json
{ "service": "network|server|security|hardware", "needs": "10-1000 karakter",
  "kind": "consultation|quote", "date": "YYYY-MM-DD (hanya consultation, mulai besok)", "slot": "pagi|siang (hanya consultation)",
  "company": "...", "name": "...", "email": "...", "phone": "..." }
```
Respons `201 { "id": "BK-XXXX", "status": "received" }`. Validasi ulang di server (jangan percaya klien).

## POST /orders
```json
{
  "customer": { "company": "...", "npwp": "15-16 digit (opsional)", "name": "...", "email": "...", "phone": "..." },
  "shipping": { "address": "...", "city": "...", "postalCode": "12345" },
  "payment": "transfer|invoice",
  "note": "opsional",
  "lines": [{ "productId": "p-001", "qty": 2, "mode": "buy|quote" }]
}
```
`shipping` dan `payment` hanya ada bila ada baris `mode=buy`.

**Server WAJIB:**
1. Menghitung ulang harga dari katalog (abaikan harga apa pun dari klien; klien memang tidak mengirim harga).
2. Memeriksa stok untuk baris `buy` secara atomik saat membuat pesanan.
3. Bila stok tidak cukup: `409 { "message": "Stok sebagian produk berubah.", "conflicts": [{ "productId": "p-001", "available": 2 }] }`.
   Frontend menyesuaikan keranjang dari `available` dan meminta pengguna meninjau ulang.
4. Sukses `201`:
```json
{ "orderId": "ORD-XXXX | null", "quoteId": "QT-XXXX | null", "totals": { "subtotal": 206800000 } }
```
`orderId` null bila tidak ada baris `buy`; `quoteId` null bila tidak ada baris `quote`. `subtotal` hanya dari baris `buy`.

## Catatan integrasi
- CORS: saat pengembangan, set `VITE_USE_MOCKS=false` dan `VITE_PROXY_TARGET=http://localhost:8080` agar Vite meneruskan `/api` (tanpa CORS).
  Di produksi, layani frontend dan API dari origin yang sama atau aktifkan CORS untuk domain frontend.
- Autentikasi belum ada di lingkup ini. `src/shared/lib/apiClient.js` adalah satu-satunya tempat menambah header (mis. token).
- Rate limit / anti-spam untuk `/bookings`, `/quotes`, `/orders` perlu di server (mis. captcha atau throttling per IP).
- Data pribadi (email, telepon, NPWP) hanya dikirim ke API; analytics (`shared/lib/analytics.js`) tidak memuat data pribadi.
