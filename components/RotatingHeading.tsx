"use client";

import { useEffect, useRef, useState } from "react";
import RotatingText, { type RotatingTextRef } from "@/components/RotatingText";

/**
 * A two-line hero heading that rotates through whole phrases:
 * line 1 (white) + line 2 (brand orange), swapped together with the
 * letter-by-letter <RotatingText> animation.
 *
 * Every pair is a complete phrase, so each version reads naturally.
 * Screen readers get the first pair only (the swap is visual).
 */
export default function RotatingHeading({
  lines,
  interval = 3.4,
  as: Tag = "h1",
  className = "",
  accentClassName = "text-brand",
}: {
  /** [white line, orange line] pairs */
  lines: [string, string][];
  /** seconds per phrase */
  interval?: number;
  as?: "h1" | "h2";
  className?: string;
  accentClassName?: string;
}) {
  const first = useRef<RotatingTextRef>(null);
  const second = useRef<RotatingTextRef>(null);
  const index = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (lines.length < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      index.current = (index.current + 1) % lines.length;
      first.current?.jumpTo(index.current);
      second.current?.jumpTo(index.current);
    }, interval * 1000);
    return () => window.clearInterval(id);
  }, [lines.length, interval]);

  return (
    <Tag className={className}>
      <span className="sr-only">
        {lines[0][0]} {lines[0][1]}
      </span>
      {/* all phrases sit in one grid cell: invisible copies reserve the height of
          the tallest one, so the content below never jumps while phrases swap */}
      <span aria-hidden="true" className="grid">
        {lines.map(([a, b], i) => (
          <span key={i} className="invisible col-start-1 row-start-1">
            <span className="block">{a}</span>
            <span className="block">{b}</span>
          </span>
        ))}
        <span className="col-start-1 row-start-1">
          <RotatingText ref={first} texts={lines.map((l) => l[0])} reduced={reduced} />
          <RotatingText ref={second} texts={lines.map((l) => l[1])} reduced={reduced} className={accentClassName} />
        </span>
      </span>
    </Tag>
  );
}
