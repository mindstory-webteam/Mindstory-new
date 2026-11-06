"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import AstronautRocket from "./AstronautRocket";
import LaunchStation from "./LaunchStation";

/**
 * The About-hero launch show:
 *   rollout → a transporter backs the rocket in from the right and raises it on the pad
 *   countdown → T-5 … T-1
 *   ignition → the whole section shakes, smoke billows
 *   ascent → the rocket climbs, the ground scrolls away, space fades in
 *   space → the rocket follows the cursor (or wanders); now and then the astronaut
 *           floats out on a tether and says hi (clicking the rocket does it too)
 */

type Phase = "idle" | "rollout" | "countdown" | "ignition" | "ascent" | "space";

/* timeline, seconds from start */
const ARRIVE = 3.6; // transporter parks at the pad
const ERECT = 6.0; // rocket raised upright
const CLAMP = 6.3; // tower arms grab it
const BEAM = 7.5; // erector lowered again
const LEAVE = 9.6; // transporter gone
const IGNITE = BEAM + 5; // 5-second countdown
const LIFT = IGNITE + 1.1; // hold-down, then release
const ORBIT = LIFT + 5; // reached space

const GREETINGS = ["Hi! 👋", "Hello from Mindstory! 👋", "Hi there! 🚀", "Hey! 👋"];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const clamp01 = (v: number) => clamp(v, 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rot = (x: number, y: number, deg: number) => {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x: x * c - y * s, y: x * s + y * c };
};
/* deterministic random so server and client render the same stars */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dims = (w: number) => {
  const mobile = w > 0 && w < 768;
  const sc = mobile ? 320 / 440 : 1; // launch-station scale
  const rw = mobile ? 70 : 90; // rocket width
  const rh = rw * 1.8; // rocket height (200 × 360 art)
  const aw = rw * 0.75; // astronaut width (matches the seated image)
  const ah = (aw * 640) / 740;
  return { mobile, sc, rw, rh, aw, ah };
};

