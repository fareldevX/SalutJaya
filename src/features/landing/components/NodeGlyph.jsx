/** Tiga node terhubung (motif jaringan SalutJaya), dipakai sebagai pemisah teks. */
export default function NodeGlyph({ className = 'size-[0.5em]' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`${className} shrink-0`}>
      <path
        d="M6 24l10-16 10 16"
        fill="none"
        className="stroke-emerald-500"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [6, 24],
        [16, 8],
        [26, 24],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="3.4" className="fill-emerald-500" />
      ))}
    </svg>
  )
}
