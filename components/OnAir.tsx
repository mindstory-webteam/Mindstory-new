"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import RetroTV, { type TVChannel } from "./RetroTV";
import DomeGallery from "./DomeGallery";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { blogs, caseStudies } from "@/lib/data";

const WP = "https://mindstory.in/wp-content/uploads";

/* ══════════════════════════════════════════════════════════════════════
   "VIDEOS" — short Mindstory motion pieces built with GSAP.
   They play like video clips (progress, end, loop) and scale to any box.
   To use a real video instead, give a reel a `src` (e.g. "/videos/reel.mp4").
   ══════════════════════════════════════════════════════════════════════ */

type SceneName = "brand" | "services" | "growth";
type SceneProps = { loop?: boolean; onEnd?: () => void; onProgress?: (p: number) => void };

/** Shared timeline wiring for every scene. */
function useScene(root: React.RefObject<HTMLDivElement | null>, build: (tl: gsap.core.Timeline) => void, { loop, onEnd, onProgress }: SceneProps) {
  const cb = useRef({ onEnd, onProgress });
  cb.current = { onEnd, onProgress };
  useGSAP(
    () => {
      const tl = gsap.timeline({
        repeat: loop ? -1 : 0,
        onUpdate: () => cb.current.onProgress?.(tl.progress()),
        onComplete: () => cb.current.onEnd?.(),
      });
      build(tl);
    },
    { scope: root }
  );
}

const sceneBox = "absolute inset-0 overflow-hidden [container-type:size]";

