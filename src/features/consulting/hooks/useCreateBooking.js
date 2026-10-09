import { useMutation } from '@tanstack/react-query'
import { createBooking } from '../api/consulting.api'

export const useCreateBooking = () => useMutation({ mutationFn: createBooking })
