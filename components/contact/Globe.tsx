"use client";

import { useEffect, useRef } from "react";
import { LAND_H, LAND_MASK, LAND_W } from "./landMask";

/**
 * Dotted 3D globe with animated arcs — pure canvas, no libraries.
 *
 * • Continents are drawn as fine dots (from a tiny embedded land map).
 * • Arcs fly out from the hub (Kochi, Kerala) to the places we work with,
 *   land with a pulse, then fade — on a loop.
 * • The globe sways gently around the hub; drag it to spin it yourself.
 * • Pauses when off-screen; static (no motion) for reduced-motion users.
 */

type Place = { name: string; lat: number; lon: number };

const HUB: Place = { name: "Kochi", lat: 9.93, lon: 76.26 };
const DESTINATIONS: Place[] = [
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Doha", lat: 25.29, lon: 51.53 },
  { name: "Riyadh", lat: 24.71, lon: 46.68 },
  { name: "Muscat", lat: 23.59, lon: 58.4 },
  { name: "London", lat: 51.5, lon: -0.12 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "New York", lat: 40.71, lon: -74.0 },
  { name: "Bengaluru", lat: 12.97, lon: 77.59 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
];

type Props = {
  className?: string;
  /** arc + highlight colour */
  color?: string;
  /** number of sample points on the sphere (more = denser continents) */
  density?: number;
};

const DEG = Math.PI / 180;

/* lat/lon (degrees) → unit vector; z points at the viewer when lon = 0 */
function toVec(lat: number, lon: number): [number, number, number] {
  const la = lat * DEG;
  const lo = lon * DEG;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

function decodeMask() {
  const bin = atob(LAND_MASK);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return (lat: number, lon: number) => {
    const x = Math.min(LAND_W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * LAND_W)));
    const y = Math.min(LAND_H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * LAND_H)));
    const i = y * LAND_W + x;
    return ((bytes[i >> 3] >> (i & 7)) & 1) === 1;
  };
}

/* spherical interpolation between two unit vectors */
function slerp(a: number[], b: number[], t: number) {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-5) return a.slice();
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s;
  const k2 = Math.sin(t * om) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

