"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix: string; label: string };

const stats: Stat[] = [
  { value: 400, suffix: "+", label: "Happy clients" },
  { value: 500, suffix: "M+", label: "People reached" },
  { value: 1500, suffix: "+", label: "Digital campaigns" },
  { value: 100, suffix: "+", label: "Events organised" },
  { value: 10, suffix: "+", label: "Movie promotions" },
  { value: 30, suffix: "+", label: "Team members" },
];

function CountUp({ to, duration = 1600 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return <span ref={ref}>{val.toLocaleString("en-IN")}</span>;
}

export default function AboutStats() {
  return (
    <section id="numbers" className="bg-paper pb-24 text-ink md:pb-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <h3 className="text-2xl font-medium tracking-tight md:text-3xl">Ten years, in numbers</h3>
          <p className="text-sm text-muted">And counting, every single day.</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-paper px-5 py-8 md:px-8 md:py-10">
              <p className="text-[clamp(2.2rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em]">
                <CountUp to={s.value} />
                <span className="text-brand">{s.suffix}</span>
              </p>
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
