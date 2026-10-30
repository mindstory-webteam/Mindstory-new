"use client";

import Image from "next/image";
import { useRef } from "react";
import { caseStudies } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowUpRight } from "./Icons";

/** Success stories — pinned horizontal scroll on desktop, swipeable row on mobile. */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 80;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        // subtle inner image parallax
        gsap.utils.toArray<HTMLElement>("[data-card-img]").forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    // Stable wrapper: GSAP's pin moves the <section> into a pin-spacer, so React must never
    // use the section itself as a sibling reference (that caused the insertBefore error).
    <div className="relative">
    <section id="work" ref={root} className="relative overflow-hidden bg-ink py-24 text-white lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0">
      <div className="container-x flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p data-reveal className="eyebrow text-white/60">Success stories</p>
          <h2 data-reveal-words className="mt-5 text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
            Work that moves <span className="text-brand">the needle.</span>
          </h2>
        </div>
        <a data-reveal href="https://mindstory.in/case-studies/" className="group inline-flex items-center gap-2 self-start text-sm uppercase tracking-[0.15em] text-white/70 hover:text-white md:self-auto">
          View all projects
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </a>
      </div>

      <div
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:px-10 lg:mt-16 lg:w-max lg:snap-none lg:overflow-visible lg:pl-[max(40px,calc((100vw-1320px)/2+40px))] lg:pr-10"
      >
        {caseStudies.map((c, i) => (
          <a
            key={c.name}
            href={c.href}
            className="group relative w-[82vw] shrink-0 snap-start sm:w-[420px] lg:w-[440px]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-2">
              <div data-card-img className="absolute -inset-x-[10%] inset-y-0">
                <Image
                  src={c.img}
                  alt={`${c.name} case study`}
                  fill
                  sizes="(min-width:1024px) 520px, 85vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-md">{c.cat}</span>
              <span className="absolute bottom-5 right-5 grid h-12 w-12 scale-75 place-items-center rounded-full bg-brand opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-6">
              <div>
                <h3 className="text-2xl font-medium tracking-tight">{c.name}</h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/55">{c.text}</p>
              </div>
              <span className="text-sm text-white/30">{String(i + 1).padStart(2, "0")}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="container-x mt-10 hidden lg:block">
        <div className="h-px w-full bg-white/10">
          <div data-progress className="h-px origin-left scale-x-0 bg-brand" />
        </div>
      </div>
    </section>
    </div>
  );
}