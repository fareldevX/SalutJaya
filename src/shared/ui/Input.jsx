import { useId } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * Field form dengan label, hint, dan pesan error yang terhubung ke aria.
 * Kompatibel dengan react-hook-form: <Input {...register('email')} error={errors.email?.message} />
 */
export default function Input({ label, hint, error, multiline = false, className, ref, ...props }) {
  const id = useId()
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  const Field = multiline ? 'textarea' : 'input'

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={id} className="font-display text-sm font-bold">
          {label}
        </label>
      )}
      <Field
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        rows={multiline ? 4 : undefined}
        className={cn(
          'w-full rounded-panel border bg-white px-4 text-base text-ink placeholder:text-ink-soft/60',
          'transition-[border-color,box-shadow] duration-200',
          'focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20',
          multiline ? 'py-3' : 'h-12',
          error ? 'border-rose-600' : 'border-ink/15 hover:border-ink/30'
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-err`} className="text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-ink-soft">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
