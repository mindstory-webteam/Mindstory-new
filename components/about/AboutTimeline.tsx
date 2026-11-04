"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import AstronautRocket from "./AstronautRocket";

/* ── icons (24×24, stroke) ─────────────────────────────────────────────── */
const icon = (children: ReactNode, cls = "h-[42%] w-[42%]") => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
    {children}
  </svg>
);
const ICONS = {
  rocket: icon(<><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>),
  camera: icon(<><path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11" /><rect x="2" y="6" width="14" height="12" rx="2" /></>),
  globe: icon(<><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  chart: icon(<><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 6-6" /><path d="M16 8h4v4" /></>),
  home: icon(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><rect x="9" y="13" width="6" height="5" rx="1" /></>),
  landmark: icon(<><path d="M3 22h18" /><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7" /><path d="m12 2 8 5H4z" /></>),
  layers: icon(<><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 12 10 5 10-5" /><path d="m2 17 10 5 10-5" /></>),
};
const TROPHY = (cls: string) =>
  icon(<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></>, cls);

type Milestone = { year: string; title: string; text: string; icon: keyof typeof ICONS };

const milestones: Milestone[] = [
  { year: "2016", title: "The beginning", text: "Mindstory starts in Thrissur and runs its first digital movie promotions.", icon: "rocket" },
  { year: "2017", title: "Media production", text: "An in-house team for shoots, edits and brand films.", icon: "camera" },
  { year: "2018", title: "Going further", text: "Music production, a dedicated e-commerce division and expansion into the GCC.", icon: "globe" },
  { year: "2019", title: "₹1 Crore in ads", text: "Managed over ₹10 million of Google Ads spend for clients.", icon: "chart" },
  { year: "2020", title: "Remote-first", text: "Moved to a work-from-home model without missing a beat.", icon: "home" },
  { year: "2021", title: "Public NCD issue", text: "Complete digital marketing for Indel Money's public NCD issue.", icon: "landmark" },
  { year: "2023", title: "Three more issues", text: "Ran campaigns for three public NCD issuances.", icon: "layers" },
];

/* the finale ("Today") — shown as the big landing section */
const today = {
  title: "10 years strong.",
  text: "From one office in Thrissur to brands across Kerala and the GCC — and we're only getting started.",
  stats: [
    { v: "400+", l: "Happy clients" },
    { v: "1,500+", l: "Campaigns" },
    { v: "30+", l: "Mindstorians" },
  ],
};

const COLORS = ["#f6811f", "#0c0b0a", "#d26c05", "#6f6a63"];

/* space stones — x/y in % of the timeline, s = size px, o = opacity.
   `m` = where it sits on phones (in the gaps between milestones), or null to hide it there. */
type StoneSpot = { x: number; y: number; s: number; o: number; m: { x: number; y: number; s: number } | null };
const STONES: StoneSpot[] = [
  { x: 84, y: 5, s: 38, o: 1, m: { x: 86, y: 14.3, s: 18 } },
  { x: 92, y: 13, s: 16, o: 0.8, m: null },
  { x: 10, y: 18, s: 30, o: 0.95, m: { x: 62, y: 28.6, s: 12 } },
  { x: 52, y: 26, s: 14, o: 0.7, m: null },
  { x: 88, y: 34, s: 46, o: 1, m: { x: 84, y: 42.9, s: 22 } },
  { x: 6, y: 47, s: 22, o: 0.85, m: null },
  { x: 58, y: 55, s: 18, o: 0.75, m: { x: 66, y: 57.1, s: 14 } },
  { x: 90, y: 63, s: 26, o: 0.9, m: null },
  { x: 14, y: 75, s: 40, o: 1, m: { x: 88, y: 71.4, s: 20 } },
  { x: 47, y: 84, s: 12, o: 0.7, m: null },
  { x: 86, y: 92, s: 32, o: 0.95, m: { x: 70, y: 85.7, s: 16 } },
];
const STARS = [
  { x: 22, y: 3, s: 4, mobile: true }, { x: 64, y: 9, s: 3, mobile: false }, { x: 40, y: 15, s: 5, mobile: false },
  { x: 76, y: 22, s: 3, mobile: true }, { x: 4, y: 30, s: 4, mobile: false }, { x: 36, y: 39, s: 3, mobile: false },
  { x: 70, y: 44, s: 5, mobile: true }, { x: 96, y: 51, s: 3, mobile: false }, { x: 26, y: 60, s: 4, mobile: false },
  { x: 66, y: 70, s: 3, mobile: true }, { x: 98, y: 79, s: 4, mobile: false }, { x: 34, y: 90, s: 5, mobile: false },
];

const STONE_PATHS = [
  "M14 3 L30 5 L39 16 L37 31 L26 39 L10 37 L2 25 L4 11 Z",
  "M10 4 L27 2 L38 12 L40 26 L31 37 L15 39 L4 30 L1 15 Z",
  "M18 2 L33 8 L39 22 L33 35 L19 40 L6 33 L1 19 L7 7 Z",
];

/** A lumpy little asteroid. */
function Stone({ shape }: { shape: number }) {
  const id = `stone-g${shape}`;
  return (
    <svg viewBox="0 0 42 42" className="h-full w-full drop-shadow-[0_6px_8px_rgba(12,11,10,0.18)]">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#d8d0c4" />
          <stop offset="55%" stopColor="#9b9389" />
          <stop offset="100%" stopColor="#5c5751" />
        </radialGradient>
      </defs>
      <path d={STONE_PATHS[shape]} fill={`url(#${id})`} strokeLinejoin="round" />
      <circle cx="15" cy="16" r="3.4" fill="#000" opacity="0.16" />
      <circle cx="27" cy="26" r="4.6" fill="#000" opacity="0.13" />
      <circle cx="26" cy="12" r="2" fill="#000" opacity="0.14" />
      <circle cx="13" cy="29" r="1.8" fill="#fff" opacity="0.25" />
    </svg>
  );
}

/* flight path: where it crosses each row (percent of width), and where it lands */
const X_DESKTOP = [30, 70];
const X_MOBILE = [14, 34];
const LAND_DESKTOP = 50;
const LAND_MOBILE = 24;

const N = milestones.length;
const ROW = 100; // svg units per row

function flightPath(xs: number[], land: number) {
  const pts = milestones.map((_, i) => ({ x: xs[i % 2], y: i * ROW + ROW / 2 }));
  let d = `M ${pts[0].x} 0 L ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    d += ` C ${a.x} ${a.y + ROW * 0.55} ${b.x} ${b.y - ROW * 0.55} ${b.x} ${b.y}`;
  }
  const last = pts[pts.length - 1];
  return d + ` C ${last.x} ${last.y + ROW * 0.4} ${land} ${N * ROW - ROW * 0.25} ${land} ${N * ROW}`;
}

/** Invisible flight path — sampled to move the rocket; nothing is drawn. */
function FlightPath({ xs, land, className }: { xs: number[]; land: number; className: string }) {
  return (
    <svg
      data-trail
      aria-hidden
      viewBox={`0 0 100 ${N * ROW}`}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
    >
      <path data-flight d={flightPath(xs, land)} fill="none" stroke="none" />
    </svg>
  );
}

/** Planet colours: [light, base, dark] */
const PLANET: Record<string, [string, string, string]> = {
  "#f6811f": ["#ffc58f", "#f6811f", "#b45a0c"],
  "#0c0b0a": ["#6d6660", "#2a2623", "#050404"],
  "#d26c05": ["#f5a75a", "#d26c05", "#7d3f02"],
  "#6f6a63": ["#c9c2b8", "#8a847c", "#45413c"],
};

/** A little planet: shaded sphere, plus rings / craters / a moon depending on the stop. */
function Planet({ color, kind, children }: { color: string; kind: number; children: ReactNode }) {
  const [hi, base, lo] = PLANET[color] ?? PLANET["#f6811f"];
  return (
    <span className="relative grid h-12 w-12 place-items-center md:h-20 md:w-20">
      {/* glow */}
      <span className="absolute inset-[-18%] rounded-full blur-xl" style={{ background: `radial-gradient(circle, ${base}55, transparent 70%)` }} />
      {/* back half of the ring */}
      {kind === 1 && (
        <span
          className="absolute left-1/2 top-1/2 h-[34%] w-[175%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-[2px] md:border-[3px]"
          style={{ borderColor: `${hi}`, clipPath: "inset(0 0 50% 0)" }}
        />
      )}
      {/* sphere */}
      <span
        className="absolute inset-0 overflow-hidden rounded-full shadow-[inset_-10px_-12px_24px_rgba(0,0,0,0.35),0_18px_36px_-14px_rgba(12,11,10,0.45)]"
        style={{ background: `radial-gradient(circle at 32% 28%, ${hi} 0%, ${base} 45%, ${lo} 100%)` }}
      >
        {/* bands */}
        <span className="absolute inset-x-0 top-[58%] h-[10%] -rotate-[12deg] bg-white/10" />
        <span className="absolute inset-x-0 top-[30%] h-[6%] -rotate-[12deg] bg-black/10" />
        {/* craters */}
        {kind === 0 && (
          <>
            <span className="absolute left-[18%] top-[62%] h-[16%] w-[16%] rounded-full bg-black/20 shadow-[inset_2px_2px_3px_rgba(0,0,0,0.3)]" />
            <span className="absolute right-[20%] top-[20%] h-[11%] w-[11%] rounded-full bg-black/15" />
            <span className="absolute bottom-[14%] right-[30%] h-[8%] w-[8%] rounded-full bg-black/15" />
          </>
        )}
      </span>
      {/* front half of the ring */}
      {kind === 1 && (
        <span
          className="absolute left-1/2 top-1/2 h-[34%] w-[175%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-[2px] md:border-[3px]"
          style={{ borderColor: `${hi}`, clipPath: "inset(50% 0 0 0)" }}
        />
      )}
      {/* orbiting moon */}
      {kind === 2 && (
        <span className="absolute inset-[-28%] animate-[spin_9s_linear_infinite]">
          <span className="absolute left-1/2 top-0 h-[16%] w-[16%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#cfc8bd)] shadow" />
        </span>
      )}
      {/* icon */}
      <span className="relative grid h-full w-full place-items-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">{children}</span>
    </span>
  );
}

export default function AboutTimeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const list = root.current!.querySelector<HTMLElement>("[data-flight-list]")!;
      const rocket = root.current!.querySelector<HTMLElement>("[data-rocket]")!;
      const flame = root.current!.querySelector<HTMLElement>("[data-flame]")!;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // sample the visible flight path once per layout (svg units → monotonic in y)
      type Sample = { x: number; y: number };
      let samples: Sample[] = [];
      let svgEl: SVGSVGElement | null = null;
      const build = () => {
        svgEl = Array.from(root.current!.querySelectorAll<SVGSVGElement>("[data-trail]")).find((s) => s.getBoundingClientRect().width > 0) ?? null;
        const path = svgEl?.querySelector<SVGPathElement>("[data-flight]");
        samples = [];
        if (!path) return;
        const L = path.getTotalLength();
        for (let i = 0; i <= 600; i++) {
          const pt = path.getPointAtLength((L * i) / 600);
          samples.push({ x: pt.x, y: pt.y });
        }
      };
      const at = (yUnits: number) => {
        let lo = 0;
        let hi = samples.length - 1;
        while (hi - lo > 1) {
          const mid = (lo + hi) >> 1;
          if (samples[mid].y <= yUnits) lo = mid;
          else hi = mid;
        }
        const a = samples[lo];
        const b = samples[hi];
        const t = b.y === a.y ? 0 : (yUnits - a.y) / (b.y - a.y);
        return { x: a.x + (b.x - a.x) * t, y: yUnits, dx: b.x - a.x, dy: b.y - a.y };
      };

      // ── rocket pose + smoke ──
      const smokeLayer = root.current!.querySelector<HTMLElement>("[data-smoke]")!;
      const pool: HTMLSpanElement[] = [];
      let poolI = 0;
      const puff = (x: number, y: number, bx: number, by: number, size: number) => {
        let el = pool[poolI];
        if (!el) {
          el = document.createElement("span");
          el.className = "absolute left-0 top-0 rounded-full";
          el.style.cssText +=
            ";background:radial-gradient(circle at 40% 35%,rgba(255,255,255,.98),rgba(226,219,208,.9) 45%,rgba(205,197,186,.55) 65%,rgba(205,197,186,0) 72%);will-change:transform,opacity";
          smokeLayer.appendChild(el);
          pool[poolI] = el;
        }
        poolI = (poolI + 1) % 46;
        el.style.width = el.style.height = `${size}px`;
        gsap.killTweensOf(el);
        gsap.fromTo(
          el,
          { x: x - size / 2, y: y - size / 2, scale: 0.35, opacity: 0.95 },
          {
            x: x - size / 2 + bx * 26 + gsap.utils.random(-14, 14),
            y: y - size / 2 + by * 26 + gsap.utils.random(-10, 10),
            scale: gsap.utils.random(1.4, 2.2),
            opacity: 0,
            duration: gsap.utils.random(1.3, 2),
            ease: "power2.out",
          }
        );
      };

      let lastP = 0;
      let dir = 1; // 1 = flying down (scrolling down), -1 = flying up
      let angle = 180; // rocket art points up at 0°, so 180° = nose down
      let lastPuff = { x: -999, y: -999 };

      const place = (p: number, emit = true) => {
        if (!samples.length || !svgEl) return;
        if (Math.abs(p - lastP) > 0.0004) dir = p > lastP ? 1 : -1;
        lastP = p;
        const W = svgEl.clientWidth;
        const H = svgEl.clientHeight;
        const pt = at(p * N * ROW);
        const px = (pt.x / 100) * W;
        const py = (pt.y / (N * ROW)) * H;

        // nose follows the direction of travel
        const tx = ((pt.dx / 100) * W) * dir;
        const ty = ((pt.dy / (N * ROW)) * H) * dir;
        let target = (Math.atan2(ty, tx) * 180) / Math.PI + 90;
        // final approach: flip upright and settle onto the pad
        const land = gsap.utils.clamp(0, 1, (p - 0.9) / 0.085);
        const ease = land * land * (3 - 2 * land);
        target = target + ((((0 - target) % 360) + 540) % 360 - 180) * ease;
        const delta = ((((target - angle) % 360) + 540) % 360) - 180;
        angle += delta * 0.22;

        const h = rocket.offsetHeight;
        const lift = (h / 2 - 12) * ease; // bottom of the rocket ends on the pad
        rocket.style.transform = `translate(${px.toFixed(1)}px, ${(py - lift).toFixed(1)}px) translate(-50%, -50%) rotate(${angle.toFixed(2)}deg)`;
        flame.style.opacity = p > 0.985 ? "0" : "1";

        // smoke from the nozzle, blown out behind the rocket
        if (!emit || p > 0.985) return;
        const r = (angle * Math.PI) / 180;
        const bx = -Math.sin(r); // "down" in rocket space → behind the nozzle
        const by = Math.cos(r);
        const nx = px + bx * (h * 0.5);
        const ny = py - lift + by * (h * 0.5);
        const gapPx = W < 600 ? 9 : 13;
        if (Math.hypot(nx - lastPuff.x, ny - lastPuff.y) > gapPx) {
          lastPuff = { x: nx, y: ny };
          puff(nx, ny, bx, by, W < 600 ? 16 : 24);
        }
      };

      build();

      if (reduced) {
        angle = 0;
        place(1, false);
        return;
      }

      // flame flicker
      gsap.to(flame, { scaleY: 1.25, scaleX: 0.85, duration: 0.08, repeat: -1, yoyo: true, ease: "sine.inOut" });

      const st = gsap.timeline({
        scrollTrigger: {
          trigger: list,
          start: "top 55%",
          end: "bottom 55%",
          scrub: 0.8,
          onRefresh: build,
        },
      });
      const prog = { p: 0 };
      st.to(prog, { p: 1, ease: "none", onUpdate: () => place(prog.p) });
      place(0, false);
      // keep easing the rotation between scroll updates
      gsap.ticker.add(tickRotate);
      function tickRotate() {
        place(prog.p, false);
      }
      return () => gsap.ticker.remove(tickRotate);

      // weightless floating: planets + stones bob, text drifts more softly
      const R = gsap.utils.random;
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, k) => {
        gsap.to(el, { y: (k % 2 ? 1 : -1) * R(7, 13), x: R(-5, 5), rotation: R(-5, 5), duration: R(2.6, 4.2), ease: "sine.inOut", yoyo: true, repeat: -1, delay: R(0, 2) });
      });
      gsap.utils.toArray<HTMLElement>("[data-float-soft]").forEach((el, k) => {
        gsap.to(el, { y: (k % 2 ? 1 : -1) * R(3, 6), duration: R(3.2, 4.8), ease: "sine.inOut", yoyo: true, repeat: -1, delay: R(0, 2) });
      });
      gsap.utils.toArray<HTMLElement>("[data-spin]").forEach((el, k) => {
        gsap.to(el, { rotation: k % 2 ? 360 : -360, duration: R(18, 40), ease: "none", repeat: -1 });
      });
      gsap.utils.toArray<HTMLElement>("[data-twinkle]").forEach((el) => {
        gsap.fromTo(el, { opacity: 0.25, scale: 0.7 }, { opacity: 1, scale: 1.25, duration: R(1.2, 2.6), ease: "sine.inOut", yoyo: true, repeat: -1, delay: R(0, 3) });
      });

      // each stop pops up as the rocket arrives
      gsap.utils.toArray<HTMLElement>("[data-pin]").forEach((pin) => {
        gsap.fromTo(
          pin,
          { scale: 0, rotate: -40, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.9,
            ease: "back.out(1.7)",
            transformOrigin: "50% 50%",
            scrollTrigger: { trigger: pin.closest("li"), start: "top 55%" },
          }
        );
      });

      // landing: the pad lights up, the finale rises in
      gsap.fromTo(
        "[data-pad-glow]",
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: "[data-finale]", start: "top 70%", end: "top 45%", scrub: true } }
      );
    },
    { scope: root }
  );

  return (
    <section id="journey" ref={root} className="overflow-hidden border-t border-line bg-paper py-24 text-ink md:py-36">
      <div className="container-x">
        {/* heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p data-reveal="true" className="eyebrow text-muted">
              Our journey
            </p>
            <h2
              data-reveal-words="true"
              className="mt-5 text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]"
            >
              Our story <span className="text-brand">so far.</span>
            </h2>
          </div>
          <p data-reveal="true" className="max-w-sm text-lg leading-relaxed text-muted">
            Fuelled by unlimited cups of coffee ☕ — and a lot of very patient clients.
          </p>
        </div>

        {/* ── flight through the years ── */}
        <ol data-flight-list className="relative mx-auto mt-16 max-w-6xl md:mt-20">
          <FlightPath xs={X_MOBILE} land={LAND_MOBILE} className="md:hidden" />
          <FlightPath xs={X_DESKTOP} land={LAND_DESKTOP} className="hidden md:block" />
          {/* space stones + stars drifting in the background */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {STARS.map((st, k) => (
              <span
                key={`s${k}`}
                data-twinkle
                className={`absolute rounded-full bg-[#c9c1b4] ${st.mobile ? "" : "hidden md:block"}`}
                style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s }}
              />
            ))}
            {STONES.map((st, k) => (
              <span
                key={`a${k}`}
                className={`absolute left-[var(--mx)] top-[var(--my)] h-[var(--ms)] w-[var(--ms)] -translate-x-1/2 -translate-y-1/2 md:left-[var(--x)] md:top-[var(--y)] md:block md:h-[var(--s)] md:w-[var(--s)] ${st.m ? "" : "hidden"}`}
                style={
                  {
                    "--x": `${st.x}%`,
                    "--y": `${st.y}%`,
                    "--s": `${st.s}px`,
                    "--mx": `${st.m?.x ?? st.x}%`,
                    "--my": `${st.m?.y ?? st.y}%`,
                    "--ms": `${st.m?.s ?? st.s}px`,
                  } as CSSProperties
                }
              >
                <span data-float className="block h-full w-full">
                <span data-spin className="block h-full w-full" style={{ opacity: st.o }}>
                  <Stone shape={k % 3} />
                </span>
                </span>
              </span>
            ))}
          </div>
          {/* smoke puffs are added here by the animation */}
          <div data-smoke aria-hidden className="pointer-events-none absolute inset-0 z-10" />

          {milestones.map((m, i) => {
            const color = COLORS[i % COLORS.length];
            const left = i % 2 === 0;
            const vars = {
              "--c": color,
              "--xm": `${X_MOBILE[i % 2]}%`,
              "--xd": `${X_DESKTOP[i % 2]}%`,
            } as CSSProperties;

            return (
              <li key={m.year} className="relative h-[260px] md:h-[320px]" style={vars}>
                <div className="absolute top-1/2 left-[var(--xm)] md:left-[var(--xd)]">
                  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div data-pin>
                      <div data-float>
                        <Planet color={color} kind={i % 3}>
                          {ICONS[m.icon]}
                        </Planet>
                      </div>
                    </div>
                  </div>
                  <p data-float-soft className="absolute left-0 top-[54px] hidden -translate-x-1/2 whitespace-nowrap text-2xl font-semibold tracking-tight text-[var(--c)] md:block">
                    {m.year}
                  </p>
                </div>

                {/* mobile text */}
                <div data-reveal="true" className="absolute left-[calc(34%+52px)] right-0 top-1/2 -translate-y-1/2 md:hidden">
                  <div data-float-soft>
                    <p className="text-xl font-semibold tracking-tight text-[var(--c)]">{m.year}</p>
                    <h3 className="mt-1 text-[15px] font-semibold uppercase tracking-[0.06em]">{m.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{m.text}</p>
                  </div>
                </div>

                {/* desktop text */}
                <div
                  data-reveal="true"
                  className={`absolute top-1/2 hidden w-[min(30%,320px)] -translate-y-1/2 md:block ${
                    left ? "right-[calc(100%-var(--xd)+100px)] text-right" : "left-[calc(var(--xd)+100px)]"
                  }`}
                >
                  <div data-float-soft>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--c)]">{m.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{m.text}</p>
                  </div>
                </div>
              </li>
            );
          })}

          {/* the rocket — flies the path as you scroll */}
          <div data-rocket aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 h-[64px] w-[36px] will-change-transform md:h-[100px] md:w-[56px]">
            <span
              data-flame
              className="absolute left-1/2 top-[94%] h-[42%] w-[38%] -translate-x-1/2 origin-top rounded-b-full bg-[radial-gradient(ellipse_at_50%_0%,#fff7d6_0%,#ffd166_25%,#f6811f_55%,rgba(246,129,31,0)_75%)] blur-[1px] transition-opacity duration-300"
            />
            <AstronautRocket />
          </div>
        </ol>

        {/* ── finale: the big "Today" section the rocket lands on ── */}
        <div data-finale className="relative mx-auto max-w-6xl">
          {/* landing pad */}
          <div className="relative z-10 h-6 left-[var(--pad-m)] md:left-[var(--pad-d)]" style={{ "--pad-m": `${LAND_MOBILE}%`, "--pad-d": `${LAND_DESKTOP}%` } as CSSProperties}>
            <span data-pad-glow className="absolute left-0 top-1/2 h-10 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/30 blur-xl" />
            <span className="absolute left-0 top-1/2 h-3 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_4px_#f7f4ef]" />
            <span className="absolute left-0 top-1/2 h-1 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand" />
          </div>

          <div className="relative -mt-3 overflow-hidden rounded-[2rem] bg-ink px-6 pb-12 pt-16 text-white md:rounded-[2.75rem] md:px-16 md:pb-16 md:pt-24">
            {/* stars + glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,.7) 50%, transparent 51%)," +
                  "radial-gradient(1px 1px at 78% 18%, rgba(255,255,255,.5) 50%, transparent 51%)," +
                  "radial-gradient(1.5px 1.5px at 34% 72%, rgba(255,255,255,.6) 50%, transparent 51%)," +
                  "radial-gradient(1px 1px at 88% 64%, rgba(255,255,255,.6) 50%, transparent 51%)," +
                  "radial-gradient(1px 1px at 56% 38%, rgba(255,255,255,.4) 50%, transparent 51%)",
                backgroundSize: "520px 520px",
              }}
            />
            <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[460px] w-[460px] rounded-full bg-brand/25 blur-[120px]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full border border-dashed border-white/10" />

            <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p data-reveal="true" className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-brand">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white">{TROPHY("h-[55%] w-[55%]")}</span>
                  Today
                </p>
                <h3
                  data-reveal-words="true"
                  className="mt-6 text-[clamp(3rem,9vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.045em]"
                >
                  10 years <span className="text-brand">strong.</span>
                </h3>
                <p data-reveal="true" className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
                  {today.text}
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="grid grid-cols-3 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10">
                  {today.stats.map((s) => (
                    <div key={s.l} data-reveal="true" className="bg-ink px-4 py-6 md:px-5 md:py-8">
                      <p className="whitespace-nowrap text-[clamp(1.4rem,2.5vw,2.2rem)] font-medium leading-none tracking-[-0.04em]">
                        {s.v.replace(/[+]/g, "")}
                        <span className="text-brand">+</span>
                      </p>
                      <p className="mt-2 text-xs text-white/55 md:text-sm">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div data-reveal="true" className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="https://mindstory.in/growth-marketing/"
                    className="group inline-flex items-center gap-3 rounded-full bg-brand py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
                  >
                    Write the next chapter with us
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                        <path d="M7 17 17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    </span>
                  </a>
                  <p className="text-sm text-white/45">…and still counting.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}