"use client";

import { useRef, useState } from "react";
import { faqs, site } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { Plus } from "./Icons";

export default function Faq() {
  const [open, setOpen] = useState<number>(0);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-faq-body]").forEach((el, i) => {
        gsap.to(el, { height: i === open ? "auto" : 0, duration: 0.6, ease: "expo.out" });
      });
    },
    { scope: root, dependencies: [open] }
  );

  return (
    <section id="faq" ref={root} className="bg-ink py-24 text-white md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p data-reveal className="eyebrow text-white/60">FAQ</p>
            <h2 data-reveal-words className="mt-5 text-[clamp(2.2rem,4.5vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              Questions, <span className="text-brand">answered.</span>
            </h2>
            <p data-reveal className="mt-6 max-w-sm text-white/55">
              Still curious? Talk to us — we&apos;ll arrange a free consultation to understand your needs.
            </p>
            <a data-reveal href={site.phoneHref} className="mt-8 inline-block text-2xl font-medium hover:text-brand">
              {site.phone}
            </a>
          </div>
        </div>

        <div className="lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} data-reveal className="border-b border-white/10">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <span className="flex gap-5">
                    <span className="mt-1 text-sm text-white/35">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-lg font-normal transition-colors md:text-xl ${isOpen ? "text-white" : "text-white/80"}`}>{f.q}</span>
                  </span>
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                      isOpen ? "rotate-45 border-brand bg-brand" : "border-white/20"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <div data-faq-body className="h-0 overflow-hidden">
                  <p className="max-w-2xl pb-8 pl-10 text-[16px] leading-relaxed text-white/60">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
