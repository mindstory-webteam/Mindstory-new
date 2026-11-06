"use client";

import { useEffect, useRef, useState } from "react";
import RotatingText, { type RotatingTextRef } from "@/components/RotatingText";

/**
 * Drives <RotatingText> on a timer: every `interval` seconds the next phrase
 * rises in letter by letter. Pauses while the tab is hidden; for reduced-motion
 * users the phrases swap without animation.
 */
export default function RotatingHeadline({
  texts,
  interval = 3.2,
  className = "",
}: {
  texts: string[];
  interval?: number;
  className?: string;
}) {
  const ref = useRef<RotatingTextRef>(null);
  const index = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (texts.length < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      index.current = (index.current + 1) % texts.length;
      ref.current?.jumpTo(index.current);
    }, interval * 1000);
    return () => window.clearInterval(id);
  }, [texts.length, interval]);

  return (
    <>
      {/* screen readers get one stable phrase instead of a changing one */}
      <span className="ch-sr">{texts[0]}</span>
      <span aria-hidden="true">
        <RotatingText ref={ref} texts={texts} reduced={reduced} className={className} />
      </span>
    </>
  );
}