export default function SpaceLaunch({ stationX = 0.76 }: { stationX?: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLButtonElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const streaksRef = useRef<HTMLDivElement>(null);
  const astroRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const tetherRef = useRef<SVGPathElement>(null);
  const shakeRef = useRef<Animation | null>(null);
  const reducedRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });

  const sim = useRef({
    start: 0,
    last: 0,
    phase: "idle" as Phase,
    count: 0,
    armsIn: false,
    roamInit: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    nextWalk: 0,
    pointer: { x: 0, y: 0, at: -99 },
    walk: { active: false, start: 0, side: 1, offX: 0, offY: 0 },
  });

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(5);
  const [armsIn, setArmsIn] = useState(false);
  const [seated, setSeated] = useState(true);
  const [greeting, setGreeting] = useState(GREETINGS[0]);

  const stars = useMemo(() => {
    const r = seeded(7);
    const make = (n: number, big: number) =>
      Array.from({ length: n }, () => ({
        x: r() * 100,
        y: r() * 100,
        s: 0.6 + r() * big,
        o: 0.35 + r() * 0.65,
        d: 2 + r() * 4,
        delay: r() * 5,
      }));
    return {
      far: make(110, 1.2),
      near: make(36, 2.2),
      streaks: Array.from({ length: 34 }, () => ({
        x: r() * 100,
        h: 60 + r() * 140,
        d: 0.35 + r() * 0.4,
        delay: r() * 0.8,
        o: 0.25 + r() * 0.5,
      })),
    };
  }, []);

  const startWalk = useCallback((now: number) => {
    const S = sim.current;
    const { w } = sizeRef.current;
    const { rw } = dims(w);
    const side = S.x > w * 0.55 ? -1 : 1;
    S.walk = { active: true, start: now, side, offX: side * 1.45 * rw, offY: -0.55 * rw };
    setSeated(false);
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  /* ── the animation loop ── */
  useEffect(() => {
    const S = sim.current;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nowS = performance.now() / 1000;
    S.start = reducedRef.current ? nowS - ORBIT : nowS + 0.6;

    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      sizeRef.current = { w: width, h: height };
      setSize({ w: width, h: height });
    });
    ro.observe(stage);

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || x > r.width || y < -40 || y > r.height + 40) return;
      S.pointer = { x, y, at: performance.now() / 1000 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = (ms: number) => {
      raf = requestAnimationFrame(tick);
      const now = ms / 1000;
      const dt = Math.min(0.05, Math.max(0, now - (S.last || now)));
      S.last = now;

      const ground = groundRef.current;
      const truck = truckRef.current;
      const beam = beamRef.current;
      const rocket = rocketRef.current;
      const flame = flameRef.current;
      const space = spaceRef.current;
      const streaks = streaksRef.current;
      const astro = astroRef.current;
      const bubble = bubbleRef.current;
      const tether = tetherRef.current;
      if (!ground || !truck || !beam || !rocket || !flame || !space || !streaks || !astro || !bubble || !tether) return;

      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      const { mobile, sc, rw, rh, aw, ah } = dims(w);
      const padY = h - 34 * sc; // top of the launch mount
      const sx = stationX * w;
      const t = now - S.start;

      /* coarse phase → React state (only on change) */
      const ph: Phase =
        t < 0 ? "idle" : t < BEAM ? "rollout" : t < IGNITE ? "countdown" : t < LIFT ? "ignition" : t < ORBIT ? "ascent" : "space";
      if (ph !== S.phase) {
        S.phase = ph;
        setPhase(ph);
      }
      const c = ph === "countdown" ? Math.ceil(IGNITE - t) : 0;
      if (c !== S.count) {
        S.count = c;
        if (c) setCount(c);
      }
      const arms = t >= CLAMP && t < IGNITE;
      if (arms !== S.armsIn) {
        S.armsIn = arms;
        setArmsIn(arms);
      }

      let nx: number;
      let ny: number;
      let angle: number;
      let thrust = 0;
      let walkM = 0;

      if (ph !== "space") {
        /* ── on the ground ── */
        S.roamInit = false;
        let hx: number; // transporter hinge x
        if (t < ARRIVE) hx = lerp(w + 40, sx, easeOut(clamp01(t / ARRIVE)));
        else if (t < BEAM) hx = sx;
        else hx = lerp(sx, w + 40, easeIn(clamp01((t - BEAM) / (LEAVE - BEAM))));
        const moving = (t > 0 && t < ARRIVE) || (t > BEAM && t < LEAVE);
        const bump = moving ? Math.sin(t * 28) * 0.8 : 0;
        truck.style.transform = `translate3d(${hx - 14 * sc}px, ${bump}px, 0)`;
        truck.style.visibility = t < LEAVE ? "visible" : "hidden";

        angle = t < ARRIVE ? 90 : t < ERECT ? 90 * (1 - easeInOut((t - ARRIVE) / (ERECT - ARRIVE))) : 0;
        const beamA = t < ERECT ? angle : t < CLAMP ? 0 : 90 * easeInOut(clamp01((t - CLAMP) / (BEAM - CLAMP)));
        const raise = (a: number) => padY - rw * 0.5 * (a / 90); // lying rocket rests on the bed
        beam.style.transform = `translate3d(${hx - rw / 2}px, ${raise(beamA) - rh + bump}px, 0) rotate(${beamA}deg)`;
        beam.style.visibility = t < LEAVE ? "visible" : "hidden";

        nx = t < ERECT ? hx : sx;
        ny = raise(angle) + (t < ERECT ? bump : 0);

        let cam = 0;
        if (t >= IGNITE) {
          thrust = clamp01((t - IGNITE) / 0.6);
          nx += (Math.random() - 0.5) * (t < LIFT + 2 ? 3.2 : 1.2);
          if (t >= LIFT) {
            const tt = t - LIFT;
            const alt = 0.5 * (0.22 * h) * tt * tt;
            const holdY = h * 0.42 + rh * 0.5; // rocket stays here while the camera follows
            ny = Math.max(padY - alt, holdY);
            cam = Math.max(0, alt - (padY - holdY));
            thrust = 1.5;
          }
        }
        ground.style.visibility = "visible";
        ground.style.transform = `translate3d(0, ${cam}px, 0)`;
        ground.style.opacity = String(1 - clamp01(cam / (h * 0.7)));
        space.style.opacity = String(clamp01(cam / (h * 0.9)));
        streaks.style.opacity = String(t >= LIFT ? clamp01(cam / 160) * (1 - clamp01((t - (ORBIT - 1.4)) / 1.4)) : 0);
      } else {
        /* ── in space ── */
        if (!S.roamInit) {
          S.roamInit = true;
          S.x = sx;
          S.y = h * 0.42;
          S.vx = 0;
          S.vy = -60;
          S.angle = 0;
          S.nextWalk = now + 4.5;
          ground.style.visibility = "hidden";
          truck.style.visibility = "hidden";
          beam.style.visibility = "hidden";
          space.style.opacity = "1";
          streaks.style.opacity = "0";
        }

        const p = S.pointer;
        const follow = now - p.at < 3.5;
        let tx = follow ? p.x : w * ((mobile ? 0.5 : 0.66) + (mobile ? 0.3 : 0.24) * Math.sin(now * 0.21));
        let ty = follow ? p.y + rh * 0.1 : h * (0.46 + 0.26 * Math.sin(now * 0.33 + 1.2));
        tx = clamp(tx, rw, w - rw);
        ty = clamp(ty, rh * 0.6, h - rh * 0.6);
        const k = S.walk.active ? 1.4 : follow ? 3.4 : 1.1;
        const damp = 2 * Math.sqrt(k) * 0.75;
        S.vx += ((tx - S.x) * k - S.vx * damp) * dt;
        S.vy += ((ty - S.y) * k - S.vy * damp) * dt;
        S.x += S.vx * dt;
        S.y += S.vy * dt;
        S.angle += (clamp(S.vx * 0.07, -40, 40) - S.angle) * Math.min(1, dt * 5);
        angle = S.angle;
        const n = rot(0, rh / 2, angle);
        nx = S.x + n.x;
        ny = S.y + Math.sin(now * 1.6) * 4 + n.y;
        thrust = clamp(Math.hypot(S.vx, S.vy) / 320, 0.18, 1);

        /* parallax stars */
        if (farRef.current && nearRef.current) {
          const px = (follow ? p.x : w / 2) - w / 2;
          const py = (follow ? p.y : h / 2) - h / 2;
          farRef.current.style.transform = `translate3d(${px * -0.012}px, ${py * -0.012}px, 0)`;
          nearRef.current.style.transform = `translate3d(${px * -0.03}px, ${py * -0.03}px, 0)`;
        }

        /* ── spacewalk ── */
        if (!S.walk.active && now >= S.nextWalk && !reducedRef.current) startWalk(now);
        if (S.walk.active) {
          const W = S.walk;
          const wt = now - W.start;
          if (wt >= 7.4) {
            W.active = false;
            S.nextWalk = now + 12 + Math.random() * 8;
            setSeated(true);
          } else {
            walkM = wt < 1.4 ? easeOut(wt / 1.4) : wt < 6 ? 1 : 1 - easeInOut((wt - 6) / 1.4);
            // where the astronaut sits in the cockpit (image centre), in world space
            const seat = rot(-0.06 * rw, -rh + ah / 2, angle);
            const ancX = nx + seat.x;
            const ancY = ny + seat.y;
            // float beside the rocket, trailing behind its motion
            const fx = W.side * 1.45 * rw + Math.sin(now * 1.7) * 6 - S.vx * 0.14;
            const fy = -0.55 * rw + Math.cos(now * 1.3) * 8 - S.vy * 0.14;
            W.offX += (fx - W.offX) * Math.min(1, dt * 3);
            W.offY += (fy - W.offY) * Math.min(1, dt * 3);
            const ax = ancX + W.offX * walkM;
            const ay = ancY + W.offY * walkM;
            const hi = wt > 1.6 && wt < 5.6;
            const floatA = W.side * -10 + Math.sin(now * 1.1) * 10 + (hi ? Math.sin(now * 9) * 7 : 0);
            const aAng = lerp(angle, floatA, walkM);

            astro.style.transform = `translate3d(${ax - aw / 2}px, ${ay - ah / 2}px, 0) rotate(${aAng}deg)`;
            astro.style.opacity = "1";
            astro.style.zIndex = walkM < 0.35 ? "2" : "4";

            // tether: cockpit rim → astronaut's waist
            const ck = rot(0, -0.661 * rh, angle);
            const x1 = nx + ck.x;
            const y1 = ny + ck.y;
            const waist = rot(0, ah * 0.3, aAng);
            const x2 = ax + waist.x;
            const y2 = ay + waist.y;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.hypot(dx, dy) || 1;
            const sag = (16 + Math.sin(now * 1.4) * 10) * walkM;
            const cx = (x1 + x2) / 2 + (-dy / len) * sag * W.side;
            const cy = (y1 + y2) / 2 + (dx / len) * sag * W.side;
            tether.setAttribute("d", `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);

            const op = clamp01((wt - 1.5) / 0.35) * (1 - clamp01((wt - 5.4) / 0.35));
            bubble.style.transform = `translate3d(${ax}px, ${ay - ah * 0.6}px, 0) translate(-50%, -100%) scale(${0.85 + 0.15 * op})`;
            bubble.style.opacity = String(op);
          }
        }
      }

      if (walkM <= 0) {
        astro.style.opacity = "0";
        bubble.style.opacity = "0";
      }
      tether.style.opacity = walkM > 0.01 ? "1" : "0";

      rocket.style.visibility = "visible";
      rocket.style.transform = `translate3d(${nx - rw / 2}px, ${ny - rh}px, 0) rotate(${angle}deg)`;
      rocket.style.setProperty("--fly-thrust", clamp01(thrust).toFixed(3));
      flame.style.opacity = thrust > 0.01 ? "1" : "0";
      flame.style.transform = `translateX(-50%) scaleY(${(0.2 + thrust * 0.8).toFixed(3)})`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [stationX, startWalk]);

  /* ── shake the whole section at ignition ── */
  useEffect(() => {
    if (phase !== "ignition" || reducedRef.current) return;
    const section = stageRef.current?.closest("section");
    if (!section) return;
    const n = 40;
    const frames: Keyframe[] = Array.from({ length: n + 1 }, (_, i) => {
      const amp = i === 0 || i === n ? 0 : 7 * Math.sin((Math.PI * i) / n);
      const x = (Math.random() - 0.5) * 2 * amp;
      const y = (Math.random() - 0.5) * 2 * amp;
      const r = (Math.random() - 0.5) * 0.3 * (amp / 7);
      return { transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)` };
    });
    shakeRef.current?.cancel();
    shakeRef.current = section.animate(frames, { duration: 2800, easing: "linear" });
  }, [phase]);
  useEffect(() => () => shakeRef.current?.cancel(), []);

  const skip = () => {
    sim.current.start = performance.now() / 1000 - ORBIT;
  };
  const replay = () => {
    const S = sim.current;
    S.start = performance.now() / 1000 + 0.3;
    S.walk.active = false;
    S.roamInit = false;
    setSeated(true);
  };
  const onRocketClick = () => {
    const S = sim.current;
    if (S.phase === "space" && !S.walk.active) startWalk(performance.now() / 1000);
  };

  const { sc, rw, rh, aw, ah } = dims(size.w);
  const sx = stationX * size.w;
  const firing = phase === "ignition" || phase === "ascent";
  const screen =
    phase === "idle"
      ? "STANDBY"
      : phase === "rollout"
        ? armsIn
          ? "SECURED"
          : "ROLLOUT"
        : phase === "countdown"
          ? `T-00:0${count}`
          : phase === "ignition"
            ? "IGNITION"
            : "LIFTOFF";

  return (
    <div ref={stageRef} className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <style>{`
        @keyframes sl-twinkle { 0%,100% { opacity: var(--o) } 50% { opacity: calc(var(--o) * .3) } }
        @keyframes sl-streak { from { transform: translateY(-240px) } to { transform: translateY(1200px) } }
        @keyframes sl-flicker { 0%,100% { transform: scaleX(1) } 50% { transform: scaleX(.82) } }
        @keyframes sl-pop { from { opacity: 0; transform: scale(1.5) } to { opacity: 1; transform: scale(1) } }
        @keyframes sl-fade { 0%,60% { opacity: 1 } 100% { opacity: 0 } }
        .sl-pop { animation: sl-pop .35s cubic-bezier(.2,.8,.2,1) both }
        .sl-fade { animation: sl-fade 2.4s ease-out forwards }
        @media (prefers-reduced-motion: reduce) {
          .sl-star, .sl-streak, .sl-flicker { animation: none !important }
        }
      `}</style>

      {/* ── deep space backdrop (fades in during ascent) ── */}
      <div
        ref={spaceRef}
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(55% 45% at 78% 28%, rgba(246,129,31,.16), transparent 70%)," +
            "radial-gradient(50% 60% at 18% 75%, rgba(110,70,200,.22), transparent 70%)," +
            "linear-gradient(180deg, #04050a 0%, #0b0820 60%, #140a1e 100%)",
        }}
      >
        {(["far", "near"] as const).map((layer) => (
          <div key={layer} ref={layer === "far" ? farRef : nearRef} className="absolute -inset-10">
            {stars[layer].map((s, i) => (
              <span
                key={i}
                className="sl-star absolute rounded-full bg-white"
                style={
                  {
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.s,
                    height: s.s,
                    opacity: s.o,
                    "--o": s.o,
                    animation: `sl-twinkle ${s.d}s ease-in-out ${s.delay}s infinite`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ))}
        {/* ringed planet */}
        <div className="absolute right-[5%] top-[10%] h-[clamp(110px,17vw,230px)] w-[clamp(110px,17vw,230px)]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 32% 30%, #ffb46b, #f6811f 35%, #7a3108 75%, #2a1205)",
              boxShadow: "0 0 80px rgba(246,129,31,.35)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-[26%] w-[170%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border-[3px] border-white/25" />
        </div>
        {/* moon */}
        <div
          className="absolute bottom-[16%] right-[34%] h-10 w-10 rounded-full"
          style={{ background: "radial-gradient(circle at 35% 35%, #e6e3ee, #8c88a0 70%, #4a475a)" }}
        />
      </div>

      {/* speed streaks while climbing */}
      <div ref={streaksRef} className="absolute inset-0 opacity-0">
        {stars.streaks.map((s, i) => (
          <span
            key={i}
            className="sl-streak absolute top-0 w-px"
            style={{
              left: `${s.x}%`,
              height: s.h,
              opacity: s.o,
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,.8))",
              animation: `sl-streak ${s.d}s linear ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── the ground: station, transporter, countdown (scrolls away on ascent) ── */}
      <div ref={groundRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

        {(phase === "countdown" || phase === "ignition" || phase === "ascent") && (
          <div
            className="absolute top-[12%] -translate-x-1/2 text-center"
            style={{ left: `${stationX * 100}%` }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              {phase === "countdown" ? "Launch in" : "Mindstory-1"}
            </p>
            {phase === "countdown" ? (
              <p
                key={count}
                className="sl-pop mt-2 font-mono text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-none tabular-nums text-brand"
              >
                T-{count}
              </p>
            ) : (
              <p
                key={phase}
                className={`sl-pop mt-3 font-mono text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-none text-brand ${phase === "ascent" ? "sl-fade" : ""}`}
              >
                {phase === "ignition" ? "IGNITION" : "LIFTOFF!"}
              </p>
            )}
          </div>
        )}

        <div className="absolute bottom-0" style={{ left: sx - 220 * sc, width: 440 * sc }}>
          <LaunchStation armsIn={armsIn} firing={firing} screen={screen} />
        </div>

        <div
          ref={truckRef}
          className="absolute bottom-0 left-0 z-[1]"
          style={{ width: 280 * sc, height: 90 * sc, visibility: "hidden" }}
        >
          <Transporter />
        </div>
      </div>

      {/* erector beam (pivots with the rocket's base) */}
      <div
        ref={beamRef}
        className="absolute left-0 top-0 z-[1]"
        style={{ width: rw, height: rh, transformOrigin: "50% 100%", visibility: "hidden" }}
      >
        <svg
          className="absolute bottom-0"
          style={{ left: rw - 9 * sc, width: 9 * sc, height: rh * 0.92 }}
          viewBox="0 0 9 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect width="9" height="100" fill="#3a3f52" />
          <path
            d={Array.from({ length: 13 }, (_, i) => `${i ? "L" : "M"}${i % 2 ? 9 : 0} ${(i * 100) / 12}`).join(" ")}
            fill="none"
            stroke="#9a9aa2"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* tether */}
      <svg className="absolute inset-0 z-[1] h-full w-full overflow-visible" aria-hidden="true">
        <path
          ref={tetherRef}
          fill="none"
          stroke="#f1ece6"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* ── the rocket ── */}
      <button
        ref={rocketRef}
        type="button"
        onClick={onRocketClick}
        aria-label="Say hi to the Mindstory astronaut"
        className="pointer-events-auto absolute left-0 top-0 z-[3] cursor-pointer outline-none"
        style={
          {
            width: rw,
            height: rh,
            transformOrigin: "50% 100%",
            visibility: "hidden",
            "--fly-glow": "#f6811f",
            "--fly-thrust": 0,
          } as CSSProperties
        }
      >
        <div
          ref={flameRef}
          className="absolute left-1/2 top-[96%]"
          style={{ width: rw * 0.36, height: rw * 1.1, transformOrigin: "50% 0", opacity: 0 }}
        >
          <svg
            viewBox="0 0 40 100"
            preserveAspectRatio="none"
            className="sl-flicker h-full w-full"
            style={{ animation: "sl-flicker .12s linear infinite" }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="sl-flame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff4d6" />
                <stop offset=".35" stopColor="#ffb347" />
                <stop offset=".75" stopColor="#f6811f" stopOpacity=".7" />
                <stop offset="1" stopColor="#f6811f" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M4 0 Q20 6 36 0 Q30 55 20 100 Q10 55 4 0Z" fill="url(#sl-flame)" />
          </svg>
        </div>
        <AstronautRocket seated={seated} />
      </button>

      {/* ── astronaut on a spacewalk ── */}
      <div ref={astroRef} className="absolute left-0 top-0" style={{ width: aw, height: ah, opacity: 0 }}>
        <Image
          src="/astronaut-seated.webp"
          alt=""
          width={740}
          height={640}
          draggable={false}
          sizes="160px"
          className="h-full w-full max-w-none"
        />
      </div>
      <div
        ref={bubbleRef}
        className="absolute left-0 top-0 z-[5] whitespace-nowrap rounded-2xl bg-white px-4 py-2 text-sm font-medium text-ink shadow-lg"
        style={{ opacity: 0, transformOrigin: "50% 100%" }}
      >
        {greeting}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[7px] border-x-transparent border-t-white" />
      </div>

      {/* controls */}
      {phase !== "idle" && (
        <button
          type="button"
          onClick={phase === "space" ? replay : skip}
          className="pointer-events-auto absolute bottom-6 right-6 z-[7] rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur transition-colors hover:border-brand hover:text-white"
        >
          {phase === "space" ? "↻ Replay launch" : "Skip to space →"}
        </button>
      )}
    </div>
  );
}

/** Transporter-erector: backs in from the right with the rocket lying on its bed. Hinge at (14, 56). */
function Transporter() {
  return (
    <svg viewBox="0 0 280 90" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <pattern id="tr-hazard" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="10" fill="#f6811f" opacity=".7" />
        </pattern>
      </defs>
      {/* hinge + bed */}
      <rect x="4" y="50" width="20" height="14" rx="2" fill="#6f6a63" />
      <circle cx="14" cy="56" r="4" fill="#d9dde6" />
      <rect x="10" y="56" width="206" height="8" fill="#3a3f52" />
      <path d="M70 66 L112 58" stroke="#9a9aa2" strokeWidth="4" strokeLinecap="round" />
      {/* chassis */}
      <rect x="0" y="64" width="236" height="12" rx="2" fill="#2a2e3d" />
      <rect x="0" y="70" width="236" height="4" fill="url(#tr-hazard)" />
      {/* cab */}
      <path d="M222 76 V40 Q222 30 232 30 H262 Q276 30 278 46 L278 76 Z" fill="#e9e4dc" />
      <path d="M248 36 H262 Q272 36 273 48 H248 Z" fill="#0d0f16" opacity=".85" />
      <rect x="222" y="58" width="56" height="5" fill="#f6811f" />
      <circle cx="276" cy="66" r="2.2" fill="#ffd29a" />
      <rect x="226" y="24" width="10" height="4" rx="1" fill="#ff4d4d" />
      {/* wheels */}
      {[22, 48, 74, 126, 152, 200, 252].map((x) => (
        <g key={x}>
          <circle cx={x} cy="80" r="9" fill="#14161f" stroke="#4a4f60" strokeWidth="2" />
          <circle cx={x} cy="80" r="3" fill="#9a9aa2" />
        </g>
      ))}
    </svg>
  );
}