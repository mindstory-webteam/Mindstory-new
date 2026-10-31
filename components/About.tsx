"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowUpRight } from "./Icons";

// Content from mindstory.in/about
const ABOUT_IMAGE = "https://mindstory.in/wp-content/uploads/about-mindstory.png";

const STATS = [
  { value: 400, suffix: "+", label: "Happy clients" },
  { value: 500, suffix: "M+", label: "People reached" },
  { value: 1500, suffix: "+", label: "Digital campaigns" },
  { value: 30, suffix: "+", label: "Team members" },
];

const MILESTONES = [
  { year: "2016", title: "The beginning", text: "Mindstory starts in Thrissur, and runs its first digital movie promotions." },
  { year: "2017", title: "Media production", text: "An in-house team for shoots, edits and brand films." },
  { year: "2018", title: "Going further", text: "Music production, a dedicated e-commerce division and expansion into the GCC." },
  { year: "2019", title: "₹1 Crore in ads", text: "Managed over ₹10 million of Google Ads spend for clients." },
  { year: "2020", title: "Remote-first", text: "Moved to a work-from-home model without missing a beat." },
  { year: "2021", title: "Public NCD issue", text: "Complete digital marketing for Indel Money's public NCD issue." },
  { year: "2023", title: "Three more issues", text: "Ran campaigns for three public NCD issuances." },
  { year: "Today", title: "10 years strong", text: "400+ clients, 1,500+ campaigns and still counting." },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // count-up stats
      gsap.utils.toArray<HTMLElement>("[data-about-count]").forEach((el) => {
        const end = Number(el.dataset.aboutCount);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString("en-IN")),
        });
      });

      // illustration: rise in, then drift with scroll
      gsap.from("[data-about-art]", {
        y: 60,
        opacity: 0,
        scale: 0.94,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-about-art]", start: "top 85%" },
      });
      gsap.to("[data-about-art] img", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from("[data-about-chip]", {
        scale: 0.6,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.8)",
        stagger: 0.15,
        delay: 0.4,
        scrollTrigger: { trigger: "[data-about-art]", start: "top 80%" },
      });
      gsap.to("[data-about-chip]", { y: -10, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.8 });

      // timeline: the line draws across as you scroll, dots pop as it reaches them
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "[data-timeline]", start: "top 80%", end: "bottom 55%", scrub: 0.6 },
      });
      gsap.utils.toArray<HTMLElement>("[data-ms]").forEach((ms) => {
        tl.fromTo(ms.querySelector("[data-ms-line]"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 })
          .fromTo(ms.querySelector("[data-ms-dot]"), { scale: 0.4, backgroundColor: "#e6e0d6" }, { scale: 1, backgroundColor: "#f6811f", duration: 0.25 }, "<")
          .fromTo(ms.querySelector("[data-ms-year]"), { color: "#b9b2a6" }, { color: "#0c0b0a", duration: 0.25 }, "<");
      });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="relative overflow-hidden bg-paper py-24 md:py-36">
      <div className="container-x">
        {/* intro: copy left, illustration right */}
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p data-reveal className="eyebrow text-muted">About Mindstory</p>
            <h2 data-reveal-words className="mt-5 text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              Your digital growth partner <span className="text-brand">since 2016.</span>
            </h2>
            <p data-reveal className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              We&apos;re a digital marketing agency in Thrissur and Kochi, Kerala. For ten years we&apos;ve blended creativity with technical skill — web, SEO,
              social, ads and branding — into strategies built around your business goals.
            </p>
            <p data-reveal className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              Client-first, measured by real results, and aiming to not just meet expectations but exceed them.
            </p>

            <div data-reveal className="mt-8 flex flex-wrap gap-2">
              {["Google Partner", "Thrissur · Kochi · GCC", "Since 2016"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {t}
                </span>
              ))}
            </div>

            <div data-reveal className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="https://mindstory.in/about/"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-brand"
              >
                More about us
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
              <a href="https://mindstory.in/our-approach/" className="text-[15px] font-medium text-ink underline-offset-8 hover:text-brand hover:underline">
                Our approach
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div data-about-art className="relative mx-auto aspect-[938/875] w-full max-w-[560px]">
              <div className="absolute inset-[10%] rounded-full bg-brand/15 blur-[70px]" aria-hidden />
              <div className="absolute inset-[14%] rounded-full border border-dashed border-brand/30" aria-hidden />
              <Image
                src={ABOUT_IMAGE}
                alt="The Mindstory team at work"
                fill
                sizes="(min-width:1024px) 560px, 90vw"
                className="object-contain"
              />
              <div data-about-chip className="absolute left-0 top-[12%] rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_20px_40px_-20px_rgba(12,11,10,0.35)]">
                <p className="text-2xl font-semibold tracking-tight">100+</p>
                <p className="text-xs text-muted">Events organised</p>
              </div>
              <div data-about-chip className="absolute bottom-[10%] right-0 rounded-2xl bg-ink px-4 py-3 text-white shadow-[0_20px_40px_-20px_rgba(12,11,10,0.5)]">
                <p className="text-2xl font-semibold tracking-tight text-brand">10+</p>
                <p className="text-xs text-white/60">Movie promotions</p>
              </div>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-28 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} data-reveal className="bg-paper px-5 py-8 md:px-8 md:py-10">
              <p className="text-[clamp(2.2rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em]">
                <span data-about-count={s.value}>{s.value.toLocaleString("en-IN")}</span>
                <span className="text-brand">{s.suffix}</span>
              </p>
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* timeline */}
        <div className="mt-20 md:mt-28">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <h3 data-reveal className="text-2xl font-medium tracking-tight md:text-3xl">
              Our story so far
            </h3>
            <p data-reveal className="text-sm text-muted">
              Fuelled by unlimited cups of coffee ☕
            </p>
          </div>

          <ol data-timeline className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 lg:grid-cols-8 lg:gap-x-0">
            {MILESTONES.map((m) => (
              <li key={m.year} data-ms className="relative pt-9 lg:pr-5">
                <span className="absolute left-0 right-0 top-[7px] h-[2px] bg-line" aria-hidden />
                <span data-ms-line className="absolute left-0 right-0 top-[7px] h-[2px] origin-left bg-brand" aria-hidden />
                <span data-ms-dot className="absolute left-0 top-0 h-4 w-4 rounded-full border-[3px] border-paper bg-line" aria-hidden />
                <p data-ms-year className="text-2xl font-semibold tracking-tight">
                  {m.year}
                </p>
                <p className="mt-2 text-[15px] font-medium">{m.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}