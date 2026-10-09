const UNIT_H = 40
const GAP = 6
const TOP = 30

// Susunan rak dari atas ke bawah
const UNITS = [
  'switch',
  'server',
  'server',
  'blank',
  'switch',
  'server',
  'server',
  'server',
  'blank',
]

function Unit({ kind, y, seed }) {
  const face = (
    <rect x="26" y={y} width="248" height={UNIT_H} rx="6" className="fill-white stroke-ink/15" />
  )
  if (kind === 'blank')
    return (
      <g>
        {face}
        <rect x="40" y={y + 18} width="220" height="3" rx="1.5" className="fill-ink/[0.07]" />
      </g>
    )
  if (kind === 'switch')
    return (
      <g>
        {face}
        {Array.from({ length: 16 }, (_, i) => (
          <g key={i}>
            <rect
              x={40 + i * 13}
              y={y + 20}
              width="9"
              height="9"
              rx="1.5"
              className="fill-ink/15"
            />
            {(i + seed) % 3 !== 0 && (
              <circle
                data-led
                cx={44.5 + i * 13}
                cy={y + 13}
                r="1.6"
                className="fill-emerald-500"
              />
            )}
          </g>
        ))}
      </g>
    )
  return (
    <g>
      {face}
      {Array.from({ length: 4 }, (_, i) => (
        <rect
          key={i}
          x={40 + i * 22}
          y={y + 9}
          width="18"
          height="22"
          rx="3"
          className="fill-ink/[0.07]"
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={140 + i * 6}
          y={y + 12}
          width="2"
          height="16"
          rx="1"
          className="fill-ink/[0.12]"
        />
      ))}
      <circle data-led cx="252" cy={y + 14} r="2.2" className="fill-emerald-500" />
      <circle data-led cx="262" cy={y + 14} r="2.2" className="fill-sky-400" />
      <circle cx="252" cy={y + 26} r="2.2" className="fill-ink/15" />
    </g>
  )
}

/** Rak server abstrak (SVG) bergaya terang, dengan LED yang berkedip dan kabel yang keluar dari bingkai. */
export default function RackVisual() {
  return (
    <svg
      viewBox="0 0 300 480"
      role="img"
      aria-label="Ilustrasi rak server dan switch jaringan"
      className="h-auto w-full"
    >
      <rect x="10" y="10" width="280" height="460" rx="20" className="fill-mist stroke-ink/15" />
      {UNITS.map((kind, i) => (
        <Unit key={i} kind={kind} y={TOP + i * (UNIT_H + GAP)} seed={i} />
      ))}
      <g fill="none" strokeLinecap="round" className="stroke-emerald-500/50" strokeWidth="1.5">
        <path d="M274 70 C 310 70, 300 130, 340 130" />
        <path d="M274 256 C 320 256, 296 330, 345 330" />
      </g>
    </svg>
  )
}
