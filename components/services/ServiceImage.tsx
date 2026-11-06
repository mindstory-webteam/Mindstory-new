"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A service-page photo. If the file isn't in /public yet (or fails to load),
 * it shows a branded placeholder with the label instead of a broken image.
 */
type Props = {
  src: string;
  alt: string;
  /** `sizes` for next/image — how wide the image renders */
  sizes: string;
  /** fill the nearest positioned parent instead of being a block of its own */
  fill?: boolean;
  className?: string;
  /** text on the placeholder (defaults to the alt text) */
  label?: string;
  priority?: boolean;
  /** zoom slightly when a parent with `group` is hovered */
  zoom?: boolean;
};

export default function ServiceImage({
  src,
  alt,
  sizes,
  fill = false,
  className = "",
  label,
  priority = false,
  zoom = false,
}: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`${fill ? "absolute inset-0" : "relative"} overflow-hidden bg-ink ${className}`}>
      {failed ? (
        <div
          className="absolute inset-0 grid place-items-center p-6 text-center"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(246,129,31,.45), transparent 55%)," +
              "linear-gradient(135deg, #1d1915 0%, #0c0b0a 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <span className="relative rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/70">
            {label ?? alt}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={`object-cover ${zoom ? "transition-transform duration-700 ease-out group-hover:scale-105" : ""}`}
        />
      )}
    </div>
  );
}