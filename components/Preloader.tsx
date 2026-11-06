"use client";

import { useEffect, useState } from "react";
import MindstoryMark from "./MindstoryMark";

/**
 * Full-screen preloader: the M draws itself, a progress line fills,
 * then the curtain slides up once the page has loaded.
 * Place it once in app/layout.tsx — it shows on a full page load only,
 * not on client-side navigation between pages.
 */
export default function Preloader({ minDuration = 1800 }: { minDuration?: number }) {
  const [state, setState] = useState<"show" | "leave" | "done">("show");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const min = reduced ? 300 : minDuration;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, min - (performance.now() - start));
      timers.push(
        setTimeout(() => {
          setState("leave");
          timers.push(setTimeout(() => setState("done"), 900));
        }, wait)
      );
    };

    document.documentElement.style.overflow = "hidden";
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    // never block the page for too long on a slow asset
    timers.push(setTimeout(finish, 5000));

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", finish);
      document.documentElement.style.overflow = "";
    };
  }, [minDuration]);

  useEffect(() => {
    if (state !== "show") document.documentElement.style.overflow = "";
  }, [state]);

  if (state === "done") return null;

  return (
    <div
      id="mindstory-preloader"
      role="status"
      aria-label="Loading Mindstory"
      aria-hidden={state === "leave"}
      className={`fixed inset-0 z-[100] grid place-items-center bg-ink transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] ${
        state === "leave" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <style>{`
        @keyframes pl-bar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        .pl-bar { transform-origin: left; animation: pl-bar ${minDuration}ms cubic-bezier(.6,0,.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) { .pl-bar { animation: none; transform: none; } }
      `}</style>
      {/* if JavaScript is off, don't cover the page */}
      <noscript>
        <style>{`#mindstory-preloader { display: none !important; }`}</style>
      </noscript>

      <div
        className={`flex flex-col items-center gap-7 transition-[opacity,transform] duration-500 ${
          state === "leave" ? "-translate-y-6 opacity-0" : ""
        }`}
      >
        <MindstoryMark loop className="h-24 w-24 md:h-28 md:w-28" />
        <div className="h-px w-40 overflow-hidden rounded-full bg-white/10">
          <div className="pl-bar h-full w-full bg-brand" />
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Mindstory</p>
      </div>
    </div>
  );
}