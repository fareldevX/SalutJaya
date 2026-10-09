import { Button } from '@/shared/ui'

export default function NotFoundPage() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-start justify-center gap-8">
      <h1 className="text-h1">Halaman tidak ditemukan.</h1>
      <p className="max-w-md text-lead text-ink-soft">
        Alamat yang Anda buka tidak ada atau sudah dipindahkan.
      </p>
      <Button to="/">Kembali ke beranda</Button>
    </section>
  )
}
