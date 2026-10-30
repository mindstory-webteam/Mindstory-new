"use client";

import { gsap, useGSAP, ScrollTrigger, splitWords } from "@/lib/gsap";

/**
 * Global scroll reveals:
 *  - [data-reveal]        fade + rise
 *  - [data-reveal-words]  masked word-by-word headline reveal
 *  - [data-reveal-img]    clip-path image wipe
 */
export default function Reveal() {
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-reveal-words]").forEach((el) => {
      const words = splitWords(el);
      gsap.from(words, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    gsap.set("[data-reveal]", { opacity: 0, y: 40 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 92%",
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal-img]").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(12% 12% 12% 12% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 45%", scrub: true },
        }
      );
    });
  });

  return null;
}
