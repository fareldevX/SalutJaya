import { parseResponse, request } from '@/shared/lib/apiClient'
import { bookingResponseSchema } from '../schemas/booking.schema'

/** Jadwal konsultasi -> /bookings, permintaan penawaran -> /quotes. */
export async function createBooking(values) {
  const path = values.kind === 'quote' ? '/quotes' : '/bookings'
  return parseResponse(bookingResponseSchema, await request(path, { method: 'POST', body: values }))
}
