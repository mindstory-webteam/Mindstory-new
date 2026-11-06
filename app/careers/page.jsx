import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { LearnHero, LearnCta, ArrowUpRight } from "@/components/learn/LearnUI";
import Icon from "@/components/site/Icon";
import JobList from "@/components/careers/JobList";
import ApplyForm from "@/components/careers/ApplyForm";
import { PERKS, HIRING_STEPS, JOBS } from "@/data/careers";
import "@/styles/learn.css";
import "@/styles/pages.css";

export const metadata = {
  title: "Careers — Join the Mindstory Team | Thrissur & Kochi",
  description:
    "Open roles and internships at Mindstory, a digital marketing agency in Kerala. SEO, social media, performance ads, design, video and web.",
};

export default function CareersPage() {
  const openCount = JOBS.filter((j) => j.open).length;

  return (
    <>
      <Navbar />
      <main className="ls-page">
        <LearnHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
          eyebrow="Careers"
          title={<>Help brands tell <em>better stories.</em></>}
          desc="We're a team of strategists, designers, writers and media buyers in Thrissur and Kochi. If you love the craft and care about results, you'll fit right in."
        >
          <div className="ls-hero-actions">
            <a href="#roles" className="ls-btn ls-btn--orange">
              See {openCount} open roles <span className="ls-btn-icon"><ArrowUpRight /></span>
            </a>
            <a href="#apply" className="ls-btn ls-btn--ghost">
              Send your CV <span className="ls-btn-icon"><ArrowUpRight /></span>
            </a>
          </div>

          <div className="ls-hero-stats">
            <div><b>30<span>+</span></b><small>Team members</small></div>
            <div><b>10<span>+</span></b><small>Years in business</small></div>
            <div><b>400<span>+</span></b><small>Clients served</small></div>
            <div><b>2</b><small>Offices in Kerala</small></div>
          </div>
        </LearnHero>

        {/* ── Why work with us ── */}
        <section className="ls-section">
          <div className="ls-wrap">
            <div className="ls-section-head">
              <div>
                <span className="ls-eyebrow">Life at Mindstory</span>
                <h2 className="ls-h2">Fuelled by ideas — and unlimited coffee.</h2>
              </div>
            </div>
            <div className="ls-perks">
              {PERKS.map((p) => (
                <div key={p.title} className="ls-perk">
                  <span className="ls-icon"><Icon name={p.icon} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Open roles ── */}
        <section className="ls-section" id="roles" style={{ paddingTop: 0, scrollMarginTop: 100 }}>
          <div className="ls-wrap">
            <div className="ls-section-head" id="internships" style={{ scrollMarginTop: 120 }}>
              <div>
                <span className="ls-eyebrow">Open roles</span>
                <h2 className="ls-h2">Find your seat on the ship.</h2>
              </div>
            </div>
            <JobList />
          </div>
        </section>

        {/* ── Hiring process ── */}
        <section className="ls-section ls-band">
          <div className="ls-wrap">
            <div className="ls-section-head">
              <div>
                <span className="ls-eyebrow">How we hire</span>
                <h2 className="ls-h2">Simple, quick and human.</h2>
              </div>
              <p style={{ margin: 0, maxWidth: 380, color: "rgba(255,255,255,.65)", lineHeight: 1.6 }}>
                Most hires take two to three weeks from application to offer. We&apos;ll keep you posted at every step.
              </p>
            </div>
            <ol className="ls-process">
              {HIRING_STEPS.map((s) => (
                <li key={s.title}>
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Apply ── */}
        <section className="ls-section" id="apply" style={{ scrollMarginTop: 80 }}>
          <div className="ls-wrap ls-contact-layout">
            <div className="ls-contact-side">
              <span className="ls-eyebrow">Apply</span>
              <h2 className="ls-h2">Your next chapter starts here.</h2>
              <p>
                Don&apos;t see the perfect role? Choose &ldquo;General application&rdquo; — we&apos;re always happy to meet good people.
              </p>
              <ul className="ls-promise">
                <li><span>✓</span>We read every application</li>
                <li><span>✓</span>Reply within a week if there&apos;s a fit</li>
                <li><span>✓</span>Your details stay private</li>
              </ul>
            </div>
            <ApplyForm />
          </div>
        </section>

        <LearnCta
          title="Questions about working here?"
          desc="Write to us anytime — we're happy to tell you more about the team and the work."
        />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
