"use client";

import { useId } from "react";

/**
 * The Mindstory "M" as an inline, animated SVG — transparent background.
 *  1. the outline draws itself
 *  2. it fills with brand orange while the legs rise into place
 *  3. (loop) a light sweep passes over it and the legs gently bob
 */
type Props = {
  className?: string;
  /** keep animating after the intro (used by the preloader) */
  loop?: boolean;
  color?: string;
};

const UPPER = "M12 12H40L64 46L88 12H116V80H94V50L64 92L34 50V80H12Z";
const LEG_L = "M12 88H34L46 104V116H12Z";
const LEG_R = "M116 88H94L82 104V116H116Z";

export default function MindstoryMark({ className = "", loop = false, color = "#f6811f" }: Props) {
  const id = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} role="img" aria-label="Mindstory">
      <style>{`
        .mm-${id} .p {
          fill: ${color};
          fill-opacity: 0;
          stroke: ${color};
          stroke-width: 2.5;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: mm-draw .9s cubic-bezier(.6,0,.2,1) forwards, mm-fill .45s ease .75s forwards;
        }
        .mm-${id} .leg {
          animation: mm-draw .9s cubic-bezier(.6,0,.2,1) .15s forwards, mm-fill .45s ease .9s forwards,
            mm-rise .7s cubic-bezier(.2,.8,.2,1) .2s both${loop ? ", mm-bob 1.6s ease-in-out 1.4s infinite" : ""};
        }
        .mm-${id} .leg-r { animation-delay: .15s, .9s, .2s${loop ? ", 1.6s" : ""}; }
        .mm-${id} .shine { animation: mm-shine ${loop ? "2.2s" : "5s"} ease-in-out 1.3s infinite; }

        @keyframes mm-draw { to { stroke-dashoffset: 0 } }
        @keyframes mm-fill { to { fill-opacity: 1; stroke-width: 0 } }
        @keyframes mm-rise { from { transform: translateY(14px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes mm-bob  { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes mm-shine { 0% { transform: translateX(-60px) } 45%, 100% { transform: translateX(200px) } }

        @media (prefers-reduced-motion: reduce) {
          .mm-${id} .p, .mm-${id} .leg, .mm-${id} .shine { animation: none !important; }
          .mm-${id} .p { fill-opacity: 1; stroke-width: 0; stroke-dashoffset: 0; }
        }
      `}</style>

      <defs>
        <clipPath id={`mm-clip-${id}`}>
          <path d={UPPER} />
          <path d={LEG_L} />
          <path d={LEG_R} />
        </clipPath>
        <linearGradient id={`mm-shine-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className={`mm-${id}`}>
        <path className="p" pathLength={1} d={UPPER} />
        <path className="p leg" pathLength={1} d={LEG_L} />
        <path className="p leg leg-r" pathLength={1} d={LEG_R} />
        <g clipPath={`url(#mm-clip-${id})`}>
          <g transform="skewX(-20)">
            <rect className="shine" x="-40" y="-10" width="34" height="150" fill={`url(#mm-shine-${id})`} />
          </g>
        </g>
      </g>
    </svg>
  );
}