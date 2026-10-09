import { setupWorker } from 'msw/browser'
import { formHandlers } from './handlers/forms'
import { orderHandlers } from './handlers/orders'
import { productHandlers } from './handlers/products'

export const worker = setupWorker(...productHandlers, ...formHandlers, ...orderHandlers)
