/**
 * Launch pad art — two lattice towers, swing-away service arms, a launch mount,
 * mission control and a fuel farm. Purely presentational: SpaceLaunch drives it.
 *
 * Drawn in a 440 × 240 box. The launch mount's top (where the rocket's nozzle
 * stands) is at x = 220, 34 units above the bottom edge.
 */

const ORANGE = "#f6811f";
const ORANGE_DARK = "#b85a10";

type Props = {
  /** service arms clamped onto the rocket */
  armsIn: boolean;
  /** ignition smoke + glow */
  firing: boolean;
  /** mission-control screen text */
  screen: string;
};

export default function LaunchStation({ armsIn, firing, screen }: Props) {
  return (
    <svg viewBox="0 0 440 240" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <style>{`
        .ls-arm { transition: transform 0.9s cubic-bezier(.6,0,.2,1); transform-box: fill-box; }
        .ls-arm-l { transform-origin: left center; transform: rotate(-62deg); }
        .ls-arm-r { transform-origin: right center; transform: rotate(62deg); }
        .ls-in .ls-arm-l, .ls-in .ls-arm-r { transform: rotate(0deg); }
        .ls-beacon { animation: ls-blink 1.4s steps(1) infinite; }
        .ls-beacon-2 { animation-delay: .7s; }
        .ls-smoke { opacity: 0; transform-box: fill-box; transform-origin: center; }
        .ls-fire .ls-smoke { animation: ls-puff 3.2s ease-out forwards; }
        .ls-glow { opacity: 0; transition: opacity .3s; }
        .ls-fire .ls-glow { opacity: 1; }
        @keyframes ls-blink { 0%,100% { opacity: 1 } 50% { opacity: .15 } }
        @keyframes ls-puff {
          0%   { opacity: 0;   transform: translate(0,0) scale(.3); }
          12%  { opacity: .95; }
          100% { opacity: 0;   transform: translate(var(--dx), var(--dy)) scale(2.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-arm, .ls-beacon, .ls-fire .ls-smoke { animation: none; transition: none; }
        }
      `}</style>

      <defs>
        <pattern id="ls-lat-l" x="140" y="30" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 0L28 28M28 0L0 28M0 0H28" stroke={ORANGE} strokeWidth="1.6" />
        </pattern>
        <pattern id="ls-lat-r" x="272" y="30" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 0L28 28M28 0L0 28M0 0H28" stroke={ORANGE} strokeWidth="1.6" />
        </pattern>
        <pattern id="ls-lat-bridge" x="0" y="22" width="14" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 0L7 10L14 0" fill="none" stroke={ORANGE} strokeWidth="1.2" />
        </pattern>
        <pattern id="ls-hazard" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="12" fill={ORANGE} opacity=".55" />
        </pattern>
        <radialGradient id="ls-flame-glow">
          <stop offset="0" stopColor={ORANGE} stopOpacity=".8" />
          <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className={`${armsIn ? "ls-in" : ""} ${firing ? "ls-fire" : ""}`}>
        {/* ── fuel farm (left) ── */}
        <g opacity=".9">
          <rect x="18" y="214" width="104" height="8" rx="2" fill="#2a2e3d" />
          {["LOX", "FUEL"].map((label, i) => (
            <g key={label} transform={`translate(${24 + i * 48} 186)`}>
              <rect width="42" height="26" rx="13" fill="#e9e4dc" />
              <rect x="6" y="4" width="30" height="3" rx="1.5" fill="#fff" opacity=".7" />
              <rect x="10" y="26" width="3" height="4" fill="#8a8f9e" />
              <rect x="29" y="26" width="3" height="4" fill="#8a8f9e" />
              <text x="21" y="18" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#5b6070">
                {label}
              </text>
            </g>
          ))}
          <path d="M118 204H190" stroke="#8a8f9e" strokeWidth="3" fill="none" />
        </g>

        {/* ── towers ── */}
        {[
          { x: 140, pat: "ls-lat-l" },
          { x: 272, pat: "ls-lat-r" },
        ].map(({ x, pat }) => (
          <g key={x}>
            <rect x={x} y="30" width="28" height="192" fill={`url(#${pat})`} />
            <rect x={x} y="30" width="28" height="192" fill="none" stroke={ORANGE} strokeWidth="3" />
            {[86, 156].map((y) => (
              <g key={y}>
                <rect x={x - 6} y={y} width="40" height="6" fill={ORANGE_DARK} />
                <rect x={x - 4} y={y - 8} width="10" height="8" fill={ORANGE} />
                <rect x={x + 22} y={y - 8} width="10" height="8" fill={ORANGE} />
              </g>
            ))}
            <rect x={x - 4} y="214" width="36" height="8" fill="#c0392b" />
          </g>
        ))}

        {/* top bridge + beacons */}
        <rect x="140" y="22" width="160" height="10" fill="url(#ls-lat-bridge)" />
        <rect x="140" y="22" width="160" height="10" fill="none" stroke={ORANGE} strokeWidth="2.5" />
        <path d="M154 22V19M286 22V19" stroke={ORANGE} strokeWidth="2" />
        <circle className="ls-beacon" cx="154" cy="16" r="3" fill="#ff4d4d" />
        <circle className="ls-beacon ls-beacon-2" cx="286" cy="16" r="3" fill="#ff4d4d" />

        {/* ── swing-away service arms ── */}
        {[92, 162].map((y) => (
          <g key={y}>
            <g className="ls-arm ls-arm-l">
              <rect x="168" y={y} width="28" height="8" fill="#d9dde6" />
              <path d={`M168 ${y + 8}L175 ${y}L182 ${y + 8}L189 ${y}L196 ${y + 8}`} stroke="#8a8f9e" strokeWidth="1" fill="none" />
            </g>
            <g className="ls-arm ls-arm-r">
              <rect x="244" y={y} width="28" height="8" fill="#d9dde6" />
              <path d={`M244 ${y}L251 ${y + 8}L258 ${y}L265 ${y + 8}L272 ${y}`} stroke="#8a8f9e" strokeWidth="1" fill="none" />
            </g>
          </g>
        ))}

        {/* ── mission control (right) ── */}
        <g>
          <rect x="322" y="150" width="96" height="72" rx="3" fill="#22263a" stroke="#ffffff" strokeOpacity=".12" />
          <rect x="322" y="150" width="96" height="10" fill={ORANGE} opacity=".85" />
          <text x="370" y="158" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill="#14161f">
            MISSION CONTROL
          </text>
          <rect x="330" y="168" width="80" height="22" rx="2" fill="#0d0f16" />
          <text
            x="370"
            y="183"
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="700"
            fill={firing ? "#ffd29a" : ORANGE}
          >
            {screen}
          </text>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={332 + i * 20} y="198" width="14" height="10" rx="1" fill="#8fd3ff" opacity=".35" />
          ))}
          <path d="M404 150V128" stroke="#8a8f9e" strokeWidth="1.5" />
          <circle className="ls-beacon" cx="404" cy="126" r="2" fill="#ff4d4d" />
          <path d="M336 150C336 140 348 136 352 142" stroke="#d9dde6" strokeWidth="2" fill="none" />
        </g>

        {/* ── deck, flame trench, launch mount ── */}
        <rect x="0" y="222" width="440" height="18" fill="#1a1d29" />
        <rect x="0" y="222" width="440" height="1" fill="#ffffff" opacity=".18" />
        <rect x="176" y="226" width="88" height="10" rx="2" fill="url(#ls-hazard)" />
        <path d="M188 222 L194 206 H246 L252 222 Z" fill="#3a3f52" />
        <rect x="194" y="204" width="52" height="3" fill="#8a8f9e" />

        {/* ignition glow + smoke */}
        <ellipse className="ls-glow" cx="220" cy="214" rx="96" ry="28" fill="url(#ls-flame-glow)" />
        {[
          { cx: 204, dx: "-70px", dy: "-14px", r: 20 },
          { cx: 236, dx: "70px", dy: "-14px", r: 20 },
          { cx: 192, dx: "-140px", dy: "-6px", r: 16 },
          { cx: 248, dx: "140px", dy: "-6px", r: 16 },
          { cx: 210, dx: "-30px", dy: "-40px", r: 14 },
          { cx: 230, dx: "30px", dy: "-40px", r: 14 },
        ].map((s, i) => (
          <circle
            key={i}
            className="ls-smoke"
            cx={s.cx}
            cy="218"
            r={s.r}
            fill="#f1ece6"
            style={{ ["--dx" as string]: s.dx, ["--dy" as string]: s.dy, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </g>
    </svg>
  );
}