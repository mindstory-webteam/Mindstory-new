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

export default function WhyUs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-sw]");
      gsap.fromTo(
        words,
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
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="bg-paper py-24 md:py-36">
      <div className="container-x">
        <p data-reveal className="eyebrow text-muted">Why choose Mindstory</p>

        <p data-statement className="mt-8 text-[clamp(1.8rem,4.2vw,3.6rem)] font-normal leading-[1.15] tracking-[-0.025em]">
          {statement.split(" ").map((w, i) => (
            <span key={i} data-sw className={w.startsWith("storytelling") || w.startsWith("Kerala") ? "text-brand" : ""}>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          <div data-reveal className="relative overflow-hidden rounded-3xl bg-brand p-8 text-white md:row-span-2 md:p-10">
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full border border-white/25" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full border border-white/25" />
            <p className="text-sm uppercase tracking-[0.18em] text-white/80">Experience</p>
            <p className="mt-6 text-[7rem] font-medium leading-none tracking-[-0.05em] md:text-[9rem]">
              <span data-count="10">10</span>+
            </p>
            <p className="mt-4 max-w-xs text-lg text-white/90">Years crafting creative strategies and measurable growth for brands across industries.</p>
            <a href="https://mindstory.in/about/" className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-ink">
              About us <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div data-reveal className="rounded-3xl border border-line bg-white p-8">
            <p className="text-6xl font-medium tracking-[-0.04em]">
              <span data-count="109">109</span>
            </p>
            <p className="mt-3 text-muted">Google reviews — rated <span className="font-medium text-ink">Excellent</span></p>
          </div>
          <div data-reveal className="rounded-3xl border border-line bg-white p-8">
            <p className="text-6xl font-medium tracking-[-0.04em]">
              <span data-count="15">15</span>+
            </p>
            <p className="mt-3 text-muted">Leading brands that trust us with their growth</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:col-span-2">
            {pillars.map((p) => (
              <div data-reveal key={p.k} className="group rounded-3xl border border-line bg-white p-8 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-white">
                <span className="text-sm text-brand">{p.k}</span>
                <h3 className="mt-6 text-xl font-medium">{p.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted transition-colors group-hover:text-white/60">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
