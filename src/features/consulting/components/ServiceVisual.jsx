// Tiga ilustrasi SVG. Elemen [data-draw] digambar lewat strokeDashoffset, [data-node] muncul dengan scale,
// [data-led] berkedip. Bawaan markup = sudah tergambar penuh (aman untuk reduced-motion dan tanpa JS).
const draw = { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 0, 'data-draw': true }
const line = 'fill-none stroke-ink/55'

function Topology() {
  const dist = [
    [200, 85],
    [315, 200],
    [200, 315],
    [85, 200],
  ]
  const leaves = [
    [150, 40],
    [250, 40],
    [360, 150],
    [360, 250],
    [250, 360],
    [150, 360],
    [40, 250],
    [40, 150],
  ]
  return (
    <>
      <path
        {...draw}
        d="M200 85 Q315 85 315 200 Q315 315 200 315 Q85 315 85 200 Q85 85 200 85"
        className="fill-none stroke-emerald-500/50"
        strokeDasharray="1"
        strokeWidth="1.5"
      />
      {dist.map(([x, y]) => (
        <path
          key={`c${x}${y}`}
          {...draw}
          d={`M200 200 L${x} ${y}`}
          className={line}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      {leaves.map(([x, y], i) => (
        <path
          key={`l${i}`}
          {...draw}
          d={`M${dist[Math.floor(i / 2)][0]} ${dist[Math.floor(i / 2)][1]} L${x} ${y}`}
          className={line}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
      {leaves.map(([x, y], i) => (
        <circle
          key={`n${i}`}
          data-node
          cx={x}
          cy={y}
          r="7"
          className="fill-white stroke-ink/55"
          strokeWidth="2"
        />
      ))}
      {dist.map(([x, y]) => (
        <circle
          key={`d${x}${y}`}
          data-node
          cx={x}
          cy={y}
          r="13"
          className="fill-white stroke-emerald-600"
          strokeWidth="2.5"
        />
      ))}
      <circle data-node data-pulse cx="200" cy="200" r="30" className="fill-emerald-500/15" />
      <circle data-node cx="200" cy="200" r="20" className="fill-emerald-500" />
    </>
  )
}

function RackMonitor() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            {...draw}
            x="70"
            y={50 + i * 62}
            width="260"
            height="48"
            rx="8"
            className="fill-white/80 stroke-ink/55"
            strokeWidth="2"
          />
          {[0, 1, 2, 3].map((j) => (
            <rect
              key={j}
              x={88 + j * 22}
              y={62 + i * 62}
              width="16"
              height="24"
              rx="3"
              className="fill-ink/[0.08]"
            />
          ))}
          <circle
            data-node
            data-led
            cx="300"
            cy={74 + i * 62}
            r="4"
            className={i % 2 ? 'fill-sky-400' : 'fill-emerald-500'}
          />
          <circle data-node cx="284" cy={74 + i * 62} r="4" className="fill-ink/20" />
        </g>
      ))}
      <path
        {...draw}
        d="M30 345 H110 L128 312 L152 375 L174 330 L190 345 H370"
        className="fill-none stroke-emerald-600"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  )
}

function Shield() {
  return (
    <>
      <circle data-node cx="200" cy="205" r="170" className="fill-emerald-500/[0.07]" />
      <circle
        cx="200"
        cy="205"
        r="170"
        data-spin
        pathLength="1"
        strokeDasharray="0.18 0.82"
        className="fill-none stroke-sky-400"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        {...draw}
        d="M200 55 L320 100 V205 C320 275 270 325 200 355 C130 325 80 275 80 205 V100 Z"
        className="fill-white/80 stroke-ink/60"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        {...draw}
        d="M200 95 L285 127 V205 C285 255 250 292 200 316 C150 292 115 255 115 205 V127 Z"
        className="fill-none stroke-emerald-500/60"
        strokeWidth="1.5"
      />
      <path
        {...draw}
        d="M150 210 L188 248 L255 168"
        className="fill-none stroke-emerald-600"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  )
}

const visuals = { network: Topology, server: RackMonitor, security: Shield }

export default function ServiceVisual({ id, label }) {
  const Visual = visuals[id]
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={label}
      className="h-auto w-full overflow-visible"
    >
      <Visual />
    </svg>
  )
}
