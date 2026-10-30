"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap, useGSAP, splitWords } from "@/lib/gsap";
import { site } from "@/lib/data";
import { ArrowUpRight, Google, Star } from "./Icons";
import Magnetic from "./Magnetic";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const h1 = root.current!.querySelector<HTMLElement>("h1")!;
      const words = splitWords(h1);
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.from("[data-hero-canvas]", { opacity: 0, scale: 0.85, duration: 2.2 }, 0)
        .from("[data-hero-eyebrow]", { y: 20, opacity: 0, duration: 1 }, 0.2)
        .from(words, { yPercent: 110, duration: 1.3, stagger: 0.06 }, 0.3)
        .from("[data-hero-fade]", { y: 30, opacity: 0, duration: 1.1, stagger: 0.1 }, 0.8)
        .from("[data-hero-line]", { scaleX: 0, transformOrigin: "left", duration: 1.4 }, 0.9);

      // parallax the copy away on scroll
      gsap.to("[data-hero-copy]", {
        yPercent: -18,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
      {/* glow */}
      <div className="pointer-events-none absolute -right-40 top-1/4 -z-10 h-[620px] w-[620px] rounded-full bg-brand/20 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-brand-deep/10 blur-[120px]" />

      {/* three.js */}
      <div data-hero-canvas className="absolute inset-0 -z-10 opacity-60 lg:left-[38%] lg:opacity-100">
        <HeroCanvas />
      </div>

      <div data-hero-copy className="container-x flex flex-1 flex-col justify-center pb-16 pt-36 md:pt-40">
        <p data-hero-eyebrow className="eyebrow text-white/70">
          #01 Digital Marketing Agency in Kerala
        </p>

        <h1 className="mt-7 max-w-[13ch] text-[clamp(2.9rem,8.2vw,7.4rem)] font-medium leading-[0.98] tracking-[-0.035em]">
          Top Digital Marketing Agency in <span className="text-brand">Kerala.</span>
        </h1>

        <div data-hero-line className="mt-10 h-px w-full max-w-xl bg-gradient-to-r from-white/40 to-transparent" />

        <div className="mt-8 flex max-w-xl flex-col gap-8">
          <p data-hero-fade className="text-lg leading-relaxed text-white/65 md:text-xl">
            We help businesses grow through data-driven strategy — SEO, social, performance ads, web and branding.
            Full-funnel solutions that deliver real results and lasting impact.
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href={site.proposal}
                className="group inline-flex items-center gap-3 rounded-full bg-brand py-2 pl-7 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-brand-deep"
              >
                Get Free Advice
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Magnetic>
            <a href="#work" className="inline-flex items-center gap-2 px-3 py-3 text-[15px] text-white/80 underline-offset-8 hover:text-white hover:underline">
              See our work
            </a>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div data-hero-fade className="container-x relative pb-8">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Google className="h-6 w-6" />
            <div>
              <div className="flex gap-0.5 text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5" />
                ))}
              </div>
              <p className="mt-1 text-xs text-white/60">Rated Excellent · 109 Google reviews</p>
            </div>
          </div>
          <div className="flex gap-10 text-sm">
            <div>
              <p className="text-2xl font-medium">10+</p>
              <p className="text-white/50">Years of expertise</p>
            </div>
            <div>
              <p className="text-2xl font-medium">Thrissur</p>
              <p className="text-white/50">Kochi & beyond</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50 md:flex">
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-brand" />
            </span>
          </div>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
