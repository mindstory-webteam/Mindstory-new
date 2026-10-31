"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { WhatsApp } from "./Icons";

const serviceLinks = [
  { label: "Digital Marketing", href: "https://mindstory.in/digital-advertising/" },
  { label: "Social Media Management", href: "https://mindstory.in/social-media-marketing/" },
  { label: "Website Development", href: "https://mindstory.in/web-development/" },
  { label: "Logo & Branding", href: "https://mindstory.in/logo-identity/" },
  { label: "Creative Design", href: "https://mindstory.in/creative-design/" },
  { label: "SEO", href: "https://mindstory.in/search-engine-optimization/" },
];
const companyLinks = [
  { label: "About Us", href: "https://mindstory.in/about/" },
  { label: "Our Clients", href: "https://mindstory.in/clients/" },
  { label: "Case Studies", href: "https://mindstory.in/case-studies/" },
  { label: "Blog", href: "https://mindstory.in/blog/" },
  { label: "Careers", href: "https://mindstory.in/career/" },
  { label: "Request a Free Quote", href: "https://mindstory.in/request-quote/" },
];

const BRAND = "Mindstory";

// Wall-sign depth: stacked layers form the letter sides (getting darker toward the wall),
// a thin warm line on top where the neon catches the edge, then the shadow cast on the wall.
const WALL_SHADOW = [
  "0 -0.006em 0 rgba(255,196,140,0.75)",
  ...Array.from({ length: 14 }, (_, i) => {
    const k = i + 1;
    const shade = Math.round(30 - k * 1.7); // 28 → 6
    return `${(k * 0.0011).toFixed(4)}em ${(k * 0.0042).toFixed(4)}em 0 rgb(${shade + 6},${shade + 2},${shade})`;
  }),
  "0.02em 0.11em 0.05em rgba(0,0,0,0.55)",
  "0.03em 0.22em 0.18em rgba(40,12,0,0.45)",
].join(", ");

