import Link from "next/link";
import { services } from "@/lib/services";
import ServiceIcon from "./ServiceIcon";

/**
 * The services "solar system" for the listing hero: an orange planet in the
 * middle with every service orbiting it on two rings. Each icon is a link to
 * its service page and shows its name on hover; hovering the orbit pauses it.
 * Pure CSS animation (server-safe), matches OrbitPlanet on the detail pages.
 */
const OUTER_S = 90; // seconds per turn, outer ring
const INNER_S = 64; // inner ring (turns the other way)

export default function ServicesOrbit() {
  // split the services across the two rings (outer gets the larger share)
  const outerCount = Math.ceil(services.length * 0.6);
  const rings = [
    { items: services.slice(0, outerCount), inset: "0%", dur: OUTER_S, reverse: false, dashed: true },
    { items: services.slice(outerCount), inset: "19%", dur: INNER_S, reverse: true, dashed: false },
  ];

  return (
    <div className="so-orbit relative mx-auto aspect-square w-full max-w-[540px]">
      <style>{`
        @keyframes so-spin { to { transform: rotate(360deg) } }
        @keyframes so-spin-rev { to { transform: rotate(-360deg) } }
        @keyframes so-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        .so-ring { animation: var(--so-anim) var(--so-dur) linear infinite; }
        .so-keep { animation: var(--so-keep) var(--so-dur) linear infinite; }
        .so-float { animation: so-float 6s ease-in-out infinite; }
        .so-orbit:hover .so-ring, .so-orbit:hover .so-keep, .so-orbit:focus-within .so-ring, .so-orbit:focus-within .so-keep {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .so-ring, .so-keep, .so-float { animation: none; }
        }
      `}</style>

      {/* soft glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[18%] rounded-full bg-brand/25 blur-[70px]" />

      {rings.map((ring, r) => (
        <div
          key={r}
          className="so-ring absolute"
          style={
            {
              inset: ring.inset,
              "--so-anim": ring.reverse ? "so-spin-rev" : "so-spin",
              "--so-keep": ring.reverse ? "so-spin" : "so-spin-rev",
              "--so-dur": `${ring.dur}s`,
            } as React.CSSProperties
          }
        >
          {/* the ring line */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 rounded-full border ${ring.dashed ? "border-dashed border-white/15" : "border-white/10"}`}
          />

          {ring.items.map((s, i) => {
            const angle = (360 / ring.items.length) * i + r * 18;
            return (
              <div key={s.slug} className="pointer-events-none absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  {/* undo the slot angle, then counter-spin so icons stay upright */}
                  <div style={{ transform: `rotate(${-angle}deg)` }}>
                    <div
                      className="so-keep"
                      style={
                        {
                          "--so-keep": ring.reverse ? "so-spin" : "so-spin-rev",
                          "--so-dur": `${ring.dur}s`,
                        } as React.CSSProperties
                      }
                    >
                      <Link
                        href={`/services/${s.slug}`}
                        aria-label={s.title}
                        className="group pointer-events-auto relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[#141317]/90 text-brand shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur transition-[background-color,color,transform,border-color] duration-300 hover:scale-110 hover:border-brand hover:bg-brand hover:text-white focus-visible:scale-110 focus-visible:border-brand focus-visible:bg-brand focus-visible:text-white focus-visible:outline-none md:h-14 md:w-14"
                      >
                        <ServiceIcon name={s.icon} className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-medium text-ink opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                          {s.title}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* the planet */}
      <div className="so-float absolute inset-[34%]">
        <div className="grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffc58f_0%,#f6811f_45%,#b45a0c_100%)] text-center text-white shadow-[inset_-14px_-18px_32px_rgba(0,0,0,0.35),0_0_90px_10px_rgba(246,129,31,0.35)]">
          <span>
            <span className="block text-[clamp(2.2rem,4vw,3.2rem)] font-medium leading-none tracking-[-0.04em]">
              {services.length}
            </span>
            <span className="mt-1 block text-[11px] uppercase tracking-[0.25em] text-white/80">Services</span>
          </span>
        </div>
      </div>
    </div>
  );
}