export default function Globe({ className = "", color = "#f6811f", density = 18000 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── land dots: Fibonacci sphere, keep the points that fall on land ── */
    const isLand = decodeMask();
    const pts: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < density; i++) {
      const y = 1 - (i / (density - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      const lat = Math.asin(y) / DEG;
      const lon = Math.atan2(x, z) / DEG;
      if (isLand(lat, lon)) pts.push(x, y, z);
    }
    const dots = new Float32Array(pts);

    /* ── arcs: precomputed paths, lifted above the surface ── */
    const hub = toVec(HUB.lat, HUB.lon);
    const SAMPLES = 72;
    const arcs = DESTINATIONS.map((d, i) => {
      const end = toVec(d.lat, d.lon);
      const ang = Math.acos(Math.min(1, hub[0] * end[0] + hub[1] * end[1] + hub[2] * end[2]));
      const lift = Math.min(0.28, 0.06 + ang * 0.16); // longer routes fly higher (capped so arcs stay in frame)
      const path: number[][] = [];
      for (let s = 0; s <= SAMPLES; s++) {
        const t = s / SAMPLES;
        const p = slerp(hub, end, t);
        const h = 1 + lift * Math.sin(Math.PI * t);
        path.push([p[0] * h, p[1] * h, p[2] * h]);
      }
      return { path, end, delay: i * 0.85 };
    });
    const CYCLE = DESTINATIONS.length * 0.85 + 1.2; // seconds before the sequence repeats
    const FLY = 1.6; // head travel time
    const HOLD = 1.1; // tail catches up / fade

    /* ── view state ── */
    const baseY = -HUB.lon * DEG; // face the hub
    const tilt = -0.32; // look slightly down on the northern hemisphere
    let yaw = baseY;
    let spin = 0; // drag velocity
    let drag: { x: number; yaw: number; t: number } | null = null;
    let w = 1;
    let h = 1;
    let dpr = 1;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── drag to spin ── */
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, yaw, t: performance.now() };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const R = Math.min(w, h) * 0.37; // glow reaches 1.32R, highest arc 1.28R — both stay inside the canvas
      const next = drag.yaw + ((e.clientX - drag.x) / R) * 1.1;
      const now = performance.now();
      spin = (next - yaw) / Math.max(0.016, (now - drag.t) / 1000);
      drag.t = now;
      yaw = next;
      if (reduced) draw(0);
    };
    const onUp = (e: PointerEvent) => {
      drag = null;
      canvas.style.cursor = "grab";
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "pan-y";

    /* rotate a point by yaw (around Y) then tilt (around X) */
    let cy = 1, sy = 0, cx = 1, sx = 0;
    const rot = (x: number, y: number, z: number): [number, number, number] => {
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      return [x1, y2, z2];
    };

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.37; // glow reaches 1.32R, highest arc 1.28R — both stay inside the canvas
      const ox = w / 2;
      const oy = h / 2;
      cy = Math.cos(yaw);
      sy = Math.sin(yaw);
      cx = Math.cos(tilt);
      sx = Math.sin(tilt);

      /* atmosphere glow */
      const glow = ctx!.createRadialGradient(ox, oy, R * 0.9, ox, oy, R * 1.32);
      glow.addColorStop(0, "rgba(255,255,255,0.10)");
      glow.addColorStop(0.35, "rgba(246,129,31,0.07)");
      glow.addColorStop(1, "rgba(246,129,31,0)");
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(ox, oy, R * 1.32, 0, Math.PI * 2);
      ctx!.fill();

      /* the sphere body */
      const body = ctx!.createRadialGradient(ox - R * 0.35, oy - R * 0.4, R * 0.1, ox, oy, R);
      body.addColorStop(0, "#17161b");
      body.addColorStop(0.7, "#0b0b0e");
      body.addColorStop(1, "#060607");
      ctx!.fillStyle = body;
      ctx!.beginPath();
      ctx!.arc(ox, oy, R, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = "rgba(255,255,255,0.08)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      /* land dots (front side only, brighter toward the centre) */
      const ds = Math.max(1, R / 230) * 1.15;
      for (let i = 0; i < dots.length; i += 3) {
        const [px, py, pz] = rot(dots[i], dots[i + 1], dots[i + 2]);
        if (pz <= 0.02) continue;
        ctx!.globalAlpha = Math.min(1, 0.15 + pz * 0.85);
        ctx!.fillStyle = "#e9e7f2";
        ctx!.fillRect(ox + px * R - ds / 2, oy - py * R - ds / 2, ds, ds);
      }
      ctx!.globalAlpha = 1;

      const project = (p: number[]) => {
        const [px, py, pz] = rot(p[0], p[1], p[2]);
        // visible if in front, or lifted outside the disc's silhouette
        const vis = pz > 0 || px * px + py * py > 1;
        return { x: ox + px * R, y: oy - py * R, z: pz, vis };
      };

      /* hub: pulsing dot */
      const hp = project(hub);
      if (hp.vis) {
        const pulse = (time % 2) / 2;
        ctx!.strokeStyle = color;
        ctx!.globalAlpha = 0.6 * (1 - pulse);
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(hp.x, hp.y, 4 + pulse * 18, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.globalAlpha = 1;
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(hp.x, hp.y, 3.6, 0, Math.PI * 2);
        ctx!.fill();
      }

      /* arcs */
      const tc = reduced ? 999 : time % CYCLE;
      for (const a of arcs) {
        const lt = reduced ? FLY + HOLD * 0.5 : tc - a.delay;
        if (lt < 0 || lt > FLY + HOLD + 0.6) continue;
        const head = Math.min(1, lt / FLY);
        const tail = Math.max(0, Math.min(1, (lt - FLY * 0.55) / HOLD));
        const fade = reduced ? 1 : 1 - Math.max(0, (lt - FLY - HOLD) / 0.6);
        const i0 = Math.floor(tail * SAMPLES);
        const i1 = Math.ceil(head * SAMPLES);
        if (i1 - i0 < 1) continue;

        ctx!.lineCap = "round";
        let prev = project(a.path[i0]);
        for (let s = i0 + 1; s <= i1; s++) {
          const cur = project(a.path[s]);
          if (prev.vis && cur.vis) {
            // brighter toward the head
            const k = (s - i0) / Math.max(1, i1 - i0);
            ctx!.strokeStyle = color;
            ctx!.globalAlpha = (0.2 + 0.8 * k) * fade;
            ctx!.lineWidth = 1.2 + k * 1.1;
            ctx!.beginPath();
            ctx!.moveTo(prev.x, prev.y);
            ctx!.lineTo(cur.x, cur.y);
            ctx!.stroke();
          }
          prev = cur;
        }

        // glowing head while flying
        if (head < 1) {
          const hd = project(a.path[i1]);
          if (hd.vis) {
            ctx!.globalAlpha = fade;
            const g = ctx!.createRadialGradient(hd.x, hd.y, 0, hd.x, hd.y, 9);
            g.addColorStop(0, "#fff4e6");
            g.addColorStop(0.35, color);
            g.addColorStop(1, "rgba(246,129,31,0)");
            ctx!.fillStyle = g;
            ctx!.beginPath();
            ctx!.arc(hd.x, hd.y, 9, 0, Math.PI * 2);
            ctx!.fill();
          }
        } else {
          // landing pulse at the destination
          const ep = project(a.end);
          if (ep.vis) {
            const p = Math.min(1, (lt - FLY) / 0.9);
            ctx!.globalAlpha = (1 - p) * fade;
            ctx!.strokeStyle = color;
            ctx!.lineWidth = 1.4;
            ctx!.beginPath();
            ctx!.arc(ep.x, ep.y, 3 + p * 14, 0, Math.PI * 2);
            ctx!.stroke();
            ctx!.globalAlpha = fade;
            ctx!.fillStyle = "#fff";
            ctx!.beginPath();
            ctx!.arc(ep.x, ep.y, 2.2, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
        ctx!.globalAlpha = 1;
      }
    }

    /* ── loop ── */
    let raf = 0;
    let last = performance.now();
    let clock = 0;
    let visible = true;
    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      if (!drag) {
        // inertia from a drag, easing back into a gentle sway around the hub
        spin *= Math.exp(-dt * 2.2);
        const sway = baseY + Math.sin(clock * 0.18) * 0.55;
        yaw += spin * dt;
        if (Math.abs(spin) < 0.05) yaw += (sway - yaw) * Math.min(1, dt * 0.6);
      }
      draw(clock);
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    resize();
    if (reduced) draw(0);
    else raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [color, density]);

  return (
    <canvas
      ref={ref}
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label="Globe showing Mindstory's reach from Kerala to the GCC, Europe, Asia and beyond"
    />
  );
}
