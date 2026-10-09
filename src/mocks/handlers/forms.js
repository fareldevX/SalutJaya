import { delay, http, HttpResponse } from 'msw'

const ref = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`

export const formHandlers = [
  http.post('*/api/v1/bookings', async () => {
    await delay(700)
    return HttpResponse.json({ id: ref('BK'), status: 'received' }, { status: 201 })
  }),
  http.post('*/api/v1/quotes', async () => {
    await delay(700)
    return HttpResponse.json({ id: ref('QT'), status: 'received' }, { status: 201 })
  }),
]
