"use client";

import { useEffect, useState } from "react";
import { GUIDES, GUIDE_TAGS } from "@/data/guides";

export default function GuidesList() {
  const [tag, setTag] = useState("All");
  const [open, setOpen] = useState(null);

  // Open a guide directly from a link like /guides#local-seo
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id && GUIDES.some((g) => g.id === id)) {
      setOpen(id);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, []);

  const list = tag === "All" ? GUIDES : GUIDES.filter((g) => g.tag === tag);

  return (
    <section className="ls-section">
      <div className="ls-wrap">
        <div className="ls-toolbar">
          <div className="ls-chips" role="tablist" aria-label="Filter guides">
            {GUIDE_TAGS.map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tag === t}
                className={`ls-chip ${tag === t ? "is-active" : ""}`} onClick={() => setTag(t)}>
                {t}
              </button>
            ))}
          </div>
          <span style={{ color: "var(--ls-muted)", fontSize: 14 }}>{list.length} playbooks</span>
        </div>

        <div className="ls-guides">
          {list.map((g) => {
            const isOpen = open === g.id;
            const idx = GUIDES.findIndex((x) => x.id === g.id) + 1;
            return (
              <article key={g.id} id={g.id} className={`ls-guide ${isOpen ? "is-open" : ""}`}>
                <div className="ls-guide-top">
                  <span className="ls-guide-num">GUIDE {String(idx).padStart(2, "0")}</span>
                  <span className="ls-tag">{g.tag}</span>
                </div>
                <h3>{g.title}</h3>
                <p>{g.summary}</p>
                <div className="ls-guide-facts">
                  <span>Time: <b>{g.time}</b></span>
                  <span>Level: <b>{g.level}</b></span>
                  <span>Steps: <b>{g.steps.length}</b></span>
                </div>

                <button type="button" className="ls-guide-toggle" aria-expanded={isOpen} aria-controls={`${g.id}-steps`}
                  onClick={() => setOpen(isOpen ? null : g.id)}>
                  {isOpen ? "Hide steps" : "View the playbook"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </button>

                {isOpen && (
                  <ol className="ls-steps" id={`${g.id}-steps`}>
                    {g.steps.map((s) => (
                      <li key={s.title}>
                        <div>
                          <strong>{s.title}</strong>
                          <span>{s.text}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
