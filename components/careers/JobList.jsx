"use client";

import { useEffect, useState } from "react";
import { JOBS, DEPARTMENTS } from "@/data/careers";
import { ArrowUpRight } from "@/components/learn/LearnUI";

export default function JobList() {
  const [dept, setDept] = useState("All");
  const [open, setOpen] = useState(null);
  const jobs = JOBS.filter((j) => j.open && (dept === "All" || j.dept === dept));

  // /careers#internships → filter internships; /careers#seo-executive → open that role
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "internships") setDept("Internship");
    else if (JOBS.some((j) => j.id === hash)) {
      setOpen(hash);
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, []);

  const apply = (job) => {
    window.dispatchEvent(new CustomEvent("ls:apply", { detail: job.title }));
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="ls-toolbar">
        <div className="ls-chips" role="tablist" aria-label="Filter roles">
          {DEPARTMENTS.map((d) => (
            <button key={d} type="button" role="tab" aria-selected={dept === d}
              className={`ls-chip ${dept === d ? "is-active" : ""}`} onClick={() => setDept(d)}>
              {d}
            </button>
          ))}
        </div>
        <span style={{ color: "var(--ls-muted)", fontSize: 14 }}>
          {jobs.length} open {jobs.length === 1 ? "role" : "roles"}
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="ls-empty">
          No openings here right now — send us a general application below and we&apos;ll keep you in mind.
        </div>
      ) : (
        <div className="ls-jobs">
          {jobs.map((j) => {
            const isOpen = open === j.id;
            return (
              <div key={j.id} id={j.id} className={`ls-job ${isOpen ? "is-open" : ""}`}>
                <button type="button" className="ls-job-head" aria-expanded={isOpen} aria-controls={`${j.id}-body`}
                  onClick={() => setOpen(isOpen ? null : j.id)}>
                  <div>
                    <h3>{j.title}</h3>
                    <div className="ls-job-tags">
                      <span>{j.type}</span>
                      <span>{j.location}</span>
                      <span>{j.experience}</span>
                    </div>
                  </div>
                  <span className="ls-job-dept">{j.dept}</span>
                  <span className="ls-job-plus" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>

                <div className="ls-job-body" id={`${j.id}-body`}>
                  <div>
                    <div className="ls-job-inner">
                      <p>{j.summary}</p>
                      <div>
                        <h4>What you&apos;ll do</h4>
                        <ul>{j.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
                      </div>
                      <div>
                        <h4>What we look for</h4>
                        <ul>{j.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
                      </div>
                      <div className="ls-job-actions">
                        <button type="button" className="ls-btn ls-btn--orange" onClick={() => apply(j)}>
                          Apply for this role <span className="ls-btn-icon"><ArrowUpRight /></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
