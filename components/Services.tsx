"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/lib/data";
import { ArrowUpRight } from "./Icons";

/*
  Gradient carousel: one abstract artwork card per service, arranged in 3D.
*/

type Art = { bg: string; a: string; b: string; shape: "arch" | "wave" | "sun" | "windows" | "orbit" | "fold" };

const SHORT = ["SEO", "Social Media", "Performance Ads", "Web Design", "Branding", "Email Marketing"];
const ART: Art[] = [
  { bg: "#6d0c63", a: "#ff6a1f", b: "#ffc21a", shape: "arch" },
  { bg: "#43098a", a: "#ff3d8b", b: "#ff7a3d", shape: "wave" },
  { bg: "#36096f", a: "#ff4a5c", b: "#ffb030", shape: "sun" },
  { bg: "#0f1a5e", a: "#4b74ff", b: "#ff7ad9", shape: "windows" },
  { bg: "#4e0b24", a: "#f6811f", b: "#ff3d6e", shape: "orbit" },
  { bg: "#0f3550", a: "#22d3c5", b: "#f6d365", shape: "fold" },
];

/** abstract artwork for a card — pure SVG, with a grain filter for the printed look */
function CardArt({ art, id }: { art: Art; id: number }) {
  const g = `sv-g${id}`;
  const g2 = `sv-h${id}`;
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={art.a} />
          <stop offset="1" stopColor={art.b} />
        </linearGradient>
        <radialGradient id={g2} cx="0.3" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
        <filter id={`sv-n${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={id + 3} />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.12 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect width="400" height="500" fill={art.bg} />

      {art.shape === "arch" && <path d="M-20 120 C 20 520, 380 520, 420 260 L 330 230 C 300 400, 120 420, 110 120 Z" fill={`url(#${g})`} />}
      {art.shape === "wave" && <path d="M-20 170 C 90 80, 170 120, 230 220 S 360 360, 420 300 L 420 400 C 350 470, 250 380, 200 300 S 60 200, -20 280 Z" fill={`url(#${g})`} />}
      {art.shape === "sun" && (
        <>
          <path d="M60 520 L60 200 A140 140 0 0 1 340 200 L340 520 L290 520 L290 210 A90 90 0 0 0 110 210 L110 520 Z" fill={art.a} />
          <rect x="125" y="190" width="150" height="230" rx="75" fill={`url(#${g})`} />
          <path d="M-10 470 L420 380 L420 520 L-10 520 Z" fill={art.bg} opacity="0.85" />
        </>
      )}
      {art.shape === "windows" && (
        <>
          <rect x="40" y="70" width="230" height="170" rx="22" fill={`url(#${g})`} />
          <rect x="130" y="200" width="230" height="170" rx="22" fill={art.b} opacity="0.85" />
          <rect x="70" y="330" width="170" height="120" rx="22" fill={art.a} opacity="0.9" />
          <circle cx="68" cy="94" r="7" fill="#fff" opacity="0.7" />
          <circle cx="90" cy="94" r="7" fill="#fff" opacity="0.45" />
        </>
      )}
      {art.shape === "orbit" && (
        <>
          <circle cx="200" cy="250" r="150" fill={`url(#${g})`} />
          <circle cx="250" cy="210" r="120" fill={art.bg} />
          <ellipse cx="200" cy="260" rx="200" ry="46" fill="none" stroke={art.b} strokeWidth="14" transform="rotate(-18 200 260)" />
        </>
      )}
      {art.shape === "fold" && (
        <>
          <path d="M0 120 L200 300 L400 120 L400 500 L0 500 Z" fill={`url(#${g})`} />
          <path d="M0 120 L200 300 L400 120 L200 40 Z" fill={art.b} opacity="0.9" />
          <path d="M0 500 L170 330 L230 330 L400 500 Z" fill={art.a} opacity="0.6" />
        </>
      )}

      <rect width="400" height="500" fill={`url(#${g2})`} />
      <rect width="400" height="500" fill="#fff" filter={`url(#sv-n${id})`} />
    </svg>
  );
}

const N = services.length;
/** signed distance from the active card, wrapped around the ring */
const offset = (i: number, active: number) => {
  let d = (i - active) % N;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
};

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [cardW, setCardW] = useState(360);
  const paused = useRef(false);
  const inView = useRef(false);
  const first = useRef(true);

  const go = useCallback((i: number) => setActive(((i % N) + N) % N), []);

  // card size follows the stage width
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setCardW(Math.round(Math.min(440, Math.max(230, w < 640 ? w * 0.62 : w * 0.3))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // place every card in 3D around the active one
  useGSAP(
    () => {
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      cards.current.forEach((el, i) => {
        if (!el) return;
        const d = offset(i, active);
        const a = Math.abs(d);
        const vars = {
          x: d * cardW * (a > 1 ? 1.02 : 1.12),
          z: a === 0 ? 0 : a === 1 ? -170 : -420,
          rotationY: -d * (a === 1 ? 16 : 24),
          scale: a === 0 ? 1 : a === 1 ? 0.92 : 0.82,
          opacity: a >= 3 ? 0 : a === 2 ? 0.55 : 1,
          filter: `blur(${a >= 2 ? 5 : 0}px)`,
          zIndex: 10 - a,
        };
        if (first.current || reduced) gsap.set(el, vars);
        else gsap.to(el, { ...vars, duration: 0.9, ease: "power3.out", overwrite: "auto" });
      });
      first.current = false;
    },
    { scope: root, dependencies: [active, cardW] }
  );

  // autoplay while visible and not being handled
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.4 });
    if (stage.current) io.observe(stage.current);
    const id = window.setInterval(() => {
      if (inView.current && !paused.current && !document.hidden) setActive((a) => (a + 1) % N);
    }, 4500);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);

  // drag / swipe
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, moved: false };
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 40) {
      drag.current.moved = true;
      go(active + (dx < 0 ? 1 : -1));
    }
    const moved = drag.current.moved;
    setTimeout(() => (drag.current = null), 0);
    if (moved) e.preventDefault();
  };

  const s = services[active];

  return (
    <section
      id="services"
      ref={root}
      className="relative isolate overflow-hidden bg-paper py-24 text-ink md:py-32"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="container-x text-center">
        <p data-reveal className="eyebrow justify-center text-muted">What we do</p>
        <h2 data-reveal-words className="mx-auto mt-5 max-w-4xl text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">
          An all-in-one digital marketing hub to <span className="font-light italic text-brand">elevate</span> your brand.
        </h2>
      </div>

      {/* 3D carousel */}
      <div
        ref={stage}
        className="relative mx-auto mt-14 h-[calc(var(--cw)*1.25+40px)] w-full max-w-[1500px] cursor-grab touch-pan-y select-none active:cursor-grabbing md:mt-20"
        style={{ perspective: "1600px", "--cw": `${cardW}px` } as React.CSSProperties}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (drag.current = null)}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Our services"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(active + 1);
          if (e.key === "ArrowLeft") go(active - 1);
        }}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
      >
        <div className="absolute left-1/2 top-5" style={{ transformStyle: "preserve-3d" }}>
          {services.map((sv, i) => {
            const isActive = i === active;
            return (
              <div
                key={sv.title}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="absolute left-0 top-0"
                style={{ width: cardW, height: cardW * 1.25, marginLeft: -cardW / 2, transformStyle: "preserve-3d" }}
                aria-hidden={!isActive}
              >
                <a
                  href={sv.href}
                  draggable={false}
                  tabIndex={isActive ? 0 : -1}
                  onClick={(e) => {
                    if (drag.current?.moved) return e.preventDefault();
                    if (!isActive) {
                      e.preventDefault();
                      go(i);
                    }
                  }}
                  className="group relative block h-full w-full overflow-hidden rounded-[28px] shadow-[0_40px_70px_-35px_rgba(12,11,10,0.45)] ring-1 ring-black/5"
                >
                  <CardArt art={ART[i]} id={i} />
                  {/* label */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 pt-20 text-white">
                    <div>
                      <p className="text-xs font-medium tracking-[0.2em] text-white/70">{String(i + 1).padStart(2, "0")}</p>
                      <p className="mt-1 text-2xl font-medium tracking-tight md:text-[1.7rem]">{SHORT[i]}</p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-ink">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* active service + controls */}
      <div className="container-x mt-10 flex flex-col items-center text-center md:mt-14">
        <p key={`t${active}`} className="text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-tight text-ink [animation:sv-in_.6s_both]">
          {s.title}
        </p>
        <p key={`b${active}`} className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted [animation:sv-in_.6s_.08s_both]">
          {s.body}
        </p>

        <div className="mt-8 flex items-center gap-5">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous service"
            className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4 -rotate-[135deg]" />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose a service">
            {services.map((sv, i) => (
              <button
                key={sv.title}
                role="tab"
                aria-selected={i === active}
                aria-label={SHORT[i]}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-brand" : "w-1.5 bg-ink/20 hover:bg-ink/50"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next service"
            className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4 rotate-45" />
          </button>
        </div>

        <a href="https://mindstory.in/services/" className="mt-8 text-sm font-medium text-muted underline-offset-4 hover:text-brand hover:underline">
          All services →
        </a>
      </div>

      <style>{`@keyframes sv-in{from{opacity:0;transform:translateY(10px)}}`}</style>
    </section>
  );
}