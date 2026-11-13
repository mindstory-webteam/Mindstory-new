"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  RocketLayer — rockets, exhaust smoke and shooting stars            */
/*  Rockets are DOM SVGs (crisp at any size), smoke + comets are       */
/*  drawn on one 2D canvas. A single rAF loop runs only while          */
/*  something is in flight, so it costs nothing when idle.             */
/* ------------------------------------------------------------------ */

type Vec = { x: number; y: number };

export type LaunchOptions = {
  /** start point in px, relative to the layer */
  from?: Vec;
  /** a point the rocket should pass close to (e.g. where the user clicked) */
  via?: Vec;
  /** rocket width in px (height follows the SVG ratio) */
  size?: number;
  /** flight time in seconds */
  duration?: number;
};

export type RocketLayerHandle = {
  /** launch straight up from a point (e.g. from the astronaut) */
  liftOff: (from: Vec, size?: number) => void;
  /** fly from the bottom edge through a point and out of the top */
  launchTo: (via: Vec) => void;
  /** a quick shooting star across the sky */
  comet: () => void;
};

type Rocket = {
  el: HTMLDivElement;
  p: [Vec, Vec, Vec, Vec];
  t: number;
  dur: number;
  w: number;
  h: number;
  ambient: boolean;
  smokeClock: number;
  burstAt?: number;
  burstDone?: boolean;
  via?: Vec;
};

type Puff = { x: number; y: number; vx: number; vy: number; r: number; grow: number; life: number; max: number; hot: boolean };
type Comet = { x: number; y: number; vx: number; vy: number; life: number; max: number };

const RATIO = 140 / 64;

// original rocket illustration (brand orange + soft white)
const ROCKET_SVG = `
<svg viewBox="0 0 64 140" width="100%" height="100%" aria-hidden="true">
  <g class="rk-flame">
    <path d="M21 104 Q32 146 43 104 Z" fill="#ff9a3c"/>
    <path d="M26 104 Q32 130 38 104 Z" fill="#ffe2b8"/>
  </g>
  <path d="M14 70 L2 96 L2 108 L14 101 Z" fill="#d8691a"/>
  <path d="M50 70 L62 96 L62 108 L50 101 Z" fill="#d8691a"/>
  <path d="M32 4 C48 18 52 44 50 76 L50 101 L14 101 L14 76 C12 44 16 18 32 4 Z" fill="#eeecf4"/>
  <path d="M32 4 C48 18 52 44 50 76 L50 101 L40 101 C44 70 44 34 32 4 Z" fill="#c9c5d4"/>
  <path d="M32 4 C41 12 46 22 48 32 L16 32 C18 22 23 12 32 4 Z" fill="#f6811f"/>
  <circle cx="32" cy="54" r="9.5" fill="#15131d" stroke="#f6811f" stroke-width="3"/>
  <circle cx="29" cy="51" r="3" fill="#fff" opacity=".55"/>
  <rect x="29.5" y="72" width="5" height="29" rx="2" fill="#f6811f"/>
  <rect x="18" y="99" width="28" height="8" rx="2.5" fill="#8f8b9c"/>
</svg>`;

const bez = (p: Rocket["p"], t: number): Vec => {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return { x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x, y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y };
};
const bezD = (p: Rocket["p"], t: number): Vec => {
  const u = 1 - t;
  const a = 3 * u * u, b = 6 * u * t, c = 3 * t * t;
  return {
    x: a * (p[1].x - p[0].x) + b * (p[2].x - p[1].x) + c * (p[3].x - p[2].x),
    y: a * (p[1].y - p[0].y) + b * (p[2].y - p[1].y) + c * (p[3].y - p[2].y),
  };
};
const rand = (a: number, b: number) => a + Math.random() * (b - a);

type Props = {
  className?: string;
  /** disables everything (prefers-reduced-motion) */
  reduced?: boolean;
  /** small rockets drifting across the background */
  ambient?: boolean;
  /** shooting stars every few seconds */
  comets?: boolean;
};

