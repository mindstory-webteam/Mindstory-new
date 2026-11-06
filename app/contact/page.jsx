import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "@/components/learn/LearnUI";
import Icon from "@/components/site/Icon";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import "@/styles/learn.css";
import "@/styles/pages.css";

export const metadata = {
  title: "Contact Mindstory — Digital Marketing Agency in Thrissur & Kochi",
  description:
    "Talk to Mindstory about SEO, social media, ads, web design and branding. Call +91-8281001410 or send us a message for a free consultation.",
};

const CONTACTS = [
  { icon: "phone", label: "Call us", value: "+91-8281001410", href: "tel:+918281001410" },
  { icon: "mail", label: "Email", value: "hello@mindstory.in", href: "mailto:hello@mindstory.in" },
  { icon: "chat", label: "WhatsApp", value: "Chat with us", href: "https://wa.me/918281001410", external: true },
  { icon: "clock", label: "Working hours", value: "Mon–Fri · 10AM to 6PM" },
];

// Update the text / map links with your exact addresses
const OFFICES = [
  { city: "Thrissur", text: "Our home since 2016 — strategy, creative and production.", map: "https://www.google.com/maps/search/?api=1&query=Mindstory+Thrissur" },
  { city: "Kochi", text: "Closer to our clients in Ernakulam and central Kerala.", map: "https://www.google.com/maps/search/?api=1&query=Mindstory+Kochi" },
  { city: "GCC", text: "Campaigns for brands across the UAE and the Gulf — remote first.", map: null },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="ls-page">
        {/* star field background · rotating heading · globe on the right */}
        <ContactHero />

        {/* ── Quick contact cards (overlap the banner) ── */}
        <div className="ls-wrap" style={{ position: "relative", zIndex: 5 }}>
          <div className="ls-contact-cards">
            {CONTACTS.map((c) => {
              const inner = (
                <>
                  <span className="ls-icon"><Icon name={c.icon} /></span>
                  <div>
                    <small>{c.label}</small>
                    <b style={{ display: "block", marginTop: 4 }}>{c.value}</b>
                  </div>
                </>
              );
              return c.href ? (
                <a key={c.label} href={c.href} className="ls-contact-card"
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="ls-contact-card">{inner}</div>
              );
            })}
          </div>
        </div>

        {/* ── Form ── */}
        <section className="ls-section" id="enquiry" style={{ scrollMarginTop: 80 }}>
          <div className="ls-wrap ls-contact-layout">
            <div className="ls-contact-side">
              <span className="ls-eyebrow">Get a proposal</span>
              <h2 className="ls-h2">Tell us about your brand.</h2>
              <p>The more you share, the more useful our first call will be. Here&apos;s what happens next:</p>
              <ul className="ls-promise">
                <li><span>1</span>We reply within one working day</li>
                <li><span>2</span>A free 30-minute consultation with a strategist</li>
                <li><span>3</span>A tailored proposal with clear goals and costs</li>
              </ul>
              <Link href="/faqs" className="ls-btn ls-btn--dark" style={{ justifySelf: "start" }}>
                Read our FAQs <span className="ls-btn-icon"><ArrowUpRight /></span>
              </Link>
            </div>
            <ContactForm />
          </div>
        </section>

        {/* ── Offices ── */}
        <section className="ls-section ls-band" id="offices" style={{ scrollMarginTop: 80 }}>
          <div className="ls-wrap">
            <div className="ls-section-head">
              <div>
                <span className="ls-eyebrow">Where we are</span>
                <h2 className="ls-h2">Thrissur · Kochi · GCC</h2>
              </div>
              <p style={{ margin: 0, maxWidth: 380, color: "rgba(255,255,255,.65)", lineHeight: 1.6 }}>
                Drop by for a coffee — or let&apos;s meet online. Either way, you&apos;ll talk to the people who do the work.
              </p>
            </div>
            <div className="ls-offices">
              {OFFICES.map((o) => (
                <div key={o.city} className="ls-office">
                  <div className="ls-office-art" aria-hidden="true" />
                  <div className="ls-office-body">
                    <h3>{o.city}</h3>
                    <p>{o.text}</p>
                    {o.map ? (
                      <a href={o.map} target="_blank" rel="noopener noreferrer">
                        Get directions <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <a href="https://wa.me/918281001410" target="_blank" rel="noopener noreferrer">
                        Message us <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
