export default function QtyStepper({ value, onChange, max, label }) {
  const btn =
    'grid size-9 place-items-center rounded-full text-lg font-bold hover:bg-ink/10 disabled:opacity-30'
  return (
    <div
      role="group"
      aria-label={`Jumlah ${label}`}
      className="inline-flex items-center rounded-full border border-ink/15 bg-white"
    >
      <button
        type="button"
        className={btn}
        aria-label="Kurangi"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output aria-live="polite" className="min-w-8 text-center font-mono text-sm font-bold">
        {value}
      </output>
      <button
        type="button"
        className={btn}
        aria-label="Tambah"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}