const RocketLayer = forwardRef<RocketLayerHandle, Props>(function RocketLayer(
  { className = "", reduced = false, ambient = true, comets = true },
  ref,
) {
  const box = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<RocketLayerHandle>({ liftOff: () => {}, launchTo: () => {}, comet: () => {} });

  useImperativeHandle(ref, () => ({
    liftOff: (from, size) => api.current.liftOff(from, size),
    launchTo: (via) => api.current.launchTo(via),
    comet: () => api.current.comet(),
  }));

  useEffect(() => {
    const host = box.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx || reduced) return;

    const view = { w: 1, h: 1, dpr: 1 };
    const rockets: Rocket[] = [];
    const puffs: Puff[] = [];
    const streaks: Comet[] = [];
    let raf = 0;
    let last = 0;
    let visible = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const resize = () => {
      view.w = host.clientWidth || 1;
      view.h = host.clientHeight || 1;
      view.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(view.w * view.dpr);
      canvas.height = Math.round(view.h * view.dpr);
    };

    const makeEl = (w: number, ambientRocket: boolean) => {
      const el = document.createElement("div");
      el.className = `rk${ambientRocket ? " rk-ambient" : ""}`;
      el.style.width = `${w}px`;
      el.style.height = `${w * RATIO}px`;
      el.innerHTML = ROCKET_SVG;
      host.appendChild(el);
      return el;
    };

    const add = (r: Omit<Rocket, "el" | "t" | "h" | "smokeClock">) => {
      rockets.push({ ...r, el: makeEl(r.w, r.ambient), t: 0, h: r.w * RATIO, smokeClock: 0 });
      wake();
    };

    const burst = (at: Vec, count = 26) => {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = rand(60, 260);
        puffs.push({ x: at.x, y: at.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: rand(1.5, 3.5), grow: 2, life: 0, max: rand(0.5, 0.9), hot: true });
      }
    };

    api.current.liftOff = (from, size = 46) => {
      const side = Math.random() < 0.5 ? -1 : 1;
      const end = { x: from.x + side * rand(view.w * 0.1, view.w * 0.35), y: -view.h * 0.35 };
      // big puff of launch smoke on the pad
      for (let i = 0; i < 30; i++) {
        puffs.push({ x: from.x + rand(-20, 20), y: from.y + rand(0, 10), vx: rand(-140, 140), vy: rand(-30, 20), r: rand(8, 16), grow: 30, life: 0, max: rand(1, 1.8), hot: false });
      }
      add({
        p: [from, { x: from.x, y: from.y - view.h * 0.45 }, { x: end.x, y: view.h * 0.1 }, end],
        dur: 2.8,
        w: size,
        ambient: false,
      });
    };

    api.current.launchTo = (via) => {
      const x0 = via.x + rand(-view.w * 0.15, view.w * 0.15);
      const start = { x: x0, y: view.h + 140 };
      const end = { x: via.x + (via.x - x0) * 0.8, y: -view.h * 0.3 };
      add({
        p: [start, { x: x0, y: view.h * 0.75 }, { x: via.x, y: via.y + 60 }, end],
        dur: 2.2,
        w: rand(30, 40),
        ambient: false,
        via,
      });
      burst(via, 18);
    };

    api.current.comet = () => {
      const fromLeft = Math.random() < 0.5;
      const speed = rand(900, 1400);
      const angle = rand(0.25, 0.5);
      streaks.push({
        x: fromLeft ? rand(-50, view.w * 0.4) : rand(view.w * 0.6, view.w + 50),
        y: rand(-20, view.h * 0.3),
        vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: rand(0.7, 1.1),
      });
      wake();
    };

    const ambientRocket = () => {
      const ltr = Math.random() < 0.5;
      const y0 = rand(view.h * 0.12, view.h * 0.55);
      const y1 = y0 + rand(-view.h * 0.25, view.h * 0.1);
      const sx = ltr ? -80 : view.w + 80;
      const ex = ltr ? view.w + 80 : -80;
      add({
        p: [
          { x: sx, y: y0 },
          { x: sx + (ex - sx) * 0.33, y: y0 - rand(40, 160) },
          { x: sx + (ex - sx) * 0.66, y: y1 + rand(-80, 80) },
          { x: ex, y: y1 },
        ],
        dur: rand(9, 13),
        w: rand(14, 22),
        ambient: true,
      });
    };

    const loop = (fn: () => void, min: number, max: number) => {
      const next = () => {
        timers.push(
          setTimeout(() => {
            if (visible && !document.hidden) fn();
            next();
          }, rand(min, max) * 1000),
        );
      };
      next();
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      ctx.clearRect(0, 0, view.w, view.h);

      // rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.t += dt / r.dur;
        const e = r.ambient ? r.t : Math.pow(Math.min(r.t, 1), 1.55); // launches accelerate
        const pos = bez(r.p, Math.min(e, 1));
        const d = bezD(r.p, Math.min(e, 1));
        const len = Math.hypot(d.x, d.y) || 1;
        const ux = d.x / len, uy = d.y / len;
        const deg = (Math.atan2(uy, ux) * 180) / Math.PI + 90;
        r.el.style.transform = `translate(${pos.x - r.w / 2}px, ${pos.y - r.h / 2}px) rotate(${deg}deg)`;

        // exhaust
        const tail = { x: pos.x - ux * r.h * 0.45, y: pos.y - uy * r.h * 0.45 };
        r.smokeClock += dt;
        const every = r.ambient ? 0.05 : 0.016;
        while (r.smokeClock > every) {
          r.smokeClock -= every;
          const k = r.w / 40;
          puffs.push({
            x: tail.x + rand(-2, 2) * k,
            y: tail.y + rand(-2, 2) * k,
            vx: -ux * rand(40, 90) + rand(-20, 20),
            vy: -uy * rand(40, 90) + rand(-20, 20),
            r: rand(3, 6) * k,
            grow: (r.ambient ? 6 : 22) * k,
            life: 0,
            max: r.ambient ? rand(0.6, 1) : rand(0.9, 1.6),
            hot: Math.random() < 0.45,
          });
        }

        if (r.t >= 1) {
          r.el.remove();
          rockets.splice(i, 1);
        }
      }

      // smoke + sparks
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        if (p.life >= p.max) {
          puffs.splice(i, 1);
          continue;
        }
        const drag = Math.pow(0.12, dt);
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.grow * dt;
        const k = 1 - p.life / p.max;
        if (p.hot) {
          ctx.globalCompositeOperation = "lighter";
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(255,214,160,${0.9 * k})`);
          g.addColorStop(0.4, `rgba(246,129,31,${0.55 * k})`);
          g.addColorStop(1, "rgba(246,129,31,0)");
          ctx.fillStyle = g;
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = `rgba(190,186,200,${0.16 * k * k})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // shooting stars
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let i = streaks.length - 1; i >= 0; i--) {
        const c = streaks[i];
        c.life += dt;
        if (c.life >= c.max) {
          streaks.splice(i, 1);
          continue;
        }
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        const k = Math.sin((c.life / c.max) * Math.PI);
        const tx = c.x - c.vx * 0.12, ty = c.y - c.vy * 0.12;
        const g = ctx.createLinearGradient(c.x, c.y, tx, ty);
        g.addColorStop(0, `rgba(255,240,220,${k})`);
        g.addColorStop(0.3, `rgba(246,129,31,${0.5 * k})`);
        g.addColorStop(1, "rgba(246,129,31,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

      if (rockets.length || puffs.length || streaks.length) raf = requestAnimationFrame(tick);
      else last = 0;
    };

    function wake() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
    });
    io.observe(host);
    resize();

    if (ambient) {
      timers.push(setTimeout(ambientRocket, 2200));
      loop(ambientRocket, 7, 12);
    }
    if (comets) loop(() => api.current.comet(), 3.5, 7);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      ro.disconnect();
      io.disconnect();
      rockets.forEach((r) => r.el.remove());
      api.current = { liftOff: () => {}, launchTo: () => {}, comet: () => {} };
    };
  }, [reduced, ambient, comets]);

  return (
    <div ref={box} className={`rk-layer ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="rk-canvas" />
      <style>{`
        .rk-layer{position:absolute;inset:0;overflow:hidden;pointer-events:none}
        .rk-canvas{position:absolute;inset:0;width:100%;height:100%}
        .rk{position:absolute;left:0;top:0;transform-origin:50% 50%;will-change:transform;filter:drop-shadow(0 0 14px rgba(246,129,31,.35))}
        .rk-ambient{opacity:.55;filter:none}
        .rk-flame{transform-origin:32px 104px;animation:rk-flicker .09s ease-in-out infinite alternate}
        @keyframes rk-flicker{from{transform:scaleY(.82) scaleX(.95)}to{transform:scaleY(1.15) scaleX(1.05)}}
      `}</style>
    </div>
  );
});

export default RocketLayer;