"use client";

import { useEffect, useRef, useState } from "react";
import { JOBS } from "@/data/careers";
import { ArrowUpRight } from "@/components/learn/LearnUI";
import Icon from "@/components/site/Icon";
import useFormSubmit, { isEmail, isPhone } from "@/components/site/useFormSubmit";

const MAX_MB = 5;
const ROLES = [...JOBS.filter((j) => j.open).map((j) => j.title), "General application"];

function validate(d) {
  const e = {};
  if (!String(d.get("name") || "").trim()) e.name = "Please enter your name";
  if (!isEmail(d.get("email"))) e.email = "Please enter a valid email";
  if (!isPhone(d.get("phone"))) e.phone = "Please enter a valid phone number";
  if (!d.get("role")) e.role = "Choose a role";
  const file = d.get("resume");
  if (!file || !file.size) e.resume = "Please attach your CV";
  else if (file.size > MAX_MB * 1024 * 1024) e.resume = `File must be under ${MAX_MB} MB`;
  return e;
}

export default function ApplyForm() {
  const { status, setStatus, errors, message, onSubmit } = useFormSubmit(validate);
  const [role, setRole] = useState("");
  const [fileName, setFileName] = useState("");
  const roleRef = useRef(null);

  // "Apply for this role" buttons pre-select the role
  useEffect(() => {
    const onApply = (e) => {
      setRole(e.detail);
      setStatus("idle");
      setTimeout(() => roleRef.current?.form?.querySelector('[name="name"]')?.focus({ preventScroll: true }), 500);
    };
    window.addEventListener("ls:apply", onApply);
    return () => window.removeEventListener("ls:apply", onApply);
  }, [setStatus]);

  if (status === "sent") {
    return (
      <div className="ls-form-card ls-success" role="status">
        <div className="ls-icon"><Icon name="check" size={28} /></div>
        <h3>Application received!</h3>
        <p>Thanks for applying. Our team reads every application and will get back to you within a week if there&apos;s a fit.</p>
        <button type="button" className="ls-btn ls-btn--dark" onClick={() => { setStatus("idle"); setFileName(""); setRole(""); }}>
          Apply for another role <span className="ls-btn-icon"><ArrowUpRight /></span>
        </button>
      </div>
    );
  }

  const err = (k) => errors[k] && <span className="ls-error" id={`${k}-err`}>{errors[k]}</span>;
  const aria = (k) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <div className="ls-form-card">
      <form className="ls-form" onSubmit={onSubmit} noValidate>
        <input type="hidden" name="type" value="Job application" />
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

        <div className="ls-field">
          <label htmlFor="ap-name">Full name <em>*</em></label>
          <input id="ap-name" name="name" className="ls-input" placeholder="Your name" autoComplete="name" {...aria("name")} />
          {err("name")}
        </div>
        <div className="ls-field">
          <label htmlFor="ap-email">Email <em>*</em></label>
          <input id="ap-email" name="email" type="email" className="ls-input" placeholder="you@example.com" autoComplete="email" {...aria("email")} />
          {err("email")}
        </div>
        <div className="ls-field">
          <label htmlFor="ap-phone">Phone <em>*</em></label>
          <input id="ap-phone" name="phone" type="tel" className="ls-input" placeholder="+91 98765 43210" autoComplete="tel" {...aria("phone")} />
          {err("phone")}
        </div>
        <div className="ls-field">
          <label htmlFor="ap-role">Role <em>*</em></label>
          <select id="ap-role" name="role" ref={roleRef} className="ls-input" value={role} onChange={(e) => setRole(e.target.value)} {...aria("role")}>
            <option value="">Select a role</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {err("role")}
        </div>
        <div className="ls-field">
          <label htmlFor="ap-exp">Experience</label>
          <select id="ap-exp" name="experience" className="ls-input" defaultValue="">
            <option value="">Select</option>
            <option>Fresher</option>
            <option>Less than 1 year</option>
            <option>1–3 years</option>
            <option>3–5 years</option>
            <option>5+ years</option>
          </select>
        </div>
        <div className="ls-field">
          <label htmlFor="ap-portfolio">Portfolio / LinkedIn</label>
          <input id="ap-portfolio" name="portfolio" type="url" className="ls-input" placeholder="https://" />
        </div>

        <div className="ls-field ls-field--full">
          <span className="ls-label">CV / Resume <em style={{ color: "var(--ls-orange)", fontStyle: "normal" }}>*</em></span>
          <label className="ls-file" {...aria("resume")}>
            <span className="ls-icon"><Icon name="upload" /></span>
            <span>
              <b>{fileName || "Upload your CV"}</b>
              <small>PDF or DOC, up to {MAX_MB} MB</small>
            </span>
            <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
          </label>
          {err("resume")}
        </div>

        <div className="ls-field ls-field--full">
          <label htmlFor="ap-msg">Why Mindstory?</label>
          <textarea id="ap-msg" name="message" className="ls-input" placeholder="Tell us a little about yourself and the work you're proud of." />
        </div>

        <div className="ls-form-foot">
          <small>
            {status === "error" ? <span className="ls-error">{message}</span> : "We only use your details to review your application."}
          </small>
          <button type="submit" className="ls-btn ls-btn--orange" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Submit application"} <span className="ls-btn-icon"><ArrowUpRight /></span>
          </button>
        </div>
      </form>
    </div>
  );
}
