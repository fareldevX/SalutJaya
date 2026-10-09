import { expect, test } from '@playwright/test'

test('booking: validasi per langkah lalu terkirim (jalur penawaran)', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('banner').getByRole('button', { name: 'Konsultasi sekarang' }).click()
  const dialog = page.getByRole('dialog')

  await dialog.getByRole('button', { name: 'Lanjut' }).click()
  await expect(dialog.getByText('Pilih salah satu layanan.')).toBeVisible()

  await dialog.getByText('Pengadaan hardware').click()
  await dialog.getByLabel('Ceritakan kebutuhan Anda').fill('Butuh penawaran 4 switch 48 port PoE')
  await dialog.getByRole('button', { name: 'Lanjut' }).click()

  await expect(dialog.getByText('Langkah 2 dari 3')).toBeVisible()
  await dialog.getByText('Minta penawaran').first().click()
  await dialog.getByRole('button', { name: 'Lanjut' }).click()

  await expect(dialog.getByRole('heading', { name: /menghubungi Anda/ })).toBeVisible()
  await dialog.getByLabel('Perusahaan').fill('PT Contoh')
  await dialog.getByLabel('Nama Anda').fill('Budi')
  await dialog.getByLabel('Email kerja').fill('budi@contoh.co.id')
  await dialog.getByLabel(/Telepon/).fill('0812 3456 7890')
  await dialog.getByRole('button', { name: 'Kirim' }).click()

  await expect(dialog.getByText(/Nomor referensi: QT-/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Selesai' }).click()
  await expect(dialog).toBeHidden()
})

test('aksesibilitas dasar: skip link pertama, landmark utama, dan Esc menutup drawer', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('main').waitFor() // render awal menunggu font + mock siap
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Lewati ke konten utama' })).toBeFocused()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Navigasi utama' })).toBeVisible()

  await page.getByRole('button', { name: /Buka keranjang/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})
