import { expect, test } from '@playwright/test'

const addFromTile = async (page, index) => {
  const tile = page.locator('[data-tile]').nth(index)
  await tile.hover()
  await tile.locator('button[aria-label^="Tambah"]').click({ force: true })
}

test('katalog -> keranjang -> checkout (campuran beli langsung dan penawaran)', async ({
  page,
}) => {
  await page.goto('/katalog')
  await page.locator('[data-tile]').first().waitFor()
  await page.getByRole('button', { name: /^Switch/ }).click()
  await expect(page).toHaveURL(/cat=switch/)

  await addFromTile(page, 0)
  await addFromTile(page, 1)
  await expect(page.getByRole('button', { name: 'Buka keranjang, 2 item' })).toBeVisible()

  await page.getByRole('button', { name: /Buka keranjang/ }).click()
  const drawer = page.getByRole('dialog')
  await expect(drawer.getByRole('heading', { name: /Keranjang \(2\)/ })).toBeVisible()
  // satu item dialihkan ke mode penawaran
  await drawer.getByRole('radio', { name: 'Minta penawaran' }).first().click()
  await expect(drawer.getByText('Minta penawaran', { exact: false }).first()).toBeVisible()
  await drawer.getByRole('button', { name: 'Lanjut ke checkout' }).click()

  await expect(page).toHaveURL(/\/checkout/)
  // submit kosong menampilkan error validasi
  await page.getByRole('button', { name: 'Kirim pesanan' }).click()
  await expect(page.getByText('Nama perusahaan wajib diisi.')).toBeVisible()
  await expect(page.getByText('Pilih metode pembayaran.')).toBeVisible()

  await page.getByLabel('Nama perusahaan').fill('PT Contoh Sejahtera')
  await page.getByLabel('Penanggung jawab').fill('Budi Santoso')
  await page.getByLabel('Email kerja').fill('budi@contoh.co.id')
  await page.getByLabel(/Telepon/).fill('0812 3456 7890')
  await page.getByLabel('Alamat lengkap').fill('Jl. Contoh Raya No. 12, Jakarta Selatan')
  await page.getByLabel('Kota').fill('Jakarta')
  await page.getByLabel('Kode pos').fill('12345')
  await page.getByText('Transfer bank').click()
  await page.getByRole('button', { name: 'Kirim pesanan' }).click()

  await expect(page.getByRole('heading', { name: 'Pesanan diterima.' })).toBeVisible()
  await expect(page.getByText(/Nomor pesanan:/)).toBeVisible()
  await expect(page.getByText(/Nomor penawaran:/)).toBeVisible()
  // keranjang dikosongkan setelah berhasil
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('salutjaya-cart')).state.lines.length)
  ).toBe(0)
})

test('sinkron stok: qty di keranjang dikoreksi dan pengguna diberi tahu', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'salutjaya-cart',
      JSON.stringify({
        version: 1,
        state: {
          lines: [
            {
              productId: 'p-001',
              slug: 'dell-poweredge-r760',
              name: 'Dell PowerEdge R760',
              category: 'server',
              specSummary: ['2× Xeon Gold 5416S'],
              price: 189000000,
              stock: 99,
              qty: 50,
              mode: 'buy',
            },
          ],
        },
      })
    )
  })
  await page.goto('/checkout')
  await expect(page.getByText('Stok berubah, keranjang disesuaikan:')).toBeVisible()
  await expect(page.getByText(/jumlah dikurangi menjadi 6 unit/)).toBeVisible()
  await expect(
    page.getByRole('group', { name: /Jumlah Dell PowerEdge R760/ }).locator('output')
  ).toHaveText('6')
})

test('checkout kosong menampilkan ajakan ke katalog', async ({ page }) => {
  await page.goto('/checkout')
  await expect(page.getByRole('heading', { name: 'Keranjang kosong.' })).toBeVisible()
})
