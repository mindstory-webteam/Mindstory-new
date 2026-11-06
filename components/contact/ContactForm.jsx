"use client";

import { ArrowUpRight } from "@/components/learn/LearnUI";
import Icon from "@/components/site/Icon";
import useFormSubmit, { isEmail, isPhone } from "@/components/site/useFormSubmit";

const SERVICES = ["SEO", "Social Media", "Performance Ads", "Web Design", "Branding", "Email Marketing", "Video Production", "Not sure yet"];
const BUDGETS = ["Under ₹25,000 / month", "₹25,000 – ₹75,000 / month", "₹75,000 – ₹2,00,000 / month", "₹2,00,000+ / month", "One-time project"];

function validate(d) {
  const e = {};
  if (!String(d.get("name") || "").trim()) e.name = "Please enter your name";
  if (!isEmail(d.get("email"))) e.email = "Please enter a valid email";
  if (!isPhone(d.get("phone"))) e.phone = "Please enter a valid phone number";
  if (String(d.get("message") || "").trim().length < 10) e.message = "Tell us a little more (at least 10 characters)";
  return e;
}

export default function ContactForm() {
  const { status, setStatus, errors, message, onSubmit } = useFormSubmit(validate);

  if (status === "sent") {
    return (
      <div className="ls-form-card ls-success" role="status">
        <div className="ls-icon"><Icon name="check" size={28} /></div>
        <h3>Thanks — we&apos;ve got it!</h3>
        <p>Someone from our team will call or email you within one working day to set up your free consultation.</p>
        <button type="button" className="ls-btn ls-btn--dark" onClick={() => setStatus("idle")}>
          Send another message <span className="ls-btn-icon"><ArrowUpRight /></span>
        </button>
      </div>
    );
  }

  const err = (k) => errors[k] && <span className="ls-error" id={`${k}-err`}>{errors[k]}</span>;
  const aria = (k) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <div className="ls-form-card">
      <form className="ls-form" onSubmit={onSubmit} noValidate>
        <input type="hidden" name="type" value="Enquiry" />
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />

        <div className="ls-field ls-field--full">
          <span className="ls-label">What can we help with?</span>
          <div className="ls-check-chips">
            {SERVICES.map((s) => (
              <label key={s}>
                <input type="checkbox" name="services" value={s} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="ls-field">
          <label htmlFor="ct-name">Your name <em>*</em></label>
          <input id="ct-name" name="name" className="ls-input" placeholder="Full name" autoComplete="name" {...aria("name")} />
          {err("name")}
        </div>
        <div className="ls-field">
          <label htmlFor="ct-company">Company / brand</label>
          <input id="ct-company" name="company" className="ls-input" placeholder="Brand name" autoComplete="organization" />
        </div>
        <div className="ls-field">
          <label htmlFor="ct-email">Email <em>*</em></label>
          <input id="ct-email" name="email" type="email" className="ls-input" placeholder="you@company.com" autoComplete="email" {...aria("email")} />
          {err("email")}
        </div>
        <div className="ls-field">
          <label htmlFor="ct-phone">Phone / WhatsApp <em>*</em></label>
          <input id="ct-phone" name="phone" type="tel" className="ls-input" placeholder="+91 98765 43210" autoComplete="tel" {...aria("phone")} />
          {err("phone")}
        </div>
        <div className="ls-field">
          <label htmlFor="ct-website">Website</label>
          <input id="ct-website" name="website" type="url" className="ls-input" placeholder="https://" />
        </div>
        <div className="ls-field">
          <label htmlFor="ct-budget">Monthly budget</label>
          <select id="ct-budget" name="budget" className="ls-input" defaultValue="">
            <option value="">Select a range</option>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="ls-field ls-field--full">
          <label htmlFor="ct-msg">Tell us about your goals <em>*</em></label>
          <textarea id="ct-msg" name="message" className="ls-input" placeholder="What are you trying to achieve in the next 3–6 months?" {...aria("message")} />
          {err("message")}
        </div>

        <div className="ls-form-foot">
          <small>
            {status === "error" ? <span className="ls-error">{message}</span> : "No spam. We reply within one working day."}
          </small>
          <button type="submit" className="ls-btn ls-btn--orange" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"} <span className="ls-btn-icon"><ArrowUpRight /></span>
          </button>
        </div>
      </form>
    </div>
  );
}
