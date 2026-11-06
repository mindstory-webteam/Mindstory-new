import type { ComponentProps, CSSProperties } from "react";
import ServiceIcon from "./ServiceIcon";

/** the exact icon names ServiceIcon accepts (keeps TypeScript happy) */
type IconName = ComponentProps<typeof ServiceIcon>["name"];

/**
 * The service "planet": an orange globe with the service icon, two orbit rings,
 * and moons that travel around those rings. Pure CSS animation (server-safe).
 *
 * `seed` (the service slug) sets each moon's starting angle, so every
 * service page gets its own arrangement.
 */

type Moon = {
  /** which ring the moon rides: outer = dashed ring, inner = solid ring */
  ring: "outer" | "inner";
  className: string;
  /** seconds per full orbit */
  duration: number;
  reverse?: boolean;
};

const MOONS: Moon[] = [
  { ring: "outer", className: "h-4 w-4 bg-white/85 shadow-[0_0_14px_rgba(255,255,255,0.45)]", duration: 46 },
  { ring: "inner", className: "h-3 w-3 bg-brand shadow-[0_0_14px_rgba(246,129,31,0.8)]", duration: 28, reverse: true },
  { ring: "outer", className: "h-2 w-2 bg-white/50", duration: 64 },
  { ring: "inner", className: "h-1.5 w-1.5 bg-white/70", duration: 36 },
];

/** small string hash → 0..1 values, stable between server and client */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export default function OrbitPlanet({ icon, seed }: { icon: string; seed: string }) {
  const rand = seeded(seed);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <style>{`
        @keyframes op-spin { to { transform: rotate(360deg) } }
        @keyframes op-spin-rev { to { transform: rotate(-360deg) } }
        @keyframes op-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        .op-orbit { animation: var(--op-anim) var(--op-dur) linear var(--op-delay) infinite; }
        .op-ring-spin { animation: op-spin 140s linear infinite; }
        .op-float { animation: op-float 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .op-orbit, .op-ring-spin, .op-float { animation-play-state: paused; }
        }
      `}</style>

      {/* rings */}
      <div className="op-ring-spin absolute inset-0 rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-[14%] rounded-full border border-white/10" />

      {/* planet */}
      <div className="op-float absolute inset-[30%]">
        <div className="grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffc58f_0%,#f6811f_45%,#b45a0c_100%)] text-white shadow-[inset_-14px_-18px_32px_rgba(0,0,0,0.35),0_0_90px_10px_rgba(246,129,31,0.35)]">
          {/* icon comes from lib/services as a string; cast it to ServiceIcon's name type */}
          <ServiceIcon name={icon as IconName} className="h-[38%] w-[38%] drop-shadow" />
        </div>
      </div>

      {/* moons — each sits at the top of a rotating ring-sized frame */}
      {MOONS.map((m, i) => {
        const startAngle = rand() * 360;
        const style = {
          "--op-anim": m.reverse ? "op-spin-rev" : "op-spin",
          "--op-dur": `${m.duration}s`,
          // a negative delay starts the orbit part-way round
          "--op-delay": `${-(startAngle / 360) * m.duration}s`,
        } as CSSProperties;
        return (
          <div
            key={i}
            aria-hidden="true"
            className={`op-orbit pointer-events-none absolute ${m.ring === "outer" ? "inset-0" : "inset-[14%]"}`}
            style={style}
          >
            <span className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full ${m.className}`} />
          </div>
        );
      })}
    </div>
  );
}