// Soft-edged mask that grows out from the centre as --w goes 0% → 260%.
const SPREAD: React.CSSProperties = {
  WebkitMaskImage: "radial-gradient(closest-side, #000 55%, transparent)",
  maskImage: "radial-gradient(closest-side, #000 55%, transparent)",
  WebkitMaskSize: "var(--w) 400%",
  maskSize: "var(--w) 400%",
  WebkitMaskPosition: "50% 50%",
  maskPosition: "50% 50%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
};

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const stage = root.current!.querySelector<HTMLElement>("[data-neon]")!;
      const tube = "[data-neon-tube]";
      const light = "[data-neon-light]";
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // --w is the width of the lit area; the glow and the wordmark are both masked by it
      if (reduced) {
        gsap.set(stage, { "--w": "260%" });
        gsap.set(tube, { scaleX: 1, opacity: 1 });
        gsap.set(light, { opacity: 1 });
      } else {
        // dark room until the CTA scrolls in
        gsap.set(stage, { "--w": "0%" });
        gsap.set(tube, { scaleX: 0.03, opacity: 0, transformOrigin: "50% 50%" });
        gsap.set(light, { opacity: 0 });

        const on = gsap.timeline({ paused: true });
        // 1 · a spark in the centre of the tube stutters to life…
        [[1, 0.06], [0.15, 0.1], [1, 0.05], [0.3, 0.12], [1, 0.06]].forEach(([o, d], k, arr) => {
          const at = 0.15 + arr.slice(0, k).reduce((s, [, dd]) => s + dd, 0);
          on.to(tube, { opacity: o, duration: 0.02, ease: "none" }, at);
        });
        // 2 · …then the light runs out from the centre to both ends,
        //     and the glow + white wordmark spread out with it
        const go = 0.6;
        on.to(tube, { scaleX: 1, duration: 1.5, ease: "expo.inOut" }, go)
          .to(light, { opacity: 1, duration: 0.6, ease: "power1.out" }, go)
          .to(stage, { "--w": "260%", duration: 2.2, ease: "power2.inOut" }, go);

        // the occasional hum-flicker of an old tube
        const hum = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 5.5 });
        hum.to([tube, light], { opacity: 0.55, duration: 0.03 })
          .to([tube, light], { opacity: 1, duration: 0.05 })
          .to([tube, light], { opacity: 0.75, duration: 0.03 }, "+=0.08")
          .to([tube, light], { opacity: 1, duration: 0.08 });
        on.eventCallback("onComplete", () => {
          hum.play();
        });

        gsap.to({}, {
          scrollTrigger: {
            trigger: stage,
            start: "top 60%",
            once: true,
            onEnter: () => {
              on.play();
            },
          },
        });
      }

      // the pool of light leans a little toward the cursor
      const xTo = gsap.quickTo("[data-neon-pool]", "xPercent", { duration: 1.2, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        xTo(((e.clientX - r.left) / r.width - 0.5) * 8);
      };
      stage.addEventListener("pointermove", move);
      return () => stage.removeEventListener("pointermove", move);
    },
    { scope: root }
  );

  return (
    <footer ref={root} id="contact" className="grain relative overflow-hidden bg-ink text-white">
      {/* ─────────── NEON REVEAL CTA ─────────── */}
      <div data-neon style={{ "--w": "0%" } as React.CSSProperties} className="relative isolate flex min-h-[420px] flex-col items-center overflow-hidden border-t border-white/10 md:min-h-[560px]">
        {/* the pool of light under the tube */}
        <div
          data-neon-light
          data-neon-pool
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10%] top-[34px] -z-10 h-[95%] md:top-[52px]"
          style={{
            background:
              "radial-gradient(ellipse 62% 88% at 50% 0%, rgba(255,186,120,1) 0%, rgba(246,129,31,0.95) 16%, rgba(214,98,16,0.82) 34%, rgba(150,55,8,0.56) 52%, rgba(80,28,5,0.3) 70%, rgba(12,11,10,0) 90%)",
            ...SPREAD,
          }}
        />
        {/* soft spill up the wall above the tube */}
        <div data-neon-light aria-hidden className="pointer-events-none absolute inset-x-[8%] top-0 -z-10 h-[70px] bg-[radial-gradient(ellipse_50%_100%_at_50%_100%,rgba(246,129,31,0.35),transparent)]" />

        {/* the neon tube itself, with mounting clips */}
        <div className="absolute inset-x-[4%] top-[32px] h-[5px] md:top-[50px]" aria-hidden>
          <span
            data-neon-tube
            className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#ffd3a6,#fff6ee_12%,#ffffff_50%,#fff6ee_88%,#ffd3a6)]"
            style={{
              boxShadow:
                "0 0 4px #fff, 0 0 10px #ffd0a0, 0 0 22px #ff9a3d, 0 0 46px #f6811f, 0 0 90px rgba(246,129,31,0.8), 0 0 160px rgba(246,129,31,0.55)",
            }}
          />
          <span className="absolute -top-[5px] left-[6%] h-[15px] w-[10px] rounded-[3px] bg-[#1d1a17] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]" />
          <span className="absolute -top-[5px] right-[6%] h-[15px] w-[10px] rounded-[3px] bg-[#1d1a17] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]" />
        </div>

        <div className="container-x relative flex flex-1 flex-col items-center justify-center pt-28 text-center md:pt-36">
          {/* lit zone: appears as the light spreads out from the centre */}
          <p className="eyebrow justify-center text-ink/75 before:!bg-ink">Your success story starts here</p>

          <h2 className="relative mt-4 select-none font-bold leading-[0.82] tracking-[-0.06em]" aria-label={BRAND}>
            {/* 3D wall letters: back layer = thickness + top-edge highlight + shadow cast on the wall,
                front layer = the black face, a touch warmer at the top where the neon hits it */}
            <span className="relative block px-[0.1em] pb-[0.32em] text-[clamp(3rem,13vw,11.5rem)]" style={SPREAD}>
              <span aria-hidden className="absolute inset-0 px-[0.1em] pb-[0.32em] text-[#0b0908]" style={{ textShadow: WALL_SHADOW }}>
                {BRAND}
              </span>
              <span
                className="relative block bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(180deg, #3a2213 0%, #1d140e 22%, #100d0b 55%, #0a0908 100%)",
                  WebkitBackgroundClip: "text",
                }}
              >
                {BRAND}
              </span>
            </span>
          </h2>
        </div>

        <div className="h-16 md:h-24" />
      </div>

      {/* footer grid */}
      <div className="container-x relative grid gap-12 border-t border-white/10 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Image src="/logo-light.png" alt="Mindstory — Digital Partner" width={489} height={127} className="h-10 w-auto" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/55">
            A trusted digital marketing agency in Kerala with 10+ years of expertise — creative strategies, measurable results and lasting brand growth.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Services</p>
          <ul className="mt-5 space-y-3">
            {serviceLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-[15px] text-white/75 transition-colors hover:text-brand">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Company</p>
          <ul className="mt-5 space-y-3">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-[15px] text-white/75 transition-colors hover:text-brand">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Contact</p>
          <a href={site.phoneHref} className="mt-5 block text-2xl font-medium hover:text-brand">{site.phone}</a>
          <a href={`mailto:${site.email}`} className="mt-2 block text-white/75 hover:text-brand">{site.email}</a>
          <p className="mt-2 text-sm text-white/45">{site.hours}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 transition-colors hover:border-brand hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x relative flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row">
        <p>© {new Date().getFullYear()} Mindstory. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="https://mindstory.in/privacy-policy/" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
        </div>
      </div>

      {/* floating WhatsApp */}
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition-transform hover:scale-110"
      >
        <WhatsApp className="h-7 w-7" />
      </a>
    </footer>
  );
}