"use client";

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export type RotatingTextRef = { jumpTo: (index: number) => void };

type Props = {
  texts: string[];
  className?: string;
  /** seconds between letters */
  stagger?: number;
  reduced?: boolean;
};

/** Letters rise out of a mask one after another; the old line lifts away first. */
const RotatingText = forwardRef<RotatingTextRef, Props>(function RotatingText({ texts, className = "", stagger = 0.022, reduced = false }, ref) {
  // index + the line that is leaving, updated together so the exit always has its letters
  const [{ index, prev }, setState] = useState<{ index: number; prev: number | null }>({ index: 0, prev: null });
  const inRef = useRef<HTMLSpanElement>(null);
  const outRef = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useImperativeHandle(
    ref,
    () => ({
      jumpTo: (i: number) => setState((s) => (s.index === i ? s : { index: i, prev: s.index })),
    }),
    []
  );

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) {
      setState((s) => ({ ...s, prev: null }));
      return;
    }
    const letters = inRef.current?.querySelectorAll("[data-ch]") ?? [];
    const old = outRef.current?.querySelectorAll("[data-ch]") ?? [];
    gsap.set(letters, { yPercent: 105, opacity: 0 });
    const tl = gsap.timeline({ onComplete: () => setState((s) => ({ ...s, prev: null })) });
    // old line lifts out of its mask first, then the new letters rise in one after another
    tl.to(old, { yPercent: -105, opacity: 0, duration: 0.35, ease: "power3.in", stagger: stagger * 0.5 }, 0).to(
      letters,
      { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger },
      0.3
    );
    return () => {
      tl.kill();
    };
  }, [index, reduced, stagger]);

  const split = (text: string) =>
    text.split(" ").map((word, w, arr) => (
      <span key={w} className="inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] pr-[0.04em]">
        {Array.from(word).map((ch, c) => (
          <span key={c} data-ch className="inline-block will-change-transform">
            {ch}
          </span>
        ))}
        {w < arr.length - 1 && <span className="inline-block">&nbsp;</span>}
      </span>
    ));

  return (
    <span className={`relative block ${className}`}>
      {/* sizer keeps the line height steady while lines swap */}
      <span ref={inRef} className="block" aria-live="off">
        {split(texts[index])}
      </span>
      {prev !== null && (
        <span ref={outRef} className="pointer-events-none absolute inset-x-0 top-0 block" aria-hidden>
          {split(texts[prev])}
        </span>
      )}
    </span>
  );
});

export default RotatingText;
