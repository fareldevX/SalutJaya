/** Ilustrasi panel depan perangkat (pengganti foto produk sampai foto asli tersedia). Bayangan statis, tanpa filter. */
const Body = ({ h }) => (
  <rect
    x="6"
    y="6"
    width="328"
    height={h}
    rx="10"
    className="fill-white stroke-ink/20"
    strokeWidth="1.5"
  />
)

function Server() {
  return (
    <>
      <Body h="100" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={20 + i * 40}
          y="20"
          width="32"
          height="34"
          rx="4"
          className="fill-ink/[0.07]"
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={20 + i * 40}
          y="62"
          width="32"
          height="34"
          rx="4"
          className="fill-ink/[0.07]"
        />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <rect
          key={i}
          x={196 + i * 6}
          y="26"
          width="2"
          height="62"
          rx="1"
          className="fill-ink/[0.14]"
        />
      ))}
      <circle cx="302" cy="24" r="3" className="fill-emerald-500" />
      <circle cx="314" cy="24" r="3" className="fill-sky-400" />
    </>
  )
}
function Switch() {
  return (
    <>
      <Body h="62" />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <rect x={20 + i * 19} y="22" width="14" height="14" rx="2" className="fill-ink/[0.16]" />
          <rect x={20 + i * 19} y="42" width="14" height="14" rx="2" className="fill-ink/[0.16]" />
          <circle
            cx={27 + i * 19}
            cy="16"
            r="2"
            className={i % 3 ? 'fill-emerald-500' : 'fill-ink/20'}
          />
        </g>
      ))}
      <rect
        x="254"
        y="22"
        width="22"
        height="34"
        rx="3"
        className="fill-sky-400/30 stroke-sky-500/50"
      />
      <rect
        x="282"
        y="22"
        width="22"
        height="34"
        rx="3"
        className="fill-sky-400/30 stroke-sky-500/50"
      />
      <circle cx="320" cy="16" r="3" className="fill-emerald-500" />
    </>
  )
}
function Router() {
  return (
    <>
      <Body h="70" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={20 + i * 26}
          y="30"
          width="20"
          height="20"
          rx="3"
          className="fill-ink/[0.16]"
        />
      ))}
      <rect
        x="184"
        y="24"
        width="68"
        height="32"
        rx="5"
        className="fill-emerald-500/15 stroke-emerald-600/40"
      />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={270 + i * 16}
          cy="40"
          r="4"
          className={i === 1 ? 'fill-sky-400' : 'fill-emerald-500'}
        />
      ))}
      <path d="M20 66 H320" className="stroke-ink/10" />
    </>
  )
}
const art = { server: Server, switch: Switch, router: Router }
const heights = { server: 112, switch: 74, router: 82 }

export default function ProductArt({ category, className }) {
  const Art = art[category]
  return (
    <svg viewBox={`0 0 340 ${heights[category] + 10}`} aria-hidden="true" className={className}>
      <ellipse cx="170" cy={heights[category] + 4} rx="150" ry="5" className="fill-ink/10" />
      <Art />
    </svg>
  )
}
