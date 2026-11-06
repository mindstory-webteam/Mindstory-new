"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TEAM, type TeamMember } from "@/lib/team";

/**
 * "Meet the team" — a full-width, light, expanding portrait wall.
 *
 * Faces sit small and black-and-white. Under the cursor they grow, regain
 * colour and push their neighbours outwards (a fisheye), and the nearest
 * face shows its name and role.
 *
 * • Mouse: move over the wall.
 * • Touch: tap a face (tap outside to reset).
 * • Keyboard: Tab through the faces.
 * • Reduced motion: no growth/movement, colour + label only.
 *
 * The wall spans the full screen width and is at least `minRows` rows tall.
 * With `fill` on (default) people repeat to complete the rows, so the wall is
 * always a clean rectangle; repeats are hidden from keyboard and screen readers.
 */

type Props = {
  members?: TeamMember[];
  eyebrow?: string;
  title?: React.ReactNode;
  desc?: string;
  id?: string;
  /** repeat faces so every row is complete (default true) */
  fill?: boolean;
  /** the wall always has at least this many rows; faces repeat to fill them (default 4) */
  minRows?: number;
  /** small stats shown under the heading */
  stats?: { value: string; label: string }[];
};

const MAX_SCALE = 2.5; // size of the face right under the cursor
const RADIUS = 3.2; // influence radius, in tile widths
const PUSH = 0.5; // how strongly neighbours move away

const smooth = (t: number) => t * t * (3 - 2 * t);
const initials = (n: string) =>
  n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

