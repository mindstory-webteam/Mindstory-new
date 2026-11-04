"use client";

import { useEffect, useState } from "react";
import { reviews } from "@/lib/data";
import { Google } from "./Icons";
import ReviewWall from "./ReviewWall";

export default function Reviews() {
  // smaller cards and fewer columns on phones
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="reviews" className="overflow-hidden border-t border-line bg-paper pt-24 md:pt-36">
      <div className="container-x flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p data-reveal className="eyebrow text-muted">
            Client love
          </p>
          <h2
            data-reveal-words
            className="mt-5 max-w-3xl text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]"
          >
            Experiences of our <span className="text-brand">delighted</span> customers.
          </h2>
        </div>
        <div data-reveal className="flex items-center gap-4 rounded-2xl border border-line bg-white px-6 py-4">
          <Google className="h-8 w-8" />
          <div>
            <p className="text-lg font-medium">Excellent</p>
            <p className="text-sm text-muted">Based on 109 reviews</p>
          </div>
        </div>
      </div>

      {/* the drifting wall (decorative — the readable list for screen readers is below) */}
      <div className="relative mt-6 h-[560px] md:mt-4 md:h-[720px]">
        <ReviewWall
          key={compact ? "sm" : "lg"}
          reviews={reviews}
          columns={compact ? 3 : 5}
          tileWidth={compact ? 250 : 300}
          tileHeight={compact ? 220 : 236}
          gap={compact ? 14 : 20}
          speed={compact ? 20 : 26}
        />
      </div>

      <ul className="sr-only">
        {reviews.map((r, i) => (
          <li key={i}>
            “{r.text}” — {r.name}, posted on Google
          </li>
        ))}
      </ul>
    </section>
  );
}