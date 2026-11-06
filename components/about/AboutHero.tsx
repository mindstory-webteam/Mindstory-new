import Link from "next/link";
import SpaceLaunch from "./SpaceLaunch";
import RotatingWords from "./RotatingWords";

/* where the launch pad sits horizontally on desktop (0 = left, 1 = right) */
const STATION_X = 0.76;

/* the words that cycle at the end of the headline */
const WORDS = ["sell brands.", "build trust.", "drive growth.", "win hearts.", "spark action."];

export default function AboutHero() {
  return (
    <section
      id="top"
      className="relative isolate flex items-center overflow-hidden bg-ink pb-[330px] pt-32 text-white sm:pb-[370px] md:pt-40 lg:min-h-[820px] lg:pb-28"
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

      {/* warm glow behind the pad (right side, level with the copy) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 translate-y-1/3 rounded-full bg-brand/15 blur-[120px] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-y-[-30%]"
        style={{ ["--x" as string]: `${STATION_X * 100}%` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -z-10 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-brand/15 blur-[120px] lg:block"
        style={{ left: `${STATION_X * 100}%` }}
      />

      {/* full-section background: rollout → countdown → shake → liftoff → space.
          Waits for the "Start launch" button on the pad. */}
      <SpaceLaunch stationX={STATION_X} />

      {/* ── copy (left). The wrapper ignores clicks so the Start button on the pad stays clickable. ── */}
      <div className="container-x pointer-events-none relative z-20 w-full">
        <div className="pointer-events-auto max-w-xl lg:max-w-[46%]">
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

          {/* plain data-reveal (not data-reveal-words): the word splitter would
              rewrite the DOM that the rotating words need */}
          <h1
            data-reveal="true"
            className="mt-6 text-[clamp(2.1rem,4.6vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.04em]"
          >
            We tell stories
            <br />
            that <RotatingWords words={WORDS} className="text-brand" />
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