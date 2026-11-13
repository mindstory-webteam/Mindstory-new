"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  SpaceHero — first-person flight through space (Mindstory)          */
/*  You look out of a spaceship's front window while it flies forward:  */
/*  • stars stream toward you (3D projection on one canvas)             */
/*  • planets appear in the distance, grow, and pass by                 */
/*  • other rockets fly across the view, leaving exhaust trails         */
/*  • move the mouse to steer (cockpit banks with you)                  */
/*  • press & hold, or hit "Engage warp" → hyperspeed star streaks      */
/* ------------------------------------------------------------------ */

const BRAND = "#f6811f";

const ROCKET_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 140">
<path d="M21 104 Q32 146 43 104 Z" fill="#ff9a3c"/><path d="M26 104 Q32 130 38 104 Z" fill="#ffe2b8"/>
<path d="M14 70 L2 96 L2 108 L14 101 Z" fill="#d8691a"/><path d="M50 70 L62 96 L62 108 L50 101 Z" fill="#d8691a"/>
<path d="M32 4 C48 18 52 44 50 76 L50 101 L14 101 L14 76 C12 44 16 18 32 4 Z" fill="#eeecf4"/>
<path d="M32 4 C48 18 52 44 50 76 L50 101 L40 101 C44 70 44 34 32 4 Z" fill="#c9c5d4"/>
<path d="M32 4 C41 12 46 22 48 32 L16 32 C18 22 23 12 32 4 Z" fill="#f6811f"/>
<circle cx="32" cy="54" r="9.5" fill="#15131d" stroke="#f6811f" stroke-width="3"/><circle cx="29" cy="51" r="3" fill="#fff" opacity=".55"/>
<rect x="29.5" y="72" width="5" height="29" rx="2" fill="#f6811f"/><rect x="18" y="99" width="28" height="8" rx="2.5" fill="#8f8b9c"/></svg>`;
const ROCKET_RATIO = 140 / 64;

type Pal = [string, string, string];
const PLANETS: { pal: Pal; ring: boolean; bands: boolean }[] = [
  { pal: ["#ffd2a1", "#f6811f", "#6e2a07"], ring: true, bands: true }, // brand gas giant
  { pal: ["#ece7df", "#a39b90", "#2f2b26"], ring: false, bands: false }, // grey moon
  { pal: ["#c3cdff", "#5a69c9", "#1a1d4a"], ring: false, bands: true }, // blue world
  { pal: ["#ffe9c7", "#d49a55", "#4f3012"], ring: true, bands: false }, // sand planet
  { pal: ["#ffa98a", "#c2412a", "#3e0f08"], ring: false, bands: false }, // red planet
];

type Star = { x: number; y: number; z: number; warm: boolean };
type Planet = { x: number; y: number; z: number; r: number; kind: number; tilt: number; craters: { dx: number; dy: number; r: number }[] };
type Ship = { x: number; y: number; z: number; vx: number; vy: number; vz: number; size: number; life: number; smoke: number };
type Puff = { x: number; y: number; vx: number; vy: number; r: number; grow: number; life: number; max: number; hot: boolean };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ---------------- cockpit frame (SVG overlay) ---------------- */
/* preserveAspectRatio="none" stretches the frame to the hero, so the whole
   window is always visible on every screen size. */
function Cockpit() {
  const win = "M120 28 H1480 Q1562 28 1572 110 L1588 700 Q1590 770 1520 770 H80 Q10 770 12 700 L28 110 Q38 28 120 28 Z";
  const ns = { vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg className="sp-cockpit" viewBox="0 0 1600 900" preserveAspectRatio="none" overflow="visible" aria-hidden>
      <defs>
        <linearGradient id="sp-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#16130f" />
          <stop offset=".8" stopColor="#0d0b09" />
          <stop offset="1" stopColor="#060504" />
        </linearGradient>
        <linearGradient id="sp-console" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#221d18" />
          <stop offset="1" stopColor="#0b0a08" />
        </linearGradient>
      </defs>

      {/* frame with the window cut out */}
      <path d={`M-400 -400 H2000 V1300 H-400 Z ${win}`} fill="url(#sp-frame)" fillRule="evenodd" />
      {/* window gasket + brand edge light */}
      <path d={win} fill="none" stroke="#2a241e" strokeWidth="10" {...ns} />
      <path d={win} fill="none" stroke={BRAND} strokeOpacity=".55" strokeWidth="1.5" {...ns} />
      {/* slim corner struts */}
      <path className="sp-strut" d="M150 28 L164 28 L96 770 L82 770 Z" fill="#1a1612" stroke="#2c251f" {...ns} />
      <path className="sp-strut" d="M1436 28 L1450 28 L1518 770 L1504 770 Z" fill="#1a1612" stroke="#2c251f" {...ns} />

      {/* dashboard */}
      <path d="M0 800 Q800 765 1600 800 V900 H0 Z" fill="url(#sp-console)" />
      <path d="M0 800 Q800 765 1600 800" fill="none" stroke={BRAND} strokeOpacity=".4" strokeWidth="1.5" {...ns} />
      <path d="M600 900 L635 812 H965 L1000 900 Z" fill="#14110e" stroke="#2c251f" {...ns} />
    </svg>
  );
}

export default function SpaceHero({
  eyebrow = "#01 Digital Marketing Agency in Kerala",
  title = ["Stories that sell.", "Brands that launch."],
  cta = { label: "Begin your mission", href: "#contact" },
}: {
  eyebrow?: string;
  title?: [string, string];
  cta?: { label: string; href: string };
}) {
  const host = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);
  const [warp, setWarp] = useState(false);

  // shared between React handlers and the render loop
  const ctl = useRef({
    mouseX: 0,
    mouseY: 0,
    boost: false,
    warpUntil: 0,
  });

  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, []);

  /* ---------------- the flight simulation ---------------- */
  useEffect(() => {
    const elMaybe = host.current;
    const canvasMaybe = canvasRef.current;
    const ctxMaybe = canvasMaybe?.getContext("2d");
    if (!elMaybe || !canvasMaybe || !ctxMaybe) return;
    const el: HTMLElement = elMaybe;
    const canvas: HTMLCanvasElement = canvasMaybe;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    let w = 1, h = 1, dpr = 1, f = 1, cx = 0, cy = 0;
    let raf = 0, last = 0, visible = true, frame = 0;
    let speed = reduced ? 0 : 0.08;
    const cam = { x: 0, y: 0 };
    const stars: Star[] = [];
    const planets: Planet[] = [];
    const ships: Ship[] = [];
    const puffs: Puff[] = [];
    let planetTimer = 4, shipTimer = 2;

    const rocket = new Image();
    rocket.src = "data:image/svg+xml;utf8," + encodeURIComponent(ROCKET_SVG);

    const proj = (x: number, y: number, z: number) => {
      const s = f / z;
      return { x: cx + (x - cam.x) * s, y: cy + (y - cam.y) * s, s };
    };

    const newStar = (s: Star, far: boolean) => {
      s.x = rand(-2.6, 2.6);
      s.y = rand(-2, 2);
      s.z = far ? rand(0.85, 1) : rand(0.05, 1);
      s.warm = Math.random() < 0.15;
      return s;
    };

    const spawnPlanet = (z = 3) => {
      const kind = Math.floor(Math.random() * PLANETS.length);
      const side = Math.random() < 0.5 ? -1 : 1;
      planets.push({
        x: cam.x + side * rand(0.55, 1.3),
        y: cam.y + rand(-0.55, 0.35),
        z,
        r: rand(0.14, 0.38),
        kind,
        tilt: rand(-0.5, 0.5),
        craters: Array.from({ length: 6 }, () => ({ dx: rand(-0.6, 0.6), dy: rand(-0.6, 0.6), r: rand(0.06, 0.18) })),
      });
    };

    const spawnShip = () => {
      const side = Math.random() < 0.5 ? -1 : 1;
      const z = rand(0.55, 1.4);
      ships.push({
        x: cam.x + side * ((w / 2 + 120) * z) / f,
        y: cam.y + rand(-0.45, 0.25) * z,
        z,
        vx: -side * rand(0.3, 0.55) * z,
        vy: rand(-0.06, 0.04) * z,
        vz: rand(-0.12, 0.12),
        size: rand(0.03, 0.05),
        life: 0,
        smoke: 0,
      });
    };

    const resize = () => {
      w = el.clientWidth || 1;
      h = el.clientHeight || 1;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      f = Math.min(w, h) * 0.55;
      cx = w / 2;
      cy = h * 0.44; // vanishing point sits in the middle of the window
      if (!stars.length) {
        const n = Math.round(clamp((w * h) / 1800, 350, 1100));
        for (let i = 0; i < n; i++) stars.push(newStar({ x: 0, y: 0, z: 0, warm: false }, false));
        spawnPlanet(1.5);
        spawnPlanet(2.6);
      }
      draw();
    };

    const drawPlanet = (pl: Planet) => {
      const p = proj(pl.x, pl.y, pl.z);
      const R = pl.r * p.s;
      if (R < 0.6 || p.x < -R * 3 || p.x > w + R * 3 || p.y < -R * 3 || p.y > h + R * 3) return;
      const { pal, ring, bands } = PLANETS[pl.kind];
      ctx.globalAlpha = clamp((3 - pl.z) / 0.7, 0, 1);

      // atmosphere glow
      let g = ctx.createRadialGradient(p.x, p.y, R * 0.9, p.x, p.y, R * 1.7);
      g.addColorStop(0, pal[1] + "55");
      g.addColorStop(1, pal[1] + "00");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, R * 1.7, 0, Math.PI * 2);
      ctx.fill();

      const ringPass = (front: boolean) => {
        if (!ring) return;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(pl.tilt);
        ctx.strokeStyle = pal[0];
        ctx.globalAlpha *= 0.55;
        ctx.lineWidth = Math.max(1, R * 0.16);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 2.05, R * 0.5, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = Math.max(0.5, R * 0.05);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 2.45, R * 0.6, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      ringPass(false);

      // body
      g = ctx.createRadialGradient(p.x - R * 0.4, p.y - R * 0.45, R * 0.05, p.x, p.y, R * 1.02);
      g.addColorStop(0, pal[0]);
      g.addColorStop(0.45, pal[1]);
      g.addColorStop(0.85, pal[2]);
      g.addColorStop(1, "#050302");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.translate(p.x, p.y);
      ctx.rotate(pl.tilt);
      if (bands) {
        for (let i = -4; i <= 4; i++) {
          ctx.fillStyle = i % 2 ? "rgba(0,0,0,.14)" : "rgba(255,255,255,.07)";
          ctx.fillRect(-R, i * R * 0.24 - R * 0.07, R * 2, R * (0.08 + (Math.abs(i) % 3) * 0.03));
        }
      } else {
        for (const c of pl.craters) {
          ctx.fillStyle = "rgba(0,0,0,.18)";
          ctx.beginPath();
          ctx.arc(c.dx * R, c.dy * R, c.r * R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // night side
      g = ctx.createRadialGradient(p.x + R * 0.55, p.y + R * 0.55, 0, p.x + R * 0.55, p.y + R * 0.55, R * 1.6);
      g.addColorStop(0, "rgba(0,0,0,.8)");
      g.addColorStop(0.55, "rgba(0,0,0,.25)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
      ctx.fill();

      ringPass(true);
      ctx.globalAlpha = 1;
    };

    const drawShip = (s: Ship) => {
      const p = proj(s.x, s.y, s.z);
      const vzRel = s.vz - speed * 0.25;
      const q = proj(s.x + s.vx * 0.05, s.y + s.vy * 0.05, Math.max(0.02, s.z + vzRel * 0.05));
      const ang = Math.atan2(q.y - p.y, q.x - p.x) + Math.PI / 2;
      const sw = clamp(s.size * p.s, 3, 220);
      const sh = sw * ROCKET_RATIO;
      // engine glow
      const ux = Math.sin(ang), uy = -Math.cos(ang);
      const tx = p.x - ux * sh * 0.45, ty = p.y - uy * sh * 0.45;
      const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, sw * 1.2);
      g.addColorStop(0, "rgba(255,190,120,.7)");
      g.addColorStop(1, "rgba(246,129,31,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(tx, ty, sw * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      if (rocket.complete) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(ang);
        ctx.drawImage(rocket, -sw / 2, -sh / 2, sw, sh);
        ctx.restore();
      }
      return { tx, ty, ux, uy, sw };
    };

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // stars (streak length grows with speed)
      ctx.lineCap = "round";
      for (const s of stars) {
        const p = proj(s.x, s.y, s.z);
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) continue;
        const t = proj(s.x, s.y, s.z + 0.004 + speed * 0.07);
        const k = 1 - s.z;
        ctx.strokeStyle = s.warm ? `rgba(255,197,143,${0.25 + k * 0.75})` : `rgba(255,255,255,${0.2 + k * 0.8})`;
        ctx.lineWidth = 0.4 + k * 2;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(p.x + 0.01, p.y);
        ctx.stroke();
      }

      // planets + ships, far → near
      const items: { z: number; draw: () => void }[] = [
        ...planets.map((pl) => ({ z: pl.z, draw: () => drawPlanet(pl) })),
        ...ships.map((s) => ({
          z: s.z,
          draw: () => {
            const t = drawShip(s);
            (s as Ship & { tail?: typeof t }).tail = t;
          },
        })),
      ];
      items.sort((a, b) => b.z - a.z).forEach((i) => i.draw());

      // exhaust
      for (const p of puffs) {
        const k = 1 - p.life / p.max;
        if (p.hot) {
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = `rgba(246,129,31,${0.28 * k * k})`;
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = `rgba(200,190,180,${0.18 * k * k})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function tick(now: number) {
      raf = 0;
      if (!visible || document.hidden) {
        last = 0;
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      frame++;

      const c = ctl.current;
      const warping = performance.now() < c.warpUntil;
      const target = warping ? 2.2 : c.boost ? 1.2 : 0.08;
      speed += (target - speed) * Math.min(1, dt * (target > speed ? 1.6 : 1.1));

      // steer: camera drifts toward the mouse, cockpit banks
      cam.x += (c.mouseX * 0.35 - cam.x) * Math.min(1, dt * 1.8);
      cam.y += (c.mouseY * 0.2 - cam.y) * Math.min(1, dt * 1.8);
      el.style.setProperty("--mx", (cam.x / 0.35).toFixed(4));
      el.style.setProperty("--my", (cam.y / 0.2).toFixed(4));
      el.style.setProperty("--shake", warping ? "1" : "0");

      for (const s of stars) {
        s.z -= speed * dt;
        if (s.z <= 0.03) newStar(s, true);
      }

      planetTimer -= dt * (0.4 + speed * 2);
      if (planetTimer <= 0 && planets.length < 4) {
        planetTimer = rand(5, 9);
        spawnPlanet();
      }
      for (let i = planets.length - 1; i >= 0; i--) {
        const pl = planets[i];
        pl.z -= speed * 0.45 * dt;
        const p = proj(pl.x, pl.y, pl.z);
        const R = pl.r * p.s;
        if (pl.z < 0.04 || p.x + R < -w || p.x - R > w * 2 || p.y - R > h * 2 || p.y + R < -h) planets.splice(i, 1);
      }

      shipTimer -= dt;
      if (shipTimer <= 0) {
        shipTimer = rand(3, 6);
        spawnShip();
      }
      for (let i = ships.length - 1; i >= 0; i--) {
        const s = ships[i] as Ship & { tail?: { tx: number; ty: number; ux: number; uy: number; sw: number } };
        s.life += dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.z += (s.vz - speed * 0.25) * dt;
        if (s.tail) {
          s.smoke += dt;
          while (s.smoke > 0.02) {
            s.smoke -= 0.02;
            const { tx, ty, ux, uy, sw } = s.tail;
            puffs.push({
              x: tx + rand(-1, 1) * sw * 0.1,
              y: ty + rand(-1, 1) * sw * 0.1,
              vx: -ux * rand(30, 70) + rand(-12, 12),
              vy: -uy * rand(30, 70) + rand(-12, 12),
              r: sw * rand(0.08, 0.16),
              grow: sw * 0.45,
              life: 0,
              max: rand(0.5, 1.1),
              hot: Math.random() < 0.4,
            });
          }
        }
        const p = proj(s.x, s.y, s.z);
        if (s.z < 0.06 || s.z > 5 || s.life > 14 || p.x < -w * 0.6 || p.x > w * 1.6) ships.splice(i, 1);
      }
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        if (p.life >= p.max) {
          puffs.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.grow * dt;
      }

      draw();
      if (frame % 6 === 0 && velRef.current) velRef.current.textContent = Math.round(speed * 3600).toLocaleString();
      if (warping !== warpState) {
        warpState = warping;
        setWarp(warping);
      }
      raf = requestAnimationFrame(tick);
    }
    let warpState = false;

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver((e) => {
      visible = e.some((x) => x.isIntersecting);
      if (visible && !raf && !reduced) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    const onVis = () => {
      if (!document.hidden && !raf && !reduced) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);
    resize();
    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  /* ---------------- input ---------------- */
  const press = useRef({ t: 0, timer: 0 as unknown as ReturnType<typeof setTimeout> });

  const isUi = (t: EventTarget | null) => !!(t as HTMLElement | null)?.closest("a, button");

  function onMove(e: React.PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    ctl.current.mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ctl.current.mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }
  function onLeave() {
    ctl.current.mouseX = 0;
    ctl.current.mouseY = 0;
    onUp();
  }
  function onDown(e: React.PointerEvent<HTMLElement>) {
    if (isUi(e.target) || reduced) return;
    press.current.t = performance.now();
    clearTimeout(press.current.timer);
    press.current.timer = setTimeout(() => (ctl.current.boost = true), 220); // hold = boost
  }
  function onUp() {
    clearTimeout(press.current.timer);
    ctl.current.boost = false;
    press.current.t = 0;
  }
  function engageWarp() {
    if (reduced) return;
    ctl.current.warpUntil = performance.now() + 3200;
  }

  return (
    <section
      ref={host}
      className={`sp-hero${warp ? " sp-warp" : ""}${reduced ? " sp-still" : ""}`}
      aria-label="Introduction"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={onDown}
      onPointerUp={onUp}
    >
      {/* outside the window */}
      <div className="sp-space" aria-hidden />
      <canvas ref={canvasRef} className="sp-canvas" aria-hidden />

      {/* glass */}
      <div className="sp-glass" aria-hidden />

      {/* HUD content projected on the glass */}
      <div className="sp-content">
        <div className="sp-reticle" aria-hidden>
          <span /><span /><span /><span />
        </div>
        <p className="sp-eyebrow">{eyebrow}</p>
        <h1 className="sp-title">
          <span>{title[0]}</span>
          <span>{title[1]}</span>
        </h1>
        <a className="sp-cta" href={cta.href}>
          <span>{cta.label}</span>
          <span className="sp-cta-arrow" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </div>

      {/* the ship */}
      <div className="sp-cockpit-wrap">
        <Cockpit />
      </div>

      {/* dashboard instruments */}
      <div className="sp-hud sp-hud-left" aria-hidden>
        <span className="sp-hud-label">Velocity</span>
        <span className="sp-hud-value">
          <span ref={velRef}>0</span> km/s
        </span>
        <span className="sp-leds">
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} className={`sp-led sp-led-${i % 4}`} />
          ))}
        </span>
      </div>
      <div className="sp-hud sp-hud-right" aria-hidden>
        <span className="sp-hud-label">Heading</span>
        <span className="sp-hud-value">Your next customer</span>
        <span className="sp-hud-label">
          <i className="sp-blink" /> Autopilot · Mindstory
        </span>
      </div>

      <div className="sp-controls">
        <button type="button" className="sp-warp-btn" onClick={engageWarp} disabled={warp}>
          <span className="sp-warp-dot" />
          {warp ? "Warp engaged" : "Engage warp"}
        </button>
        <p className="sp-tip">Press &amp; hold to boost</p>
      </div>

      <style>{`
        .sp-hero{--mx:0;--my:0;--shake:0;position:relative;isolation:isolate;overflow:hidden;min-height:max(680px,100svh);
          background:#000;color:#fff;touch-action:pan-y;user-select:none}
        .sp-hero a,.sp-hero button{cursor:pointer}

        .sp-space{position:absolute;inset:-5%;z-index:0;
          translate:calc(var(--mx) * -10px) calc(var(--my) * -6px);
          background:
            radial-gradient(30% 26% at 50% 44%,rgba(246,129,31,.16) 0%,rgba(246,129,31,.04) 50%,transparent 75%),
            radial-gradient(28% 24% at 22% 25%,rgba(110,90,170,.10) 0%,transparent 70%),
            radial-gradient(26% 22% at 80% 30%,rgba(246,129,31,.07) 0%,transparent 70%),
            #000}
        .sp-canvas{position:absolute;inset:0;z-index:1;width:100%;height:100%;display:block}

        .sp-glass{position:absolute;inset:0;z-index:2;pointer-events:none;
          background:
            linear-gradient(115deg,transparent 30%,rgba(255,255,255,.035) 38%,transparent 46%,transparent 60%,rgba(255,255,255,.02) 66%,transparent 72%),
            radial-gradient(80% 70% at 50% 42%,transparent 60%,rgba(246,129,31,.05) 100%)}

        .sp-content{position:absolute;z-index:3;left:50%;top:44%;translate:-50% -50%;width:min(92vw,1000px);
          display:flex;flex-direction:column;align-items:center;gap:clamp(22px,3.2vw,40px);text-align:center;pointer-events:none;
          transform:translate(calc(var(--mx) * 6px), calc(var(--my) * 4px))}
        .sp-reticle{position:absolute;inset:-34px -40px;pointer-events:none}
        .sp-reticle span{position:absolute;width:22px;height:22px;border:1.5px solid rgba(246,129,31,.55)}
        .sp-reticle span:nth-child(1){left:0;top:0;border-right:0;border-bottom:0}
        .sp-reticle span:nth-child(2){right:0;top:0;border-left:0;border-bottom:0}
        .sp-reticle span:nth-child(3){left:0;bottom:0;border-right:0;border-top:0}
        .sp-reticle span:nth-child(4){right:0;bottom:0;border-left:0;border-top:0}
        .sp-eyebrow{margin:0 0 -6px;font:500 .74rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.24em;text-transform:uppercase;color:rgba(246,129,31,.85);animation:sp-up 1s both}
        .sp-title{margin:0;font-weight:600;font-size:clamp(2.3rem,4.8vw,5.4rem);line-height:1;letter-spacing:-.045em;text-shadow:0 2px 40px rgba(0,0,0,.6)}
        .sp-title span{display:block;animation:sp-up 1s cubic-bezier(.2,.8,.2,1) both}
        .sp-title span:nth-child(2){animation-delay:.12s;color:${BRAND};text-shadow:0 0 40px rgba(246,129,31,.3)}
        .sp-cta{pointer-events:auto;display:inline-flex;align-items:center;gap:22px;padding:8px 8px 8px 28px;border-radius:14px;
          background:${BRAND};color:#fff;text-decoration:none;font-weight:500;font-size:1.05rem;
          box-shadow:0 20px 50px -18px rgba(246,129,31,.6),inset 0 0 0 1px rgba(255,255,255,.14);
          transition:transform .25s,background .25s;animation:sp-up 1s .25s cubic-bezier(.2,.8,.2,1) both}
        .sp-cta:hover{transform:translateY(-2px);background:#ff9640}
        .sp-cta-arrow{display:grid;place-items:center;width:54px;height:54px;border-radius:10px;background:#000;color:#fff;transition:transform .25s}
        .sp-cta-arrow svg{width:22px;height:22px}
        .sp-cta:hover .sp-cta-arrow{transform:translateX(3px)}
        .sp-cta:focus-visible{outline:2px solid #fff;outline-offset:4px}
        @keyframes sp-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}

        /* cockpit banks against your steering, shakes a little at warp */
        .sp-cockpit-wrap{position:absolute;inset:0;z-index:4;pointer-events:none;
          transform:rotate(calc(var(--mx) * -0.5deg)) translate(calc(var(--mx) * 4px), calc(var(--my) * 3px));
          transform-origin:50% 100%}
        .sp-warp .sp-cockpit-wrap{animation:sp-shake .12s linear infinite}
        @keyframes sp-shake{50%{translate:0 1.5px}}
        .sp-cockpit{position:absolute;inset:0;width:100%;height:100%}
        /* instruments sit on the dashboard strip (bottom ~11% of the hero) */
        .sp-hud{position:absolute;z-index:5;bottom:2.2%;display:flex;flex-direction:column;gap:6px;pointer-events:none;
          font-family:ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase;
          transform:rotate(calc(var(--mx) * -0.5deg)) translate(calc(var(--mx) * 4px), calc(var(--my) * 3px))}
        .sp-hud-left{left:6%}
        .sp-hud-right{right:6%;text-align:right;align-items:flex-end}
        .sp-hud-label{display:inline-flex;align-items:center;gap:8px;font-size:.66rem;letter-spacing:.22em;color:rgba(255,255,255,.45)}
        .sp-hud-value{font-size:clamp(.95rem,1.5vw,1.35rem);font-weight:600;letter-spacing:.06em;color:${BRAND}}
        .sp-leds{display:flex;gap:5px}
        .sp-led{display:block;width:12px;height:5px;border-radius:1px;background:#3a2a1c;animation:sp-led 1.6s steps(1) infinite}
        .sp-led-1{animation-delay:.4s}.sp-led-2{animation-delay:.8s}.sp-led-3{animation-delay:1.2s}
        @keyframes sp-led{0%,60%{background:${BRAND}}61%,100%{background:#3a2a1c}}
        .sp-blink{display:inline-block;width:8px;height:8px;border-radius:50%;background:#7dff9a;animation:sp-blink 1.2s ease-in-out infinite}
        @keyframes sp-blink{50%{opacity:.25}}

        .sp-controls{position:absolute;z-index:5;left:50%;bottom:2.4%;translate:-50% 0;display:flex;flex-direction:column;align-items:center;gap:8px}
        .sp-warp-btn{display:inline-flex;align-items:center;gap:10px;padding:10px 20px;border-radius:999px;border:1px solid rgba(246,129,31,.5);
          background:rgba(20,16,12,.8);color:#fff;font:600 .78rem/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;
          box-shadow:0 0 24px -6px rgba(246,129,31,.5);transition:background .2s,box-shadow .2s}
        .sp-warp-btn:hover{background:rgba(246,129,31,.2);box-shadow:0 0 30px -4px rgba(246,129,31,.7)}
        .sp-warp-btn:disabled{background:${BRAND};cursor:default}
        .sp-warp-btn:focus-visible{outline:2px solid #fff;outline-offset:3px}
        .sp-warp-dot{width:8px;height:8px;border-radius:50%;background:${BRAND};box-shadow:0 0 10px ${BRAND}}
        .sp-warp-btn:disabled .sp-warp-dot{background:#fff}
        .sp-tip{margin:0;font:.68rem/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;color:rgba(255,255,255,.4);text-transform:uppercase}

        .sp-still .sp-title span,.sp-still .sp-cta,.sp-still .sp-eyebrow,.sp-still .sp-led,.sp-still .sp-blink{animation:none}
        .sp-still .sp-controls{display:none}

        @media (max-width:768px){
          .sp-content{top:42%}
          .sp-hud,.sp-strut,.sp-reticle{display:none}
          .sp-reticle{inset:-20px -10px}
          .sp-title{font-size:clamp(1.9rem,8.6vw,2.6rem)}
          .sp-eyebrow{font-size:.64rem;letter-spacing:.16em}
          .sp-tip{display:none}
        }
      `}</style>
    </section>
  );
}