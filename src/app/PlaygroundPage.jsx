import { useState } from 'react'
import { Badge, Button, Drawer, Input, Skeleton } from '@/shared/ui'

const swatches = [
  ['snow', 'bg-snow border border-ink/10'],
  ['ink', 'bg-ink'],
  ['emerald-500', 'bg-emerald-500'],
  ['emerald-600', 'bg-emerald-600'],
  ['emerald-700', 'bg-emerald-700'],
  ['sky-400', 'bg-sky-400'],
  ['teal-500', 'bg-teal-500'],
]

const Block = ({ title, children }) => (
  <section className="border-t border-ink/10 py-12">
    <h2 className="mb-8 font-display text-sm font-bold text-ink-soft">{title}</h2>
    {children}
  </section>
)

/** Halaman kerja internal (hanya mode dev) untuk memeriksa design system. Rute: /playground */
export default function PlaygroundPage() {
  const [open, setOpen] = useState(false)
  return (
    <div className="container-x pt-32">
      <h1 className="mb-16 text-h2">Design system.</h1>

      <Block title="Skala tipografi">
        <p className="text-mega">Mega</p>
        <p className="mt-6 text-h1">Heading 1</p>
        <p className="mt-6 text-h2">Heading 2</p>
        <p className="mt-6 text-h3">Heading 3</p>
        <p className="mt-6 max-w-xl text-lead text-ink-soft">
          Lead: ringkasan satu atau dua kalimat di bawah judul besar.
        </p>
        <p className="mt-4 max-w-xl text-body">
          Body: teks paragraf 16–18px dengan line-height renggang agar nyaman dibaca dan tidak
          padat.
        </p>
      </Block>

      <Block title="Warna">
        <ul className="flex flex-wrap gap-4">
          {swatches.map(([name, cls]) => (
            <li key={name} className="text-sm">
              <div className={`size-20 rounded-panel ${cls}`} />
              <p className="mt-2 font-medium">{name}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Tombol">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg">Konsultasi sekarang</Button>
          <Button size="lg" variant="ghost">
            Lihat katalog hardware
          </Button>
          <Button variant="dark">Minta penawaran</Button>
          <Button variant="quiet">Batal</Button>
          <Button disabled>Nonaktif</Button>
          <Button size="sm">Kecil</Button>
        </div>
      </Block>

      <Block title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Stok tersedia</Badge>
          <Badge tone="slate">Server</Badge>
          <Badge tone="sky">Baru</Badge>
          <Badge tone="dark">Unggulan</Badge>
        </div>
      </Block>

      <Block title="Form">
        <div className="grid max-w-xl gap-5">
          <Input label="Nama perusahaan" placeholder="PT Contoh Sejahtera" />
          <Input label="Email kerja" type="email" hint="Penawaran dikirim ke alamat ini." />
          <Input label="Nomor telepon" error="Nomor telepon wajib diisi." />
          <Input label="Kebutuhan Anda" multiline />
        </div>
      </Block>

      <Block title="Drawer dan skeleton">
        <Button variant="dark" onClick={() => setOpen(true)}>
          Buka drawer
        </Button>
        <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 rounded-tile" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
        <Drawer open={open} onClose={() => setOpen(false)} title="Contoh drawer">
          <p className="text-ink-soft">
            Esc, klik latar, atau tombol tutup menutup panel ini. Fokus terkunci di dalam.
          </p>
          <div className="mt-6 grid gap-4">
            <Input label="Email" type="email" />
            <Button onClick={() => setOpen(false)}>Simpan</Button>
          </div>
        </Drawer>
      </Block>
    </div>
  )
}