export default function TeamGrid({
  members = TEAM,
  eyebrow = "The team",
  title = (
    <>
      The minds behind <em>Mindstory.</em>
    </>
  ),
  desc = "Strategists, designers, writers, editors and media buyers — one close team that loves turning brands into stories.",
  id = "team",
  fill = true,
  minRows = 4,
  stats = [
    { value: "30+", label: "People" },
    { value: "2", label: "Studios in Kerala" },
    { value: "10+", label: "Years together" },
  ],
}: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLElement | null)[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const point = useRef<{ x: number; y: number } | null>(null);
  const reduced = useRef(false);
  const activeRef = useRef(-1);

  const [active, setActive] = useState(-1); // slot index
  const [broken, setBroken] = useState<Record<number, boolean>>({}); // by member index
  const [cols, setCols] = useState(0);

  const n = members.length;
  // number of tiles on the wall: every member, plus repeats to finish the last row
  // and to reach at least `minRows` full rows
  const rows = cols > 0 ? Math.max(minRows, Math.ceil(n / cols)) : 0;
  const total = fill && cols > 0 ? Math.max(n, rows * cols) : n;
  // which person sits in a slot; repeats are shuffled (stride 7) so no row copies another
  const memberAt = (slot: number) => (slot < n ? slot : ((slot - n) * 7 + 5) % n);
  
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (reduced.current = mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // how many columns fit — matches the CSS grid (auto-fill, minmax(--cell, 1fr))
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const cell = parseFloat(getComputedStyle(grid).getPropertyValue("--cell")) || 116;
      setCols(Math.max(1, Math.floor((grid.clientWidth + 0.5) / cell)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, []);

  // an image can fail before React attaches onError; catch those after mount
  useEffect(() => {
    const failed: Record<number, boolean> = {};
    tileRefs.current.forEach((el, i) => {
      const img = el?.querySelector("img");
      if (img && img.complete && img.naturalWidth === 0) failed[memberAt(i)] = true;
    });
    if (Object.keys(failed).length) setBroken((b) => ({ ...b, ...failed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, n]);

  /* ── main layout pass ─────────────────────────────── */
  const render = useCallback(() => {
    frame.current = null;
    const tiles = tileRefs.current;
    const p = point.current;
    let nearest = -1;
    let nearestD = Infinity;

    // untransformed tile size/positions (offset* ignores CSS transforms)
    const first = tiles.find(Boolean);
    const size = first?.offsetWidth || 72;
    const R = size * RADIUS;
    const gridW = gridRef.current?.clientWidth || 0;
    const narrow = window.innerWidth < 680;
    const maxScale = narrow ? 2.1 : MAX_SCALE;
    const edge = narrow ? 4 : 16; // how far a face may poke past the wall edge
    const targets: { tx: number; ty: number; scale: number }[] = [];

    tiles.forEach((el, i) => {
      if (!el) return;
      // tiles sit inside a cell; measure them relative to the wall
      const cell = el.parentElement as HTMLElement;
      const cx = cell.offsetLeft + el.offsetLeft + el.offsetWidth / 2;
      const cy = cell.offsetTop + el.offsetTop + el.offsetHeight / 2;

      if (!p) {
        el.style.transform = "";
        el.style.setProperty("--c", "0");
        cell.style.zIndex = "";
        return;
      }

      const dx = cx - p.x;
      const dy = cy - p.y;
      const d = Math.hypot(dx, dy);
      if (d < nearestD) {
        nearestD = d;
        nearest = i;
      }

      const f = smooth(Math.max(0, 1 - d / R)); // 1 at cursor → 0 at radius
      const colour = Math.min(1, f * 1.6);

      if (reduced.current) {
        el.style.transform = "";
        targets[i] = { tx: 0, ty: 0, scale: 1 };
      } else {
        const scale = 1 + (maxScale - 1) * f;
        // fisheye: move away from the cursor, strongest at mid-distance
        const pushF = smooth(Math.max(0, 1 - d / (R * 1.6))) * PUSH;
        let tx = d > 0 ? dx * pushF : 0;
        const ty = d > 0 ? dy * pushF : 0;
        // keep the grown face on screen sideways
        const half = (el.offsetWidth * scale) / 2;
        const minTx = half - cx - edge;
        const maxTx = gridW + edge - half - cx;
        if (minTx <= maxTx) tx = Math.min(Math.max(tx, minTx), maxTx);
        targets[i] = { tx, ty, scale };
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      }
      el.style.setProperty("--c", colour.toFixed(3));
      cell.style.zIndex = String(Math.round(f * 100) + 1);
    });

    // only show the label when the cursor is actually close to a face
    const show = p && nearest >= 0 && nearestD < size * 1.6;
    const idx = show ? nearest : -1;

    // floating name label under the nearest face
    const label = labelRef.current;
    const el = idx >= 0 ? tiles[idx] : null;
    if (label) {
      if (el) {
        const cell = el.parentElement as HTMLElement;
        const t = targets[idx] || { tx: 0, ty: 0, scale: 1 };
        const lw = label.offsetWidth || 180;
        const cx = cell.offsetLeft + el.offsetLeft + el.offsetWidth / 2;
        const cy = cell.offsetTop + el.offsetTop + el.offsetHeight / 2;
        const x = Math.min(Math.max(cx + t.tx, lw / 2 + 4), gridW - lw / 2 - 4);
        const y = cy + t.ty + (el.offsetHeight * t.scale) / 2 + 14;
        label.style.transform = `translate3d(${x}px, ${y}px, 0) translateX(-50%)`;
        label.dataset.show = "true";
      } else {
        label.dataset.show = "false";
      }
    }

    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, []);

  const schedule = useCallback(() => {
    if (frame.current == null) frame.current = requestAnimationFrame(render);
  }, [render]);

  const toLocal = (clientX: number, clientY: number) => {
    const r = gridRef.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };

  /* ── input ───────────────────────────────────────── */
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return; // touch uses taps
    point.current = toLocal(e.clientX, e.clientY);
    schedule();
  };

  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    point.current = null;
    schedule();
  };

  const focusTile = (i: number) => {
    const el = tileRefs.current[i];
    if (!el) return;
    const cell = el.parentElement as HTMLElement;
    point.current = {
      x: cell.offsetLeft + el.offsetLeft + el.offsetWidth / 2,
      y: cell.offsetTop + el.offsetTop + el.offsetHeight / 2,
    };
    schedule();
  };

  const onTileClick = (i: number, e: React.MouseEvent) => {
    const m = members[memberAt(i)];
    // touch: first tap magnifies, second tap opens the link (if any)
    if (activeRef.current !== i) {
      e.preventDefault();
      focusTile(i);
      return;
    }
    if (!m.href) e.preventDefault();
  };

  // reset on outside tap / Escape; re-layout on resize
  useEffect(() => {
    const reset = () => {
      point.current = null;
      schedule();
    };
    const onDown = (e: PointerEvent) => {
      if (!gridRef.current?.contains(e.target as Node)) reset();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && reset();
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", schedule);
      // cancel AND clear — a stale id here would block every future frame
      // (this is what froze the effect after Fast Refresh / Strict Mode remounts)
      if (frame.current != null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [schedule]);

  // the wall gained/lost filler tiles — forget old refs and re-layout
  useEffect(() => {
    tileRefs.current.length = total;
    schedule();
  }, [total, schedule]);

  // once the label shows the new name, its width changes — place it again
  useEffect(() => {
    if (active >= 0) schedule();
  }, [active, schedule]);

  const current = active >= 0 ? members[memberAt(active)] : null;

  return (
    <section className="tg-section" id={id} aria-labelledby={`${id}-title`}>
      <style>{CSS}</style>

      <div className="tg-head">
        <div>
          <span className="tg-eyebrow">{eyebrow}</span>
          <h2 className="tg-title" id={`${id}-title`}>{title}</h2>
        </div>
        <div className="tg-head-side">
          <p className="tg-desc">{desc}</p>
          {stats.length > 0 && (
            <dl className="tg-stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <div className="tg-stage">
        <div ref={gridRef} className="tg-grid" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
          {Array.from({ length: total }, (_, i) => {
            const mi = memberAt(i);
            const m = members[mi];
            const repeat = i >= n; // filler copy to complete the last row
            const Tag = m.href ? "a" : "button";
            return (
              <div className="tg-cell" key={i}>
                <Tag
                  ref={(el: HTMLElement | null) => {
                    tileRefs.current[i] = el;
                  }}
                  className="tg-tile"
                  {...(m.href
                    ? { href: m.href, target: "_blank", rel: "noopener noreferrer" }
                    : { type: "button" as const })}
                  aria-label={`${m.name}, ${m.role}`}
                  {...(repeat ? { tabIndex: -1, "aria-hidden": true } : {})}
                  onFocus={() => focusTile(i)}
                  onClick={(e: React.MouseEvent) => onTileClick(i, e)}
                >
                  {m.image && !broken[mi] ? (
                    // plain <img>: tiny files, filter + transform animate cheaply
                    <img
                      src={m.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      onError={() => setBroken((b) => ({ ...b, [mi]: true }))}
                    />
                  ) : (
                    <span className="tg-initials" aria-hidden="true">{initials(m.name)}</span>
                  )}
                </Tag>
              </div>
            );
          })}

          <div ref={labelRef} className="tg-label" data-show="false" aria-hidden="true">
            <b>{current?.name}</b>
            <span>{current?.role}</span>
          </div>
        </div>
      </div>

      <div className="tg-foot">
        <span className="tg-hint">
          <i aria-hidden="true" />
          <span className="tg-hint-desk">Move across the wall to meet the team</span>
          <span className="tg-hint-touch">Tap a face to meet the team</span>
        </span>
      </div>

      {/* screen readers hear who is focused */}
      <p className="tg-sr" aria-live="polite">{current ? `${current.name}, ${current.role}` : ""}</p>
    </section>
  );
}

const CSS = `
.tg-section {
  --tg-orange: #F5811D;
  --tg-ink: #121212;
  --tg-muted: #6B6760;
  --tg-paper: #F6F3EE;
  --tg-line: #E4DED4;
  --tile: 80px;
  --cell: 116px;               /* tile + breathing room; sets how many columns fit */
  --side: clamp(20px, 4vw, 64px);
  position: relative; overflow: hidden; color: var(--tg-ink);
  background:
    radial-gradient(60% 70% at 50% 62%, rgba(245,129,29,.10) 0%, rgba(245,129,29,0) 70%),
    linear-gradient(180deg, #FBF9F6 0%, var(--tg-paper) 100%);
  padding: 120px 0 90px;
  isolation: isolate;
}
/* fine dot grid + film grain for a print-like, premium finish */
.tg-section::before {
  content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background-image: radial-gradient(rgba(18,18,18,.07) 1px, transparent 1.2px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(80% 70% at 50% 60%, #000 30%, transparent 85%);
  mask-image: radial-gradient(80% 70% at 50% 60%, #000 30%, transparent 85%);
}
.tg-section::after {
  content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: .35; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── heading ── */
.tg-head {
  display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: end;
  padding: 0 var(--side); margin-bottom: 30px;
}
.tg-eyebrow {
  display: inline-flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700;
  letter-spacing: .22em; text-transform: uppercase; color: var(--tg-muted);
}
.tg-eyebrow::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: var(--tg-orange); box-shadow: 0 0 0 4px rgba(245,129,29,.14); }
.tg-title { margin: 18px 0 0; font-size: clamp(38px, 5.6vw, 84px); line-height: .98; letter-spacing: -0.045em; font-weight: 800; }
.tg-title em { font-style: normal; color: var(--tg-orange); }
.tg-head-side { display: grid; gap: 26px; justify-items: start; }
.tg-desc { margin: 0; max-width: 440px; color: var(--tg-muted); font-size: 17px; line-height: 1.65; }
.tg-stats {
  display: flex; margin: 0; border: 1px solid var(--tg-line); border-radius: 18px;
  background: rgba(255,255,255,.7); backdrop-filter: blur(8px); box-shadow: 0 10px 30px -18px rgba(18,12,4,.25);
}
.tg-stats div { padding: 14px 22px; display: flex; flex-direction: column-reverse; gap: 4px; }
.tg-stats div + div { border-left: 1px solid var(--tg-line); }
.tg-stats dt { font-size: 12px; color: var(--tg-muted); font-weight: 600; letter-spacing: .02em; }
.tg-stats dd { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }

/* ── the wall: full width, edge to edge ── */
.tg-stage { padding: 80px var(--side); }
.tg-grid {
  position: relative; display: grid; width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(var(--cell), 1fr));
  row-gap: calc(var(--cell) - var(--tile));
  touch-action: manipulation; user-select: none;
}
.tg-cell { position: relative; display: grid; place-items: center; }

.tg-tile {
  --c: 0;
  position: relative; display: block; width: var(--tile); aspect-ratio: 1; padding: 0; border: 0; cursor: pointer;
  border-radius: 18px; overflow: hidden; background: #E9E4DB;
  transform-origin: center; will-change: transform;
  transition: transform .42s cubic-bezier(.16,1,.3,1), box-shadow .35s;
  /* hairline frame + soft lift, deepening as the face grows */
  box-shadow:
    0 0 0 1px rgba(18,18,18,.06),
    0 calc(2px + var(--c) * 18px) calc(6px + var(--c) * 36px) calc(var(--c) * -10px) rgba(30,20,8,calc(.10 + var(--c) * .18));
  outline: none;
}
.tg-tile::after { /* inner highlight like a printed photo */
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.55);
}
.tg-tile img {
  width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;
  filter: grayscale(calc(1 - var(--c))) contrast(calc(.95 + var(--c) * .07)) brightness(calc(1.04 - var(--c) * .04));
  opacity: calc(.82 + var(--c) * .18);
  transition: filter .35s, opacity .35s;
}
.tg-tile:focus-visible { box-shadow: 0 0 0 3px #fff, 0 0 0 5px var(--tg-orange), 0 20px 40px -12px rgba(30,20,8,.3); }
.tg-initials {
  width: 100%; height: 100%; display: grid; place-items: center; font-weight: 800; font-size: 22px; letter-spacing: -0.03em;
  color: rgba(255,255,255,calc(.85 + var(--c) * .15));
  background:
    radial-gradient(circle at 30% 22%, rgba(255,200,150,calc(.55 + var(--c) * .45)), transparent 60%),
    linear-gradient(145deg, rgba(245,129,29,calc(.45 + var(--c) * .55)), rgba(196,92,10,calc(.55 + var(--c) * .45)));
  transition: background .35s;
}

/* ── floating name label ── */
.tg-label {
  position: absolute; left: 0; top: 0; z-index: 200; pointer-events: none;
  display: flex; flex-direction: column; align-items: center; gap: 3px; white-space: nowrap;
  background: rgba(255,255,255,.94); backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid rgba(18,18,18,.06); border-radius: 16px; padding: 10px 18px 11px;
  box-shadow: 0 18px 40px -14px rgba(30,20,8,.35), 0 4px 12px -6px rgba(30,20,8,.15);
  opacity: 0; transition: opacity .2s, transform .42s cubic-bezier(.16,1,.3,1);
}
.tg-label[data-show="true"] { opacity: 1; }
.tg-label b { font-size: 15px; font-weight: 800; letter-spacing: -0.015em; color: var(--tg-ink); }
.tg-label span { font-size: 11px; color: var(--tg-orange); font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }

/* ── footer hint ── */
.tg-foot { display: flex; justify-content: center; padding: 0 var(--side); }
.tg-hint {
  display: inline-flex; align-items: center; gap: 10px; padding: 10px 18px; border-radius: 999px;
  border: 1px solid var(--tg-line); background: rgba(255,255,255,.65); backdrop-filter: blur(6px);
  color: var(--tg-muted); font-size: 13px; font-weight: 600;
}
.tg-hint i { width: 7px; height: 7px; border-radius: 50%; background: var(--tg-orange); animation: tg-pulse 1.8s ease-in-out infinite; }
@keyframes tg-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(245,129,29,.45) } 50% { box-shadow: 0 0 0 6px rgba(245,129,29,0) } }
.tg-hint-touch { display: none; }
@media (hover: none) { .tg-hint-desk { display: none; } .tg-hint-touch { display: inline; } }
.tg-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

/* ── responsive ── */
@media (max-width: 1100px) {
  .tg-section { --tile: 68px; --cell: 98px; }
  .tg-head { grid-template-columns: 1fr; gap: 24px; }
}
@media (max-width: 680px) {
  .tg-section { --tile: 54px; --cell: 74px; padding: 84px 0 64px; }
  .tg-stage { padding: 56px var(--side); }
  .tg-stats div { padding: 12px 16px; }
  .tg-stats dd { font-size: 20px; }
  .tg-desc { font-size: 16px; }
  .tg-tile { border-radius: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .tg-tile, .tg-label { transition: none; }
  .tg-hint i { animation: none; }
}
`;
