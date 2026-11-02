import Image from "next/image";

/**
 * The craft art: the Mindstory astronaut seated in the cockpit of a toy rocket.
 * Drawn in a 200 × 360 box — the nozzle sits at the bottom-centre so the
 * flight engine's exhaust lines up with it. Scale it by sizing the parent.
 */
export default function AstronautRocket() {
  return (
    <span className="relative block h-full w-full select-none" aria-hidden="true">
      {/* back layer: cockpit opening + far half of the rim */}
      <svg viewBox="0 0 200 360" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="ar-cockpit" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#3a332d" />
            <stop offset="100%" stopColor="#0c0b0a" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="122" rx="60" ry="13" fill="url(#ar-cockpit)" />
        <path d="M40 122 A60 13 0 0 1 160 122" fill="none" stroke="#d26c05" strokeWidth="7" />
      </svg>

      {/* the astronaut — upper body, waist hidden by the cockpit rim */}
      <Image
        src="/astronaut-seated.webp"
        alt=""
        width={740}
        height={640}
        priority
        draggable={false}
        sizes="160px"
        className="pointer-events-none absolute left-[6.5%] top-0 w-[75%] max-w-none"
      />

      {/* front layer: fuselage, fins, porthole, nozzle */}
      <svg viewBox="0 0 200 360" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="ar-body" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f3f1ee" />
            <stop offset="100%" stopColor="#c9c4bd" />
          </linearGradient>
          <linearGradient id="ar-fin" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff9a3c" />
            <stop offset="100%" stopColor="#d26c05" />
          </linearGradient>
          <linearGradient id="ar-metal" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#e9e9ec" />
            <stop offset="45%" stopColor="#9a9aa2" />
            <stop offset="100%" stopColor="#4a4a52" />
          </linearGradient>
          <radialGradient id="ar-glass" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#b8b8c0" />
            <stop offset="100%" stopColor="#55555e" />
          </radialGradient>
          <clipPath id="ar-hull">
            <path d="M40 122 A60 13 0 0 0 160 122 C174 170 174 236 150 300 L50 300 C26 236 26 170 40 122 Z" />
          </clipPath>
        </defs>

        {/* side fins (behind hull) */}
        <path d="M54 236 C30 252 16 292 18 354 L48 334 C50 312 54 298 62 292 Z" fill="url(#ar-fin)" />
        <path d="M146 236 C170 252 184 292 182 354 L152 334 C150 312 146 298 138 292 Z" fill="url(#ar-fin)" />

        {/* nozzle */}
        <path d="M76 310 L124 310 L134 352 Q100 362 66 352 Z" fill="url(#ar-metal)" />
        <ellipse
          cx="100"
          cy="353"
          rx="33"
          ry="5"
          style={{
            fill: "color-mix(in srgb, var(--fly-glow) calc(var(--fly-thrust) * 100%), #2a2a30)",
          }}
        />
        <path d="M64 298 L136 298 L128 314 L72 314 Z" fill="#6f6a63" />

        {/* hull */}
        <path
          d="M40 122 A60 13 0 0 0 160 122 C174 170 174 236 150 300 L50 300 C26 236 26 170 40 122 Z"
          fill="url(#ar-body)"
        />
        <g clipPath="url(#ar-hull)">
          <rect x="0" y="150" width="200" height="22" fill="#f6811f" />
          <rect x="0" y="276" width="200" height="10" fill="#f6811f" />
          {/* soft right-side shade for a toy-3D feel */}
          <path d="M140 120 C170 180 168 250 146 302 L200 302 L200 120 Z" fill="#0c0b0a" opacity="0.08" />
        </g>

        {/* porthole */}
        <circle cx="100" cy="220" r="23" fill="url(#ar-glass)" stroke="#f6811f" strokeWidth="6" />
        <ellipse cx="92" cy="211" rx="7" ry="4.5" fill="#fff" opacity="0.8" transform="rotate(-30 92 211)" />

        {/* front fin */}
        <path d="M93 262 L107 262 L106 344 Q100 352 94 344 Z" fill="url(#ar-fin)" />

        {/* near half of the cockpit rim (in front of the astronaut's waist) */}
        <path d="M40 122 A60 13 0 0 0 160 122" fill="none" stroke="#f6811f" strokeWidth="8" strokeLinecap="round" />
        <path d="M46 126 A56 11 0 0 0 154 126" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
      </svg>
    </span>
  );
}