import Link from "next/link";
import FlyingCraft from "@/components/FlyingCraft";
import AstronautRocket from "./AstronautRocket";

export default function AboutHero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-ink pb-16 pt-36 text-white md:pb-20 md:pt-44"
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

      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
          {/* ── left: copy ── */}
          <div className="lg:col-span-7 lg:pb-10">
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
              className="mt-6 text-[clamp(2.8rem,6.6vw,6.2rem)] font-medium leading-[0.95] tracking-[-0.04em]"
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

          {/* ── right: astronaut rocket with the flying-button engine ── */}
          <div className="relative lg:col-span-5">
            {/* glow + orbit ring behind the launch pad */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[110px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[46%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 md:h-[440px] md:w-[440px]"
            />

            <div className="relative h-[480px] md:h-[620px]">
              <FlyingCraft
                bare
                label="Launch the Mindstory rocket"
                craftClassName="h-[270px] w-[150px] md:h-[360px] md:w-[200px]"
                theme="dark"
                size="extra-large"
                jets={1}
                thrusters={false}
                altitude={190}
                hoverTime={3}
                wobble={1.2}
                smoke={1.2}
                turbulence={1}
                thrustColor="#f6811f"
                smokeColor="#f1ece6"
                carryCursor={false}
                autoLaunch={9}
                autoLaunchDelay={1.4}
              >
                <AstronautRocket />
              </FlyingCraft>

              {/* launch pad */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
            </div>

            <p className="mt-3 text-center text-xs uppercase tracking-[0.18em] text-white/30">
              Hover the rocket to launch
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}