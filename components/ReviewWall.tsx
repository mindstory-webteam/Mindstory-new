
"use client";

import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Google, Star } from "./Icons";

/**
 * DriftWall, rebuilt for review cards: a tilted 3D wall whose columns drift
 * up / down at different speeds. Hovering a card pauses its column and lifts it.
 */

export type Review = { name: string; text: string };

type Props = {
  reviews: Review[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  variance?: number;
  parallax?: number;
  lift?: number;
  fade?: number;
  dim?: number;
  className?: string;
};

type ColumnMeta = { copyHeight: number; copies: number };

const columnFactor = (i: number, variance: number) => 1 + variance * ((((i * 0.6180339887 + 0.35) % 1) * 2) - 1);

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

export default function ReviewWall({
  reviews,
  columns = 5,
  tileWidth = 300,
  tileHeight = 236,
  gap = 20,
  tilt = 14,
  turn = -10,
  roll = 0,
  perspective = 1400,
  depth = 110,
  speed = 26,
  variance = 0.4,
  parallax = 0.5,
  lift = 70,
  fade = 0.55,
  dim = 0.78,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsets = useRef<number[]>([]);
  const velocities = useRef<number[]>([]);
  const hoveredCol = useRef(-1);
  const pointer = useRef({ x: 0, y: 0 });
  const damped = useRef({ x: 0, y: 0 });
  const activeRef = useRef<string | null>(null);

  const [height, setHeight] = useState(600);
  const [active, setActive] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => setHeight(e.contentRect.height || 600));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // deal reviews into columns, offset each column so neighbours don't line up
  const cols = useMemo(() => {
    const out: Review[][] = Array.from({ length: columns }, () => []);
    const n = reviews.length;
    const per = Math.max(2, Math.ceil(n / columns) + 1);
    for (let c = 0; c < columns; c++) {
      for (let k = 0; k < per; k++) out[c].push(reviews[(c * 3 + k) % n]);
    }
    return out;
  }, [reviews, columns]);

  const meta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return cols.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      return { copyHeight, copies: Math.max(2, Math.ceil((height * 1.6) / copyHeight) + 1) };
    });
  }, [cols, tileHeight, gap, height]);

  const base = useMemo(
    () => cols.map((_, c) => speed * columnFactor(c, variance) * (c % 2 === 0 ? 1 : -1)),
    [cols, speed, variance]
  );

  useEffect(() => {
    offsets.current = meta.map((m, c) => m.copyHeight * ((c * 0.37) % 1));
    velocities.current = cols.map(() => 0);
  }, [meta, cols]);

  useEffect(() => {
    let raf = 0;
    let last: number | null = null;
    const frame = (ts: number) => {
      if (last === null) last = ts;
      const dt = Math.min(0.05, Math.max(0, ts - last) / 1000);
      last = ts;

      // pointer parallax on the whole plane
      const max = parallax * 8;
      const k = 1 - Math.exp(-dt / 0.12);
      damped.current.x += (pointer.current.x * max - damped.current.x) * k;
      damped.current.y += (-pointer.current.y * max - damped.current.y) * k;
      if (planeRef.current) {
        planeRef.current.style.transform =
          `translate(-50%, -50%) scale(1.12) rotateX(${tilt + damped.current.y}deg) ` +
          `rotateY(${turn + damped.current.x}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`;
      }

      for (let c = 0; c < trackRefs.current.length; c++) {
        const m = meta[c];
        const el = trackRefs.current[c];
        if (!m || !el) continue;
        if (!reduced) {
          const target = hoveredCol.current === c ? 0 : base[c];
          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.3));
          velocities.current[c] += (target - velocities.current[c]) * ease;
          let next = (offsets.current[c] ?? 0) + velocities.current[c] * dt;
          next = ((next % m.copyHeight) + m.copyHeight) % m.copyHeight;
          offsets.current[c] = next;
        }
        el.style.transform = `translate3d(0, ${-(offsets.current[c] ?? 0)}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [base, meta, parallax, reduced, tilt, turn, roll, depth]);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;
      if (!reduced) pointer.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit?.closest?.("[data-tile-id]") as HTMLElement | null;
      const id = tile?.dataset.tileId ?? null;
      if (id === activeRef.current) return;
      activeRef.current = id;
      hoveredCol.current = tile ? Number(tile.dataset.col) : -1;
      setActive(id);
    },
    [reduced]
  );

  const onLeave = useCallback(() => {
    pointer.current = { x: 0, y: 0 };
    activeRef.current = null;
    hoveredCol.current = -1;
    setActive(null);
  }, []);

  const edge = `${Math.max(0, (1 - fade) * 100)}%`;
  const mask =
    `radial-gradient(ellipse 78% 82% at 50% 46%, #000 ${edge}, transparent 100%), ` +
    `linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)`;

  const vars = {
    "--rw-w": `${tileWidth}px`,
    "--rw-h": `${tileHeight}px`,
    "--rw-gap": `${gap}px`,
    "--rw-lift": `${lift}px`,
    "--rw-dim": dim,
    perspective: `${perspective}px`,
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={vars}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden="true"
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex flex-row [transform-origin:50%_50%] [transform-style:preserve-3d] will-change-transform"
      >
        {cols.map((col, c) => (
          <div key={c} className="relative w-[calc(var(--rw-w)+var(--rw-gap))] [transform-style:preserve-3d]">
            <div
              ref={(el) => {
                trackRefs.current[c] = el;
              }}
              className="flex flex-col [transform-style:preserve-3d] will-change-transform"
            >
              {Array.from({ length: meta[c].copies }).map((_, copy) =>
                col.map((r, i) => {
                  const id = `${c}-${copy}-${i}`;
                  const on = active === id;
                  return (
                    <div
                      key={id}
                      data-tile-id={id}
                      data-col={c}
                      className="relative h-[calc(var(--rw-h)+var(--rw-gap))] w-full flex-none [transform-style:preserve-3d]"
                    >
                      <figure
                        className={`absolute inset-[calc(var(--rw-gap)/2)] flex flex-col justify-between rounded-3xl border bg-white p-6 transition-[transform,opacity,box-shadow,border-color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          on
                            ? "border-brand/40 opacity-100 shadow-[0_30px_60px_-20px_rgba(12,11,10,0.35)] [transform:translateZ(var(--rw-lift))]"
                            : "border-line opacity-[var(--rw-dim)] shadow-[0_10px_30px_-20px_rgba(12,11,10,0.25)] [transform:translateZ(0)]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-0.5 text-brand">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <Star key={s} className="h-3.5 w-3.5" />
                              ))}
                            </div>
                            <Google className="h-4 w-4" />
                          </div>
                          <blockquote className="mt-4 line-clamp-4 text-[15px] leading-relaxed text-ink/85">“{r.text}”</blockquote>
                        </div>
                        <figcaption className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-medium text-brand-deep">
                            {initials(r.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-ink">{r.name}</span>
                            <span className="block text-xs text-muted">Posted on Google</span>
                          </span>
                        </figcaption>
                      </figure>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}