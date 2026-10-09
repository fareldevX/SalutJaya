/**
 * Pelacakan event. Saat ini hanya mendorong ke `window.dataLayer` (siap dipakai GTM/GA4/Plausible);
 * ganti isi fungsi ini bila memakai penyedia lain. Tidak menyimpan data pribadi.
 * Event: cta_click, add_to_cart, booking_submit, checkout_start, order_submit.
 */
export function track(event, props = {}) {
  const payload = { event, ...props }
  ;(window.dataLayer ||= []).push(payload)
  if (import.meta.env.DEV) console.debug('[track]', payload)
}
