"use client";

import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createMascotEngine, MASCOT, type MascotAction, type MascotEngine } from "@/lib/mascot";
import { gsap } from "@/lib/gsap";

export type CursorMascotHandle = { play: (action: MascotAction) => void };

/**
 * The Mindstory astronaut, leaning toward the cursor and turning to face it.
 * interactive: clicking the mascot makes it wave / jump (leave off when a parent button handles clicks).
 */
export const CursorMascot = forwardRef<CursorMascotHandle, { className?: string; interactive?: boolean; label?: string }>(function CursorMascot(
  { className = "", interactive = false, label = "Mindstory astronaut, looking toward your cursor" },
  ref
) {
  const lean = useRef<HTMLSpanElement>(null);
  const flip = useRef<HTMLSpanElement>(null);
  const float = useRef<HTMLSpanElement>(null);
  const engine = useRef<MascotEngine | null>(null);

  useImperativeHandle(ref, () => ({ play: (action) => engine.current?.play(action) }), []);

  useEffect(() => {
    if (!lean.current || !flip.current) return;
    engine.current = createMascotEngine(lean.current, flip.current);
    // gentle breathing float, independent of the cursor
    const breathe = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? null
      : gsap.to(float.current, { y: -10, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return () => {
      breathe?.kill();
      engine.current?.destroy();
      engine.current = null;
    };
  }, []);

  const inner = (
    <span ref={float} className="block">
      <span ref={lean} className="block will-change-transform">
        <span ref={flip} className="block will-change-transform">
          <Image
            src={MASCOT.src}
            alt=""
            width={MASCOT.width}
            height={MASCOT.height}
            priority
            draggable={false}
            sizes="(min-width:1024px) 34vw, 70vw"
            className="block h-auto w-full select-none drop-shadow-[0_30px_40px_rgba(90,45,10,0.25)]"
          />
        </span>
      </span>
    </span>
  );

  return interactive ? (
    <button
      type="button"
      className={`block w-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${className}`}
      aria-label={`${label}. Click to say hello.`}
      onClick={() => engine.current?.play("next")}
    >
      {inner}
    </button>
  ) : (
    <span className={`block w-full ${className}`} role="img" aria-label={label}>
      {inner}
    </span>
  );
});
