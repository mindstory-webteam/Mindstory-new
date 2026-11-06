"use client";

import { useState } from "react";

/**
 * Posts a form (as multipart FormData, so file uploads work) to /api/contact.
 * `validate(formData)` returns an object of { fieldName: "error message" }.
 */
export default function useFormSubmit(validate) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot — bots fill hidden fields, people don't
    if (data.get("company_website")) return;

    const errs = validate ? validate(data) : {};
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Could not send. Please call or email us instead.");
    }
  };

  return { status, setStatus, errors, message, onSubmit };
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
export const isPhone = (v) => String(v || "").replace(/[^\d]/g, "").length >= 10;
