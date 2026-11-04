"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowUpRight } from "./Icons";

const statement =
  "Standing out takes more than ads. We merge cutting-edge strategy with engaging storytelling, so your brand builds a meaningful connection with the people who matter — across Kerala and beyond.";

const pillars = [
  { k: "01", t: "Story-led strategy", d: "Brand analysis first, so every campaign reflects your mission, vision and market position." },
  { k: "02", t: "Local insight, global outlook", d: "A deep understanding of Kerala's digital landscape — Kochi, Thrissur and beyond." },
  { k: "03", t: "Measured by KPIs", d: "Clear, data-driven KPIs on every campaign, with transparent monthly reporting." },
  { k: "04", t: "A dedicated manager", d: "Daily communication and frequent strategy reviews keep you informed and aligned." },
];

/* satellites on the orbit: angle is where they start (0 = top, clockwise) */
const satellites = [
  { angle: 35, value: 109, suffix: "", label: "Google reviews", note: "Rated Excellent" },
  { angle: 215, value: 15, suffix: "+", label: "Leading brands", note: "Trust us with growth" },
];

export default function WhyUs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // statement lights up word by word as you scroll
      gsap.fromTo(
        "[data-sw]",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: "[data-statement]", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );

      // count-up
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
        });
      });

      if (reduced) return;

      // stat cards orbit the middle ring — they counter-rotate so their text stays upright
      gsap.to("[data-orbit]", { rotation: 360, duration: 26, ease: "none", repeat: -1 });
      gsap.to("[data-orbit-chip]", { rotation: -360, duration: 26, ease: "none", repeat: -1 });
      // small planets travel the outer ring the other way
      gsap.to("[data-orbit-outer]", { rotation: -360, duration: 18, ease: "none", repeat: -1 });
      gsap.to("[data-ring-spin]", { rotation: 360, duration: 60, ease: "none", repeat: -1 });

      // pillar rows: the orange line draws in as each row arrives
      gsap.utils.toArray<HTMLElement>("[data-row-line]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }
        );
      });
    },
    { scope: root }
  );

  return (
    <section id="why-us" ref={root} className="relative overflow-hidden bg-paper py-24 text-ink md:py-36">
      {/* soft warm glow behind the orbit */}
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[640px] w-[640px] rounded-full bg-brand/10 blur-[140px]" />

      <div className="container-x relative">
        <p data-reveal className="eyebrow text-muted">
          Why choose Mindstory
        </p>

        <p
          data-statement
          className="mt-8 max-w-6xl text-[clamp(1.8rem,4.2vw,3.6rem)] font-normal leading-[1.15] tracking-[-0.025em]"
        >
          {statement.split(" ").map((w, i) => (
            <span key={i} data-sw className={w.startsWith("storytelling") || w.startsWith("Kerala") ? "text-brand" : ""}>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mt-20 grid items-center gap-16 md:mt-28 lg:grid-cols-12 lg:gap-10">
          {/* ── left: the orbit ── */}
          <div data-reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-[460px]">
              {/* rings */}
              <div data-ring-spin className="absolute inset-0 rounded-full border border-dashed border-ink/20" />
              <div className="absolute inset-[16%] rounded-full border border-line" />
              <div className="absolute inset-[31%] rounded-full bg-brand shadow-[0_30px_70px_-10px_rgba(246,129,31,0.55)]" />
              <div className="absolute inset-[24%] rounded-full border border-dashed border-brand/30" />

              {/* planets on the outer ring */}
              <div data-orbit-outer className="absolute inset-0">
                <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_0_6px_rgba(246,129,31,0.15)]" />
                <span className="absolute bottom-[14.6%] left-[14.6%] h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-ink" />
                <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-muted/60" />
              </div>

              {/* centre: years */}
              <div className="absolute inset-[31%] grid place-items-center text-center text-white">
                <div>
                  <p className="text-[clamp(3.4rem,9vw,5.4rem)] font-medium leading-none tracking-[-0.05em]">
                    <span data-count="10">10</span>+
                  </p>
                  <p className="mt-1 text-[10px] uppercase leading-snug tracking-[0.16em] text-white/90 sm:text-[11px]">
                    Years of
                    <br />
                    growth
                  </p>
                </div>
              </div>

              {/* satellites travel on the middle ring */}
              <div data-orbit className="absolute inset-[16%]">
                {satellites.map((s) => {
                  const a = (s.angle * Math.PI) / 180;
                  return (
                    <div
                      key={s.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${50 + 50 * Math.sin(a)}%`, top: `${50 - 50 * Math.cos(a)}%` }}
                    >
                      <div
                        data-orbit-chip
                        className="whitespace-nowrap rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_20px_40px_-20px_rgba(12,11,10,0.35)]"
                      >
                        <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                          <span data-count={s.value}>{s.value}</span>
                          <span className="text-brand">{s.suffix}</span>
                        </p>
                        <p className="text-xs text-ink/80">{s.label}</p>
                        <p className="text-[11px] text-muted">{s.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* ── right: the four reasons ── */}
          <div className="lg:col-span-7">
            <ol>
              {pillars.map((p) => (
                <li key={p.k} data-reveal className="group relative">
                  <span className="absolute inset-x-0 top-0 h-px bg-line" />
                  <span data-row-line className="absolute left-0 top-0 h-px w-24 origin-left bg-brand" />
                  <div className="grid grid-cols-[3rem_1fr] gap-x-4 py-7 transition-colors duration-500 sm:grid-cols-[4.5rem_1fr_auto] md:py-8">
                    <span className="pt-1 text-sm font-medium text-brand">{p.k}</span>
                    <div>
                      <h3 className="text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-brand md:text-2xl">
                        {p.t}
                      </h3>
                      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted transition-colors duration-300 group-hover:text-ink">
                        {p.d}
                      </p>
                    </div>
                    <span className="hidden h-11 w-11 place-items-center self-center rounded-full border border-line bg-white text-ink/70 transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-white sm:grid">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <div data-reveal className="flex flex-wrap items-center gap-5 border-t border-line pt-8">
              <a
                href="https://mindstory.in/about/"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-brand"
              >
                About us
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
              <p className="text-sm text-muted">Trusted across Kerala and the GCC since 2016.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}