"use client";

import { useEffect, useState } from "react";

/**
 * Cycles through `words` in place: the current word slides up and fades out,
 * the next one rises in. All words share one grid cell, so the line keeps the
 * width of the longest word and the layout never jumps.
 */
export default function RotatingWords({
  words,
  interval = 2600,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const n = words.length;

  useEffect(() => {
    if (n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), interval);
    return () => clearInterval(id);
  }, [n, interval]);

  return (
    <span className={`relative inline-grid whitespace-nowrap align-bottom ${className}`}>
      {/* screen readers get one stable phrase instead of a changing one */}
      <span className="sr-only">{words[0]}</span>
      {words.map((w, k) => {
        const state = k === i ? "in" : k === (i - 1 + n) % n ? "out" : "next";
        return (
          <span
            key={w}
            aria-hidden="true"
            className="col-start-1 row-start-1 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
            style={{
              opacity: state === "in" ? 1 : 0,
              transform: state === "in" ? "translateY(0)" : state === "out" ? "translateY(-55%)" : "translateY(55%)",
              filter: state === "in" ? "blur(0)" : "blur(6px)",
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}