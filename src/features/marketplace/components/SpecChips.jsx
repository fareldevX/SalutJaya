export default function SpecChips({ items, limit }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.slice(0, limit).map((s) => (
        <li
          key={s}
          className="rounded-chip bg-ink/[0.05] px-2.5 py-1 font-mono text-[0.72rem] text-ink-soft"
        >
          {s}
        </li>
      ))}
    </ul>
  )
}
