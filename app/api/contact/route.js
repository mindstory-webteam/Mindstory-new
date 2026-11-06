// Receives the Contact and Careers forms.
//
// Email delivery uses Resend (https://resend.com) through its REST API — no package needed.
// Add these to .env.local (and to your Vercel project settings):
//
//   RESEND_API_KEY=re_xxxxxxxx
//   CONTACT_TO=hello@mindstory.in          # where enquiries go
//   CAREERS_TO=careers@mindstory.in        # where applications go (falls back to CONTACT_TO)
//   MAIL_FROM="Mindstory Website <website@mindstory.in>"   # a sender on a domain verified in Resend
//
// Without RESEND_API_KEY the route still returns success and logs the submission,
// so the forms work while you develop.

export const runtime = "nodejs";

const MAX_FILE = 5 * 1024 * 1024;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

export async function POST(req) {
  let form;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  if (form.get("company_website")) return Response.json({ ok: true }); // honeypot

  const type = form.get("type") === "Job application" ? "Job application" : "Enquiry";
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim();

  if (!name || !isEmail(email) || phone.replace(/\D/g, "").length < 10) {
    return Response.json({ error: "Please fill in your name, a valid email and phone number." }, { status: 400 });
  }

  // collect fields for the email
  const fields = {};
  for (const [k, v] of form.entries()) {
    if (k === "resume" || k === "company_website" || k === "type") continue;
    fields[k] = fields[k] ? `${fields[k]}, ${v}` : String(v);
  }

  // optional CV attachment
  const attachments = [];
  const file = form.get("resume");
  if (file && typeof file === "object" && file.size) {
    if (file.size > MAX_FILE) return Response.json({ error: "CV must be under 5 MB." }, { status: 400 });
    if (!/\.(pdf|docx?)$/i.test(file.name)) return Response.json({ error: "CV must be a PDF or Word file." }, { status: 400 });
    attachments.push({ filename: file.name, content: Buffer.from(await file.arrayBuffer()).toString("base64") });
  }

  const subject = type === "Job application"
    ? `Job application: ${fields.role || "General"} — ${name}`
    : `New enquiry from ${name}${fields.company ? ` (${fields.company})` : ""}`;

  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#6B6760;text-transform:capitalize;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#121212"><h2 style="margin:0 0 14px">${esc(subject)}</h2><table>${rows}</table></div>`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[contact] ${subject}`, fields, attachments.length ? `(+ ${attachments[0].filename})` : "");
    return Response.json({ ok: true, dev: true });
  }

  const to = type === "Job application" ? process.env.CAREERS_TO || process.env.CONTACT_TO : process.env.CONTACT_TO;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "Mindstory Website <onboarding@resend.dev>",
        to: [to || "hello@mindstory.in"],
        reply_to: email,
        subject,
        html,
        attachments,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return Response.json({ error: "We couldn't send that right now. Please call or email us." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[contact]", e);
    return Response.json({ error: "We couldn't send that right now. Please call or email us." }, { status: 502 });
  }
}
