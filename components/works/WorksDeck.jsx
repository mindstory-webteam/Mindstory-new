"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { WORKS } from "@/data/works";

/**
 * A deck of case-study cards for the Works hero. The front card flies off to
 * the left every few seconds and the next project rises to the front.
 * Hover / focus pauses it; arrows and the progress bars jump between projects;
 * the front card links to its case study.
 */

/* poses by depth (0 = front). x / y are % of the card's own size. */
const POSES = [
  { x: 0, y: 0, r: -3, s: 1, o: 1 },
  { x: 9, y: -6, r: 4, s: 0.93, o: 0.85 },
  { x: 16, y: -11, r: 10, s: 0.86, o: 0.6 },
  { x: 21, y: -15, r: 15, s: 0.8, o: 0.28 },
];
const HIDDEN = { x: 23, y: -17, r: 18, s: 0.76, o: 0 };
const EXIT = { x: -48, y: 12, r: -18, s: 0.9, o: 0 };

const pad = (n) => String(n).padStart(2, "0");

export default function WorksDeck({ works = WORKS, interval = 3.2 }) {
  const n = works.length;
  const [front, setFront] = useState(0);
  const [reduced, setReduced] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const go = useCallback((dir) => setFront((f) => (f + dir + n) % n), [n]);

  useEffect(() => {
    if (reduced || n < 2) return;
    const id = window.setInterval(() => {
      if (!paused.current && !document.hidden) go(1);
    }, interval * 1000);
    return () => window.clearInterval(id);
  }, [reduced, n, interval, go]);

  const pose = (d) => (d < POSES.length ? POSES[d] : n > POSES.length && d === n - 1 ? EXIT : HIDDEN);
  const current = works[front];

  return (
    <div
      className="wd"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className="wd-stage">
        {works.map((w, i) => {
          const d = (i - front + n) % n;
          const p = pose(d);
          const isFront = d === 0;
          return (
            <Link
              key={w.slug}
              href={`/works/${w.slug}`}
              className="wd-card"
              tabIndex={isFront ? 0 : -1}
              aria-hidden={!isFront}
              aria-label={isFront ? `${w.client} — view case study` : undefined}
              style={{
                transform: `translate(${p.x}%, ${p.y}%) rotate(${p.r}deg) scale(${p.s})`,
                opacity: p.o,
                zIndex: d === n - 1 && n > POSES.length ? n + 1 : n - d,
                pointerEvents: isFront ? "auto" : "none",
              }}
            >
              <span className="wd-media">
                {/* plain <img> so the remote thumbnails need no next.config change */}
                <img src={w.image} alt="" loading={d < 3 ? "eager" : "lazy"} decoding="async" draggable={false} />
                <span className="wd-cat">{w.category}</span>
                <span className="wd-go" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </span>
              </span>
              <span className="wd-body">
                <span className="wd-num">
                  {pad(i + 1)} / {pad(n)}
                </span>
                <b>{w.client}</b>
                <small>{w.tagline}</small>
              </span>
            </Link>
          );
        })}

        {/* floating badges */}
        <span className="wd-chip wd-chip--a" aria-hidden="true">
          <span className="wd-stars">★★★★★</span> Rated Excellent
        </span>
        <span className="wd-chip wd-chip--b" aria-hidden="true">
          <i /> 1,500+ campaigns
        </span>
      </div>

      {/* controls */}
      <div className="wd-ctrl">
        <button type="button" className="wd-btn" onClick={() => go(-1)} aria-label="Previous project">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m11 6-6 6 6 6" />
          </svg>
        </button>
        <div className="wd-bars" role="tablist" aria-label="Projects">
          {works.map((w, i) => (
            <button
              key={w.slug}
              type="button"
              role="tab"
              aria-selected={i === front}
              aria-label={w.client}
              className={i === front ? "is-on" : ""}
              onClick={() => setFront(i)}
            />
          ))}
        </div>
        <button type="button" className="wd-btn" onClick={() => go(1)} aria-label="Next project">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* screen readers hear which project is in front */}
      <p className="wd-sr" aria-live="polite">
        {current.client}, {current.category}
      </p>
    </div>
  );
}
