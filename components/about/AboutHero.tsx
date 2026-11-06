import Link from "next/link";
import SpaceLaunch from "./SpaceLaunch";

/* where the launch pad sits horizontally (0 = left, 1 = right) */
const STATION_X = 0.76;

export default function AboutHero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-ink pb-48 pt-36 text-white md:pb-44 md:pt-44 lg:min-h-[760px]"
    >
      {/* starfield — matches the space feel of the home hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,.7) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 78% 18%, rgba(255,255,255,.5) 50%, transparent 51%)," +
            "radial-gradient(1.5px 1.5px at 34% 72%, rgba(255,255,255,.6) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 88% 64%, rgba(255,255,255,.6) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 56% 38%, rgba(255,255,255,.4) 50%, transparent 51%)," +
            "radial-gradient(1.5px 1.5px at 6% 84%, rgba(255,255,255,.5) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 66% 88%, rgba(255,255,255,.5) 50%, transparent 51%)",
          backgroundSize: "640px 640px",
        }}
      />

      {/* warm glow behind the pad */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -z-10 h-[520px] w-[520px] -translate-x-1/2 translate-y-1/3 rounded-full bg-brand/15 blur-[120px]"
        style={{ left: `${STATION_X * 100}%` }}
      />

      {/* rollout → countdown → shake → liftoff → space, with the astronaut */}
      <SpaceLaunch stationX={STATION_X} />

      {/* ── copy ── */}
      <div className="container-x relative z-20">
        <div className="max-w-4xl">
          <nav data-reveal="true" aria-label="Breadcrumb" className="text-sm text-white/40">
            <Link href="/" className="transition-colors hover:text-brand">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">About</span>
          </nav>

          <p data-reveal="true" className="eyebrow mt-10 text-white/40">
            About Mindstory
          </p>

          <h1
            data-reveal-words="true"
            className="mt-6 text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-[0.95] tracking-[-0.04em]"
          >
            We tell stories that <span className="text-brand">sell brands.</span>
          </h1>

          <p data-reveal="true" className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
            A digital marketing agency born in Thrissur in 2016 — now a 30+ strong team of
            strategists, designers, film-makers and performance marketers working with brands
            across Kerala and the GCC.
          </p>

          <div data-reveal="true" className="mt-8 flex flex-wrap gap-2">
            {["Google Partner", "Thrissur · Kochi · GCC", "Since 2016"].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}