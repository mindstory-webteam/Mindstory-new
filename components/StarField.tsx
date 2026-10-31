"use client";

import { useEffect, useRef } from "react";

/**
 * "Glimmer" space background: a field of fine stars drifting toward you,
 * near ones blurring into soft bokeh, and the odd star flashing with a
 * four-point glint as it catches the light.
 */
type Props = {
  className?: string;
  /** stars on a large screen (scaled down on small ones) */
  count?: number;
  /** drift speed toward the viewer */
  speed?: number;
  /** flashes per second across the whole field */
  glintRate?: number;
};

type Star = { x: number; y: number; z: number; tint: number; size: number; tw: number; glint: number };

const TINTS = ["#ffffff", "#e6e3ff", "#cfc9ff", "#ffffff", "#ffe2c6"]; // white, lavender, a few warm (brand) ones

/** pre-rendered sprites so each frame is just drawImage calls */
function makeDot(color: string, blur: boolean) {
  const s = blur ? 64 : 16;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const r = s / 2;
  const grd = g.createRadialGradient(r, r, 0, r, r, r);
  if (blur) {
    grd.addColorStop(0, color + "cc");
    grd.addColorStop(0.35, color + "55");
    grd.addColorStop(1, color + "00");
  } else {
    grd.addColorStop(0, color);
    grd.addColorStop(0.35, color + "dd");
    grd.addColorStop(1, color + "00");
  }
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  return c;
}

function makeGlint() {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const r = s / 2;
  // soft halo
  const halo = g.createRadialGradient(r, r, 0, r, r, r * 0.45);
  halo.addColorStop(0, "rgba(255,255,255,0.9)");
  halo.addColorStop(0.25, "rgba(220,215,255,0.35)");
  halo.addColorStop(1, "rgba(220,215,255,0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, s, s);
  // four-point spikes
  const spike = (horizontal: boolean) => {
    const grd = horizontal ? g.createLinearGradient(0, r, s, r) : g.createLinearGradient(r, 0, r, s);
    grd.addColorStop(0, "rgba(255,255,255,0)");
    grd.addColorStop(0.5, "rgba(255,255,255,1)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    if (horizontal) g.fillRect(0, r - 1, s, 2);
    else g.fillRect(r - 1, 0, 2, s);
  };
  spike(true);
  spike(false);
  // bright core
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(r, r, 2.4, 0, Math.PI * 2);
  g.fill();
  return c;
}

export default function StarField({ className = "", count = 900, speed = 0.035, glintRate = 1.4 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sharp = TINTS.map((t) => makeDot(t, false));
    const soft = TINTS.map((t) => makeDot(t, true));
    const glint = makeGlint();

    let w = 1, h = 1, dpr = 1, fov = 1;
    let stars: Star[] = [];
    const spawn = (z = Math.random()): Star => ({
      x: (Math.random() * 2 - 1) * 1.6,
      y: (Math.random() * 2 - 1) * 1.1,
      z: 0.08 + z * 0.92,
      tint: Math.random() < 0.06 ? 4 : Math.floor(Math.random() * 4),
      size: 0.6 + Math.random() * 1.1,
      tw: Math.random() * Math.PI * 2,
      glint: 0,
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fov = Math.max(w, h) * 0.55;
      const n = Math.round(count * Math.min(1, (w * h) / (1440 * 900)) ** 0.7);
      if (stars.length !== n) stars = Array.from({ length: n }, () => spawn());
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // gentle parallax: the field shifts a touch against the cursor
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      look.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      look.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    let t = 0;

    function draw(dt: number) {
      ctx!.clearRect(0, 0, w, h);
      look.x += (look.tx - look.x) * Math.min(1, dt * 2);
      look.y += (look.ty - look.y) * Math.min(1, dt * 2);
      const cx = w / 2 - look.x * 18;
      const cy = h * 0.45 - look.y * 12;

      // occasional glints
      if (!reduced && Math.random() < glintRate * dt) {
        const s = stars[(Math.random() * stars.length) | 0];
        if (s.z > 0.2 && s.glint <= 0) s.glint = 1;
      }

      for (const s of stars) {
        if (!reduced) {
          s.z -= speed * dt;
          if (s.z < 0.08) Object.assign(s, spawn(1));
        }
        const px = cx + (s.x / s.z) * fov;
        const py = cy + (s.y / s.z) * fov;
        if (px < -60 || px > w + 60 || py < -60 || py > h + 60) {
          if (!reduced) Object.assign(s, spawn(0.7 + Math.random() * 0.3));
          continue;
        }
        const depth = 1 - s.z; // 0 far … 1 near
        const fadeIn = Math.min(1, (1 - s.z) / 0.15); // stars appear gently in the distance
        const twinkle = 0.75 + 0.25 * Math.sin(t * 2.2 + s.tw);

        if (s.z < 0.28) {
          // close: big soft bokeh
          const d = (s.size * 22) / (s.z * 6);
          ctx!.globalAlpha = 0.22 * fadeIn;
          ctx!.drawImage(soft[s.tint], px - d / 2, py - d / 2, d, d);
        } else {
          const d = s.size * (1.6 + depth * 3.6);
          ctx!.globalAlpha = Math.min(1, (0.3 + depth * 0.6) * twinkle * fadeIn);
          ctx!.drawImage(sharp[s.tint], px - d / 2, py - d / 2, d, d);
        }

        if (s.glint > 0) {
          // flash: quick bloom then fade, spikes slowly turning
          const k = Math.sin(s.glint * Math.PI);
          const g = (20 + depth * 40) * k;
          ctx!.globalAlpha = k;
          ctx!.save();
          ctx!.translate(px, py);
          ctx!.rotate(0.3 * (1 - s.glint));
          ctx!.drawImage(glint, -g / 2, -g / 2, g, g);
          ctx!.restore();
          s.glint -= dt / 0.9;
        }
      }
      ctx!.globalAlpha = 1;
    }

    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      draw(dt);
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [count, speed, glintRate]);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden />;
}