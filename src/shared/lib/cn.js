import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Gabungkan class Tailwind dan selesaikan konflik (px-4 + px-6 => px-6). */
export const cn = (...inputs) => twMerge(clsx(inputs))
