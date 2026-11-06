"use client";

import { useMemo, useState } from "react";
import { FAQ_GROUPS } from "@/data/faqs";

export default function FaqList() {
  const [active, setActive] = useState("all");
  const [openKey, setOpenKey] = useState("general-0");
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_GROUPS
      .filter((g) => active === "all" || g.id === active)
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => !q || `${it.q} ${it.a}`.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [active, query]);

  const total = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);
  let counter = 0;

  return (
    <section className="ls-section">
      <div className="ls-wrap ls-faq-layout">
        <aside className="ls-faq-nav" aria-label="FAQ categories">
          <button type="button" className={active === "all" ? "is-active" : ""} onClick={() => setActive("all")}>
            All questions <small>{total}</small>
          </button>
          {FAQ_GROUPS.map((g) => (
            <button key={g.id} type="button" className={active === g.id ? "is-active" : ""} onClick={() => setActive(g.id)}>
              {g.label} <small>{g.items.length}</small>
            </button>
          ))}
        </aside>

        <div>
          <label className="ls-search" style={{ marginBottom: 30, maxWidth: 420 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input type="search" placeholder="Search questions" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search questions" />
          </label>

          {groups.length === 0 && <div className="ls-empty">No questions match that. Call us — we&apos;re happy to help.</div>}

          {groups.map((g) => (
            <div key={g.id} className="ls-faq-group">
              <h3>{g.label}</h3>
              {g.items.map((it, i) => {
                counter += 1;
                const key = `${g.id}-${i}`;
                const isOpen = openKey === key;
                return (
                  <div key={key} className={`ls-faq-item ${isOpen ? "is-open" : ""}`}>
                    <button type="button" className="ls-faq-q" aria-expanded={isOpen} aria-controls={`${key}-a`}
                      onClick={() => setOpenKey(isOpen ? null : key)}>
                      <span className="ls-faq-num">{String(counter).padStart(2, "0")}</span>
                      <span className="ls-faq-text">{it.q}</span>
                      <span className="ls-faq-plus" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </span>
                    </button>
                    <div className="ls-faq-a" id={`${key}-a`} role="region">
                      <div><p>{it.a}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
