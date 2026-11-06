import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { LearnCta, ArrowUpRight } from "@/components/learn/LearnUI";
import WorksGrid from "@/components/works/WorksGrid";
import WorksHero from "@/components/works/WorksHero";
import WorksDeck from "@/components/works/WorksDeck";
import { WORKS } from "@/data/works";
import "@/styles/learn.css";
import "@/styles/pages.css";
import "@/styles/works.css";
import "@/styles/works-hero.css";

export const metadata = {
  title: "Our Work — Case Studies | Mindstory",
  description:
    "Case studies from Mindstory: campaigns, branding, websites and video for brands in automotive, finance, education, fitness and more.",
};

/* rotating heading: [white line, orange line] */
// keep each line short (about 15 characters) so it never wraps beside the deck
const HEADLINES = [
  ["Work that moves", "the needle."],
  ["Big ideas.", "Real results."],
  ["Stories that", "sell brands."],
  ["Campaigns built", "to perform."],
];

export default function WorksPage() {
  const clients = WORKS.map((w) => w.client);

  return (
    <>
      <Navbar />
      <main className="ls-page">
        <WorksHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Works" }]}
          eyebrow="Success stories"
          lines={HEADLINES}
          desc="Campaigns, identities and websites for brands across Kerala and the GCC — and the thinking behind them."
          visual={<WorksDeck />}
          below={
            <>
              <div className="ls-hero-stats">
                <div><b>400<span>+</span></b><small>Happy clients</small></div>
                <div><b>1,500<span>+</span></b><small>Digital campaigns</small></div>
                <div><b>500M<span>+</span></b><small>People reached</small></div>
                <div><b>10<span>+</span></b><small>Years of growth</small></div>
              </div>

              <div className="ls-marquee" aria-hidden="true">
                <div className="ls-marquee-track">
                  {[...clients, ...clients].map((c, i) => <span key={i}>{c}</span>)}
                </div>
              </div>
            </>
          }
        >
          <div className="ls-hero-actions">
            <a href="#projects" className="ls-btn ls-btn--orange">
              Browse projects <span className="ls-btn-icon"><ArrowUpRight /></span>
            </a>
            <a href="/contact#enquiry" className="ls-btn ls-btn--ghost">
              Start a project <span className="ls-btn-icon"><ArrowUpRight /></span>
            </a>
          </div>
        </WorksHero>

        <section className="ls-section" id="projects" style={{ scrollMarginTop: 80 }}>
          <div className="ls-wrap">
            <div className="ls-section-head">
              <div>
                <span className="ls-eyebrow">Case studies</span>
                <h2 className="ls-h2">Brands we&apos;ve helped tell their story.</h2>
              </div>
            </div>
            {/* useSearchParams needs a Suspense boundary */}
            <Suspense fallback={<div className="ls-empty">Loading projects…</div>}>
              <WorksGrid />
            </Suspense>
          </div>
        </section>

        <LearnCta title="Your brand could be next." desc="Tell us where you want to grow — we'll show you how we'd get there." />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