/* 1 — Brand film: logo reveal with orbiting rings */
function BrandFilm(props: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  useScene(
    root,
    (tl) => {
      tl.fromTo("[data-glow]", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0)
        .fromTo("[data-ring]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.55, duration: 1.6, stagger: 0.18, ease: "expo.out" }, 0.1)
        .fromTo("[data-ring]", { rotate: 0 }, { rotate: 160, duration: 6, ease: "none" }, 0.1)
        .fromTo("[data-logo]", { clipPath: "inset(0 100% 0 0)", scale: 1.12 }, { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.4, ease: "expo.inOut" }, 0.6)
        .fromTo("[data-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out" }, 1.6)
        .fromTo("[data-tag]", { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out" }, 1.8)
        .fromTo("[data-place]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 2.3)
        .to("[data-ring]", { scale: 1.15, opacity: 0, duration: 1.1, ease: "power2.in", stagger: 0.08 }, 5.4)
        .to(["[data-logo]", "[data-line]", "[data-tagbox]", "[data-place]", "[data-glow]"], { opacity: 0, duration: 0.7 }, 6.2)
        .set(["[data-logo]", "[data-line]", "[data-tagbox]", "[data-place]"], { opacity: 1 }, 7);
    },
    props
  );
  return (
    <div ref={root} className={`${sceneBox} bg-[radial-gradient(circle_at_50%_46%,#2a1608_0%,#0c0b0a_62%)] text-white`}>
      <div data-glow className="absolute left-1/2 top-[44%] h-[70cqh] w-[70cqh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(246,129,31,.45),transparent)]" />
      {[38, 60, 84].map((s) => (
        <div
          key={s}
          data-ring
          className="absolute left-1/2 top-[44%] rounded-full border-2 border-brand"
          style={{ width: `${s}cqh`, height: `${s}cqh`, marginLeft: `-${s / 2}cqh`, marginTop: `-${s / 2}cqh` }}
        />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-logo src="/logo-light.png" alt="Mindstory" className="absolute left-1/2 top-[44%] w-[58cqw] -translate-x-1/2 -translate-y-1/2" />
      <div data-line className="absolute left-1/2 top-[60%] h-[0.3cqh] w-[44cqw] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,#f6811f,transparent)]" />
      <div data-tagbox className="absolute inset-x-0 top-[64%] overflow-hidden text-center">
        <p data-tag className="text-[3.2cqw] font-normal uppercase tracking-[0.32em] text-white/75">Your digital partner</p>
      </div>
      <p data-place className="absolute inset-x-0 bottom-[9%] text-center text-[1.9cqw] tracking-[0.4em] text-white/40">THRISSUR · KOCHI · KERALA</p>
    </div>
  );
}

/* 2 — Services film: kinetic type on brand orange */
const SERVICE_WORDS: [string, string][] = [
  ["SEO.", "Ranking your site #1 on Google"],
  ["Social.", "Brand boost on every platform"],
  ["Ads.", "Digital strategy built for impact"],
  ["Web.", "Custom design that stands out"],
  ["Brand.", "Identity, art & illustration"],
];
function ServicesFilm(props: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useScene(
    root,
    (tl) => {
      const step = 1.1;
      const items = gsap.utils.toArray<HTMLElement>("[data-item]");
      gsap.set("[data-item] [data-up]", { yPercent: 110 });
      gsap.set("[data-final] [data-up]", { yPercent: 110 });
      tl.fromTo("[data-panel]", { yPercent: 100 }, { yPercent: 100, duration: 0.01 }, 0);
      items.forEach((it, i) => {
        const t = 0.2 + i * step;
        tl.to(it.querySelectorAll("[data-up]"), { yPercent: 0, duration: 0.55, ease: "expo.out", stagger: 0.06 }, t)
          .call(() => {
            if (num.current) num.current.textContent = `0${i + 1}`;
          }, undefined, t)
          .to(it.querySelectorAll("[data-up]"), { yPercent: -110, duration: 0.4, ease: "expo.in" }, t + step - 0.4);
      });
      const end = 0.2 + items.length * step;
      tl.fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 1, duration: end, ease: "none" }, 0)
        .to("[data-panel]", { yPercent: 0, duration: 0.7, ease: "expo.inOut" }, end - 0.1)
        .to("[data-final] [data-up]", { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.1 }, end + 0.45)
        .to("[data-final] [data-up]", { yPercent: -110, duration: 0.5, ease: "expo.in", stagger: 0.05 }, 7.4)
        .set("[data-item] [data-up]", { yPercent: 110 }, 8)
        .set("[data-panel]", { yPercent: 100 }, 8);
    },
    props
  );
  return (
    <div ref={root} className={`${sceneBox} bg-brand text-white`}>
      <p className="absolute left-[8%] top-[9%] text-[2.1cqw] font-medium uppercase tracking-[0.3em]">What we do</p>
      <p className="absolute right-[7%] top-[9%] text-[2.7cqw] font-medium tracking-[0.1em]">
        <span ref={num}>01</span> / 05
      </p>
      {SERVICE_WORDS.map(([w, s]) => (
        <div data-item key={w} className="absolute inset-0">
          <div className="absolute left-[7%] top-[30%] overflow-hidden pb-[0.06em]">
            <p data-up className="text-[20cqw] font-semibold leading-none tracking-[-0.05em]">{w}</p>
          </div>
          <div className="absolute left-[8%] top-[62%] overflow-hidden">
            <p data-up className="text-[3.2cqw] font-light text-white/85">{s}</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-[10%] left-[8%] right-[7%] h-[0.4cqh] bg-white/30">
        <div data-bar className="h-full origin-left bg-white" />
      </div>
      <div data-panel className="absolute inset-0 bg-ink" />
      <div data-final className="absolute left-[7%] top-[30%] text-[12.5cqw] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
        <div className="overflow-hidden"><p data-up>All-in-one</p></div>
        <div className="overflow-hidden"><p data-up>digital <span className="text-brand">hub.</span></p></div>
      </div>
    </div>
  );
}

/* 3 — Growth film: animated chart */
const BARS = [18, 26, 22, 34, 40, 38, 52, 58, 66, 74, 86, 96];
function GrowthFilm(props: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  useScene(
    root,
    (tl) => {
      const p = path.current!;
      const L = p.getTotalLength();
      const prog = { t: 0 };
      const place = () => {
        const pt = p.getPointAtLength(L * prog.t);
        if (pin.current) {
          pin.current.style.left = `${8 + (pt.x / 800) * 84}%`;
          pin.current.style.top = `${30 + (pt.y / 400) * 48}%`;
        }
      };
      tl.fromTo("[data-up]", { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.1 }, 0.2)
        .fromTo("[data-gridlines]", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.4)
        .fromTo("[data-b]", { scaleY: 0 }, { scaleY: 1, duration: 1.1, ease: "expo.out", stagger: 0.07 }, 0.7)
        .fromTo(pin.current, { scale: 0 }, { scale: 1, duration: 0.4 }, 1.4)
        .fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut" }, 1.4)
        .fromTo(prog, { t: 0 }, { t: 1, duration: 2.6, ease: "power2.inOut", onUpdate: place }, 1.4)
        .fromTo("[data-chip]", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.15 }, 2.4)
        .to(root.current!.children, { opacity: 0, duration: 0.6 }, 6.3)
        .set(root.current!.children, { opacity: 1 }, 7);
    },
    props
  );
  return (
    <div ref={root} className={`${sceneBox} bg-ink text-white`}>
      <div className="absolute left-[8%] top-[8%] text-[6.4cqw] font-semibold leading-[1.05] tracking-[-0.03em]">
        <div className="overflow-hidden"><p data-up>Growth you can</p></div>
        <div className="overflow-hidden"><p data-up className="text-brand">measure.</p></div>
      </div>
      <div data-gridlines className="absolute bottom-[20%] left-[8%] right-[8%] top-[30%] bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] bg-[length:100%_25%]" />
      <div className="absolute bottom-[20%] left-[8%] right-[8%] flex h-[48%] items-end gap-[2cqw]">
        {BARS.map((h, i) => (
          <i key={i} data-b className="block flex-1 origin-bottom rounded-t-[0.8cqw] bg-[linear-gradient(180deg,rgba(246,129,31,.9),rgba(246,129,31,.25))]" style={{ height: `${h}%` }} />
        ))}
      </div>
      <svg viewBox="0 0 800 400" preserveAspectRatio="none" className="absolute left-[8%] top-[30%] h-[48%] w-[84%] overflow-visible">
        <path ref={path} d="M10 360 C 120 340, 160 300, 240 290 S 380 250, 450 200 S 600 150, 660 90 S 760 40, 790 20" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div ref={pin} className="absolute h-[2.6cqw] w-[2.6cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_1cqw_rgba(246,129,31,.35),0_0_3cqw_#f6811f]" />
      <div className="absolute bottom-[6%] left-[8%] flex gap-[1.6cqw]">
        {["Traffic", "Leads", "Revenue"].map((c) => (
          <span key={c} data-chip className="rounded-full border border-white/25 px-[2.2cqw] py-[1cqw] text-[2.3cqw]">
            {c} <b className="text-brand">↑</b>
          </span>
        ))}
      </div>
    </div>
  );
}

const SCENES: Record<SceneName, (p: SceneProps) => React.ReactElement> = {
  brand: BrandFilm,
  services: ServicesFilm,
  growth: GrowthFilm,
};

/** Plays either a real video file or a GSAP scene, with the same callbacks. */
function Clip({ reel, loop, onEnd, onProgress }: { reel: Reel } & SceneProps) {
  if (reel.src) {
    return (
      <video
        src={reel.src}
        poster={reel.poster}
        muted
        playsInline
        autoPlay
        loop={loop}
        className="absolute inset-0 h-full w-full object-cover"
        onEnded={onEnd}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) onProgress?.(v.currentTime / v.duration);
        }}
      />
    );
  }
  const Scene = SCENES[reel.scene ?? "brand"];
  return <Scene loop={loop} onEnd={onEnd} onProgress={onProgress} />;
}

/* ══════════════════════════════════════════════════════════════════════
   SCREEN LAYOUTS — each channel shows its content differently
   ══════════════════════════════════════════════════════════════════════ */

type Reel = { title: string; scene?: SceneName; src?: string; poster?: string };

/** Layout 2 — Showreel: clips back to back with a lower third + progress. */
function ShowreelLayout({ reels }: { reels: Reel[] }) {
  const [i, setI] = useState(0);
  const bar = useRef<HTMLSpanElement>(null);
  const lower = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(lower.current, { xPercent: -110, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "expo.out" });
  }, [i]);

  return (
    <div className="absolute inset-0 bg-black">
      <Clip
        key={i}
        reel={reels[i]}
        onEnd={() => setI((n) => (n + 1) % reels.length)}
        onProgress={(p) => {
          if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        }}
      />
      <div ref={lower} className="absolute bottom-[15%] left-[7%] flex items-stretch overflow-hidden rounded-[1cqw] text-white shadow-lg">
        <span className="flex items-center bg-brand px-[2cqw] text-[1.9cqw] font-semibold uppercase tracking-[0.18em]">
          Reel {String(i + 1).padStart(2, "0")}
        </span>
        <span className="flex items-center bg-black/70 px-[2cqw] py-[1.2cqw] text-[2.4cqw] font-medium backdrop-blur-sm">{reels[i].title}</span>
      </div>
      <div className="absolute bottom-[9%] left-[7%] right-[7%] flex gap-[1cqw]">
        {reels.map((r, n) => (
          <span key={r.title} className="relative h-[0.6cqh] flex-1 overflow-hidden rounded-full bg-white/25">
            <span
              ref={n === i ? bar : undefined}
              className="absolute inset-0 origin-left bg-brand"
              style={{ transform: `scaleX(${n < i ? 1 : 0})` }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Layout 3 — Mosaic: looping clips and stills in a 3 × 2 grid. */
type Tile = { kind: "clip"; reel: Reel; label: string } | { kind: "image"; src: string; label: string };
function MosaicLayout({ tiles }: { tiles: Tile[] }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from("[data-tile]", {
        scale: 0.6,
        opacity: 0,
        rotate: (i: number) => (i % 2 ? 4 : -4),
        duration: 0.9,
        ease: "expo.out",
        stagger: { each: 0.07, from: "center" },
        delay: 0.25,
      });
      gsap.utils.toArray<HTMLElement>("[data-kb]").forEach((el, i) => {
        gsap.fromTo(el, { scale: 1.05, xPercent: i % 2 ? -3 : 3 }, { scale: 1.18, xPercent: i % 2 ? 3 : -3, duration: 9, ease: "none", repeat: -1, yoyo: true });
      });
    },
    { scope: root }
  );
  return (
    <div ref={root} className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[1.4cqw] bg-ink px-[7%] py-[9%]">
      {tiles.slice(0, 6).map((t, i) => (
        <figure key={i} data-tile className={`relative overflow-hidden rounded-[1.6cqw] bg-white/5 ${i === 0 ? "row-span-2" : ""}`}>
          {t.kind === "clip" ? (
            <Clip reel={t.reel} loop />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img data-kb src={t.src} alt={t.label} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent px-[1.4cqw] pb-[1.2cqw] pt-[4cqw] text-[1.8cqw] font-medium text-white">
            {t.kind === "clip" && <span className="mr-[0.8cqw] inline-block h-[1cqw] w-[1cqw] rounded-full bg-brand align-middle" />}
            {t.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Layout 4 — Newsroom: rotating headlines, LIVE badge and a ticker. */
type Story = { img: string; title: string; tag: string };
function NewsLayout({ stories, interval = 3.2 }: { stories: Story[]; interval?: number }) {
  const [i, setI] = useState(0);
  const head = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % stories.length), interval * 1000);
    return () => clearInterval(id);
  }, [stories.length, interval]);

  useEffect(() => {
    imgs.current.forEach((el, n) => {
      if (!el) return;
      if (n === i) gsap.fromTo(el, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1.02, duration: interval + 0.8, ease: "none", overwrite: true });
      else gsap.to(el, { opacity: 0, duration: 0.8, overwrite: "auto" });
    });
    gsap.fromTo(head.current, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out" });
  }, [i, interval]);

  const ticker = stories.map((s) => s.title).join("   •   ");

  return (
    <div className="absolute inset-0 overflow-hidden bg-black text-white">
      {stories.map((s, n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s.img + n}
          ref={(el) => {
            imgs.current[n] = el;
          }}
          src={s.img}
          alt={s.title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: n === 0 ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
      <div className="absolute left-[7%] top-[15%] flex items-center gap-[1cqw] rounded-[0.8cqw] bg-brand px-[1.6cqw] py-[0.7cqw] text-[1.8cqw] font-semibold tracking-[0.2em]">
        <span className="inline-block h-[1.1cqw] w-[1.1cqw] animate-pulse rounded-full bg-white" /> LIVE
      </div>
      <div className="absolute bottom-[20%] left-[7%] right-[7%] overflow-hidden">
        <div ref={head}>
          <p className="text-[1.7cqw] font-medium uppercase tracking-[0.22em] text-brand">{stories[i].tag}</p>
          <h3 className="mt-[0.8cqw] text-[4.2cqw] font-semibold leading-[1.08] tracking-[-0.02em]">{stories[i].title}</h3>
        </div>
      </div>
      <div className="absolute bottom-[7.5%] left-[4%] right-[4%] flex h-[6.5cqh] items-center overflow-hidden rounded-[0.8cqw] bg-white text-ink">
        <span className="z-10 flex h-full shrink-0 items-center bg-ink px-[1.6cqw] text-[1.7cqw] font-semibold tracking-[0.18em] text-white">MINDSTORY</span>
        <div className="flex w-max animate-[marquee_22s_linear_infinite] whitespace-nowrap text-[1.9cqw] font-medium">
          <span className="px-[2cqw]">{ticker}   •   </span>
          <span className="px-[2cqw]">{ticker}   •   </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CONTENT + CHANNELS
   ══════════════════════════════════════════════════════════════════════ */

const REELS: Reel[] = [
  { title: "Your digital partner", scene: "brand" },
  { title: "All-in-one digital hub", scene: "services" },
  { title: "Growth you can measure", scene: "growth" },
  // { title: "Client film", src: "/videos/client.mp4", poster: "/videos/client.jpg" },  ← real videos work too
];

const DOME_IMAGES = caseStudies.map((c) => ({ src: c.img, alt: `${c.name} — ${c.cat}` }));

const TILES: Tile[] = [
  { kind: "clip", reel: REELS[0], label: "Brand film" },
  { kind: "image", src: caseStudies[0].img, label: caseStudies[0].name },
  { kind: "clip", reel: REELS[2], label: "Performance" },
  { kind: "image", src: caseStudies[4].img, label: caseStudies[4].name },
  { kind: "clip", reel: REELS[1], label: "Services" },
  { kind: "image", src: caseStudies[5].img, label: caseStudies[5].name },
];

const STORIES: Story[] = [
  ...blogs.map((b) => ({ img: b.img, title: b.title, tag: b.tag })),
  { img: `${WP}/Untitled-design-17.webp`, title: "How small businesses can still compete with bigger brands", tag: "Strategy" },
];

type Layout = "dome" | "showreel" | "mosaic" | "news";
type Channel = TVChannel & { layout: Layout; label: string; duration: number };

const CHANNELS: Channel[] = [
  { number: 3, name: "Success Stories", label: "3D Gallery", layout: "dome", duration: 10 },
  { number: 5, name: "Mindstory Showreel", label: "Showreel", layout: "showreel", duration: 15 },
  { number: 7, name: "Our Work", label: "Mosaic", layout: "mosaic", duration: 10 },
  { number: 9, name: "Insights", label: "Newsroom", layout: "news", duration: 13 },
];

/* ══════════════════════════════════════════════════════════════════════
   BALLOONS — drawn in SVG above the cabinet. The SVG's bottom edge sits on
   the cabinet top; every string ties to the same knot at (600, 620).
   ══════════════════════════════════════════════════════════════════════ */

const TIE = { x: 600, y: 620 };
const BALLOONS = [
  { cx: 410, cy: 190, rx: 92, ry: 108, fill: "#f6811f", shine: "#ffc591", knot: "#d26c05" },
  { cx: 575, cy: 118, rx: 96, ry: 112, fill: "#0c0b0a", shine: "#5a5550", knot: "#000000" },
  { cx: 735, cy: 205, rx: 88, ry: 104, fill: "#f7f4ef", shine: "#ffffff", knot: "#d9d2c6" },
];
// shard directions for the "pop" burst
const SHARDS = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * Math.PI * 2 + (i % 2 ? 0.25 : -0.15);
  return { dx: Math.cos(a), dy: Math.sin(a), r: 1 + (i % 3) * 0.35, rot: i * 47 };
});

function Balloons() {
  return (
    <svg
      viewBox="0 0 1000 620"
      className="pointer-events-none absolute left-[10%] w-[80%] overflow-visible"
      style={{ bottom: "71.1%" }}
      aria-hidden
    >
      <g data-bunch>
        {BALLOONS.map((b, i) => {
          const knotY = b.cy + b.ry;
          return (
            <g key={i} data-balloon={i}>
              {/* string */}
              <path
                data-string
                d={`M${b.cx} ${knotY + 10} Q ${(b.cx + TIE.x) / 2 + (i - 1) * 30} ${(knotY + TIE.y) / 2} ${TIE.x} ${TIE.y}`}
                fill="none"
                stroke="#6f6a63"
                strokeWidth="2.5"
              />
              {/* balloon body */}
              <g data-body>
                <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.fill} stroke={i === 2 ? "#e6e0d6" : "none"} strokeWidth="3" />
                <ellipse cx={b.cx - b.rx * 0.38} cy={b.cy - b.ry * 0.42} rx={b.rx * 0.18} ry={b.ry * 0.26} fill={b.shine} opacity="0.7" transform={`rotate(-25 ${b.cx - b.rx * 0.38} ${b.cy - b.ry * 0.42})`} />
                <path d={`M${b.cx - 12} ${knotY + 12} L${b.cx} ${knotY - 2} L${b.cx + 12} ${knotY + 12} Z`} fill={b.knot} />
                {i === 1 && (
                  <text x={b.cx} y={b.cy + 22} textAnchor="middle" fontFamily="Rubik Variable, Rubik, sans-serif" fontWeight="700" fontSize="70" fill="#f6811f">
                    M
                  </text>
                )}
              </g>
              {/* pop burst */}
              <g data-burst opacity="0">
                {SHARDS.map((s, k) => (
                  <rect
                    key={k}
                    data-shard
                    data-dx={s.dx * (b.rx + 70) * s.r}
                    data-dy={s.dy * (b.ry + 60) * s.r}
                    x={b.cx - 7}
                    y={b.cy - 4}
                    width="14"
                    height="8"
                    rx="2"
                    fill={k % 3 === 0 ? "#f6811f" : b.fill}
                    stroke={i === 2 ? "#d9d2c6" : "none"}
                    transform={`rotate(${s.rot} ${b.cx} ${b.cy})`}
                  />
                ))}
                <text data-pop x={b.cx} y={b.cy + 18} textAnchor="middle" fontFamily="Rubik Variable, Rubik, sans-serif" fontWeight="800" fontSize="64" fill="#f6811f" stroke="#ffffff" strokeWidth="8" paintOrder="stroke">
                  POP!
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION
   ══════════════════════════════════════════════════════════════════════ */

export default function OnAir() {
  const [channel, setChannel] = useState(0);
  const [mono, setMono] = useState(false);
  const [compact, setCompact] = useState(false);

  const root = useRef<HTMLElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const hovering = useRef(false);
  const lastTouch = useRef(0);
  const inView = useRef(false);
  const landed = useRef(false);

  // phones get fewer, larger dome tiles
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // auto-surf only while the TV is actually on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.35 });
    if (tvRef.current) io.observe(tvRef.current);
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    elapsed.current = 0;
    setChannel(i);
  };

  // automatic channel switching once the TV has landed; pauses on hover, after a touch, off-screen or in a hidden tab
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const paused = !landed.current || !inView.current || hovering.current || document.hidden || now - lastTouch.current < 6000;
      if (!paused) elapsed.current += dt;
      if (elapsed.current >= CHANNELS[channel].duration) {
        goTo((channel + 1) % CHANNELS.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [channel]);

  /* ─────────── balloon flight → pop → fall → land, then grow on scroll ─────────── */
  useGSAP(
    () => {
      const fly = root.current!.querySelector<HTMLElement>("[data-fly]")!;
      const grow = root.current!.querySelector<HTMLElement>("[data-grow]")!;
      const shadow = root.current!.querySelector<HTMLElement>("[data-shadow]")!;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // TV grows from small to full size as you scroll it into the middle of the screen
      gsap.fromTo(
        grow,
        { scale: 0.58 },
        {
          scale: 1,
          ease: "none",
          transformOrigin: "50% 100%",
          scrollTrigger: { trigger: grow, start: "top 85%", end: "center 55%", scrub: 0.6 },
        }
      );

      const land = () => {
        gsap.set("[data-bunch]", { autoAlpha: 0 });
        gsap.set(fly, { x: 0, yPercent: 0, rotation: 0 });
        gsap.set(shadow, { x: 0, scaleX: 1, opacity: 1 });
        landed.current = true;
      };

      if (reduced) {
        land();
        return;
      }

      // parked off-screen until the section comes into view
      gsap.set(fly, { x: -4000, yPercent: -24, rotation: -8, transformOrigin: "50% 100%" });
      gsap.set(shadow, { x: -4000, scaleX: 0.35, opacity: 0.12 });
      gsap.set("[data-burst] [data-shard]", { x: 0, y: 0, opacity: 1 });
      gsap.set("[data-pop]", { scale: 0, transformOrigin: "50% 50%" });

      const play = () => {
        // start just past the left edge of the screen (x is in the TV's own, scaled, space)
        // measure the slot (grow), not the TV — the TV is still parked off-screen at this point
        const r = grow.getBoundingClientRect();
        const s = Number(gsap.getProperty(grow, "scale")) || 1;
        const startX = -(r.right + 120) / s;

        const tl = gsap.timeline({ onComplete: () => (landed.current = true) });

        // 1 · drift in under the balloons, bobbing and swaying
        tl.fromTo([fly, shadow], { x: startX }, { x: 0, duration: 2.8, ease: "power2.out" }, 0)
          .fromTo(fly, { rotation: -9 }, { rotation: 4, duration: 2.8, ease: "sine.inOut" }, 0)
          .to(fly, { rotation: 0, duration: 0.6, ease: "sine.inOut" }, 2.8)
          .fromTo(fly, { yPercent: -24 }, { yPercent: -29, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0)
          .fromTo("[data-bunch]", { rotation: 7 }, { rotation: -5, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 2, svgOrigin: `${TIE.x} ${TIE.y}` }, 0);

        // 2 · pop! pop! pop! — each pop lets the set dip and tilt
        const popAt = [3.5, 3.85, 4.2];
        popAt.forEach((t, i) => {
          const b = `[data-balloon="${i}"]`;
          tl.to(`${b} [data-body]`, { scale: 1.18, duration: 0.12, ease: "power2.out", transformOrigin: "50% 50%" }, t - 0.12)
            .set(`${b} [data-body]`, { opacity: 0 }, t)
            .set(`${b} [data-burst]`, { opacity: 1 }, t)
            .to(`${b} [data-shard]`, {
              x: (k: number, el: Element) => Number((el as SVGElement).dataset.dx),
              y: (k: number, el: Element) => Number((el as SVGElement).dataset.dy) + 40,
              rotation: "+=180",
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
            }, t)
            .fromTo(`${b} [data-pop]`, { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(3)" }, t)
            .to(`${b} [data-pop]`, { opacity: 0, y: -30, duration: 0.35 }, t + 0.3)
            .to(`${b} [data-string]`, { y: 90, opacity: 0, duration: 0.5, ease: "power2.in" }, t)
            .to(fly, { yPercent: `+=${3 + i * 2}`, rotation: i === 1 ? -3 : 4, duration: 0.18, ease: "power2.out" }, t + 0.02);
        });

        // 3 · nothing left holding it up — fall and land with a squash
        const fall = popAt[2] + 0.2;
        tl.to(fly, { yPercent: 0, rotation: 0, duration: 0.5, ease: "power3.in" }, fall)
          .to(shadow, { scaleX: 1, opacity: 1, duration: 0.5, ease: "power3.in" }, fall)
          .to(fly, { scaleY: 0.9, scaleX: 1.05, duration: 0.09, ease: "power1.out" }, fall + 0.5)
          .to(fly, { scaleY: 1, scaleX: 1, duration: 0.7, ease: "elastic.out(1.1, 0.35)" }, fall + 0.59)
          .fromTo("[data-dust]", { scale: 0.3, opacity: 0.6 }, { scale: 1.6, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.04, immediateRender: false }, fall + 0.5)
          .set("[data-bunch]", { autoAlpha: 0 }, fall + 1);
      };

      const st = ScrollTrigger.create({ trigger: grow, start: "top 75%", once: true, onEnter: play });
      // page opened below this section → skip straight to the landed TV
      if (st.scroll() > st.end) {
        st.kill();
        land();
      }
    },
    { scope: root }
  );

  const screen = useMemo(() => {
    switch (CHANNELS[channel].layout) {
      case "showreel":
        return <ShowreelLayout reels={REELS} />;
      case "mosaic":
        return <MosaicLayout tiles={TILES} />;
      case "news":
        return <NewsLayout stories={STORIES} />;
      default:
        return (
          <DomeGallery
            key={`dome-${compact}`}
            images={DOME_IMAGES}
            fit={compact ? 0.9 : 0.85}
            minRadius={compact ? 100 : 150}
            segments={compact ? 14 : 22}
            padFactor={0.18}
            overlayBlurColor="#070605"
            imageBorderRadius={compact ? "6px" : "12px"}
            openedImageBorderRadius="16px"
            openedImageWidth=""
            openedImageHeight=""
            grayscale={false}
            dragDampening={1.4}
            autoRotateSpeed={6}
          />
        );
    }
  }, [channel, compact]);

  return (
    <section id="on-air" ref={root} className="relative overflow-hidden border-t border-line bg-paper py-24 text-ink md:py-32">
      {/* soft studio light on the wall */}
      <div className="pointer-events-none absolute left-1/2 top-[48%] h-[60vw] max-h-[760px] w-[80vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#ffffff,rgba(255,255,255,0.6)_45%,transparent)]" />

      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="eyebrow justify-center text-muted">
            Now broadcasting
          </p>
          <h2 data-reveal-words className="mt-5 text-[clamp(2rem,4.4vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.03em]">
            Stories we&apos;ve put <span className="text-brand">on air.</span>
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-lg text-[17px] leading-relaxed text-muted">
            Our work on four channels. It surfs by itself — or turn the VHF knob to change channel.
          </p>
        </div>

        {/* grow: scroll-scrubbed size · fly: the balloon intro */}
        <div data-grow className="relative mx-auto mt-28 max-w-[820px] sm:mt-16 md:mt-14">
          {/* floor shadow + landing dust */}
          <div data-shadow className="pointer-events-none absolute -bottom-[1%] left-[6%] right-[6%] h-[6%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,35,15,0.35),transparent)]" />
          <span data-dust className="pointer-events-none absolute -bottom-[2%] left-[4%] opacity-0 h-[7%] w-[18%] rounded-full bg-[#d9cfc0]/70 blur-md" />
          <span data-dust className="pointer-events-none absolute -bottom-[2%] right-[4%] opacity-0 h-[7%] w-[18%] rounded-full bg-[#d9cfc0]/70 blur-md" />

          <div
            data-fly
            ref={tvRef}
            className="relative"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") hovering.current = true;
            }}
            onPointerLeave={() => (hovering.current = false)}
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse") lastTouch.current = performance.now();
            }}
          >
            <Balloons />
            <RetroTV channels={CHANNELS} channel={channel} onChannelChange={goTo} mono={mono} onMonoChange={setMono}>
              {/* container-type lets every layout size itself in cqw/cqh of the screen */}
              <div
                key={channel}
                className="absolute inset-0 [container-type:size]"
                style={{ filter: mono ? "grayscale(1) contrast(1.08)" : "none", transition: "filter .6s ease" }}
              >
                {screen}
              </div>
            </RetroTV>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-[820px] text-center text-sm text-muted">
          <b className="font-medium text-ink">VHF</b> knob changes channel · <b className="font-medium text-ink">UHF</b> colour / B&amp;W · orange light is power
        </p>
      </div>
    </section>
  );
}