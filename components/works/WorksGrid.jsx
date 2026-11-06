"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WORKS, WORK_TYPES, INDUSTRIES } from "@/data/works";
import WorkCard from "./WorkCard";

export default function WorksGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // filters live in the URL, so /works?type=branding (navbar links) works and can be shared
  const type = params.get("type") || "";
  const industry = params.get("industry") || "";

  const setFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(params.toString());
      if (!value || next.get(key) === value) next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const list = WORKS.filter((w) => (!type || w.types.includes(type)) && (!industry || w.industry === industry));
  const filtering = !!(type || industry);

  // only show industries that have work, so no filter leads to an empty page
  const industries = INDUSTRIES.filter((i) => WORKS.some((w) => w.industry === i.id));
  const types = WORK_TYPES.filter((t) => WORKS.some((w) => w.types.includes(t.id)));

  return (
    <>
      <div className="ls-filters">
        <div className="ls-filter-row">
          <span>Type</span>
          <div className="ls-chips">
            <button type="button" className={`ls-chip ${!type ? "is-active" : ""}`} onClick={() => setFilter("type", "")}>All</button>
            {types.map((t) => (
              <button key={t.id} type="button" aria-pressed={type === t.id}
                className={`ls-chip ${type === t.id ? "is-active" : ""}`} onClick={() => setFilter("type", t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ls-filter-row">
          <span>Industry</span>
          <div className="ls-chips">
            <button type="button" className={`ls-chip ${!industry ? "is-active" : ""}`} onClick={() => setFilter("industry", "")}>All</button>
            {industries.map((i) => (
              <button key={i.id} type="button" aria-pressed={industry === i.id}
                className={`ls-chip ${industry === i.id ? "is-active" : ""}`} onClick={() => setFilter("industry", i.id)}>
                {i.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ls-filter-meta">
          <span aria-live="polite">Showing {list.length} of {WORKS.length} projects</span>
          {filtering && <button type="button" className="ls-clear" onClick={() => router.replace(pathname, { scroll: false })}>Clear filters ✕</button>}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="ls-empty">
          No projects match both filters yet.{" "}
          <button type="button" className="ls-clear" onClick={() => router.replace(pathname, { scroll: false })}>Show all work</button>
        </div>
      ) : (
        <div className="ls-works">
          {list.map((w, i) => (
            <WorkCard
              key={w.slug}
              work={w}
              num={WORKS.indexOf(w) + 1}
              // first card is wide; the last one goes wide too if it would sit alone
              wide={!filtering && (i === 0 || (i === list.length - 1 && (list.length - 1) % 2 === 1))}
            />
          ))}
        </div>
      )}
    </>
  );
}
