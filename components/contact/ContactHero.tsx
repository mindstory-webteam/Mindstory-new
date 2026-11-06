import Link from "next/link";
import StarField from "@/components/StarField";
import Globe from "./Globe";
import RotatingHeadline from "./RotatingHeadline";

/* the phrases that rotate in the heading */
const PHRASES = ["success story.", "next campaign.", "brand's growth.", "digital journey."];

/**
 * Contact page banner: drifting star field behind everything, copy on the left
 * with a rotating heading, and a dotted globe with arcs from Kerala on the right.
 * The quick-contact cards on the page overlap its bottom edge.
 */
export default function ContactHero() {
  return (
    <section className="ch-hero" aria-labelledby="contact-title">
      <style>{CSS}</style>

      {/* background: star field + warm glows */}
      <div className="ch-stars" aria-hidden="true">
        <StarField count={700} speed={0.03} glintRate={1.1} />
      </div>
      <div className="ch-glow" aria-hidden="true" />

      <div className="ch-wrap">
        {/* ── left: copy ── */}
        <div className="ch-copy">
          <nav className="ch-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Contact</span>
          </nav>

          <span className="ch-eyebrow">Contact</span>

          <h1 className="ch-title" id="contact-title">
            <span className="ch-title-line">Let&apos;s start your</span>
            <RotatingHeadline texts={PHRASES} className="ch-rotate" />
          </h1>

          <p className="ch-desc">
            Tell us where you want to grow. We&apos;ll set up a free consultation, look at what you&apos;re
            doing today and suggest a plan that fits — from Kerala to the GCC and beyond.
          </p>

          <div className="ch-actions">
            <a href="#enquiry" className="ch-btn ch-btn--orange">
              Send an enquiry
              <span className="ch-btn-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
              </span>
            </a>
            <a href="tel:+918281001410" className="ch-btn ch-btn--ghost">
              +91-8281001410
              <span className="ch-btn-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
              </span>
            </a>
          </div>
        </div>

        {/* ── right: globe ── */}
        <div className="ch-globe">
          <Globe />
          <div className="ch-globe-tag" aria-hidden="true">
            <i /> Kochi · Thrissur → GCC, Europe, Asia
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ch-hero {
  --ch-orange: #F7811F;
  position: relative; overflow: hidden; isolation: isolate;
  background: #07070A; color: #fff;
  padding: 170px 0 150px;
}
.ch-stars { position: absolute; inset: 0; z-index: -2; }
.ch-glow {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(42% 55% at 76% 52%, rgba(247,129,31,.16), transparent 70%),
    radial-gradient(40% 50% at 12% 90%, rgba(110,70,200,.14), transparent 70%),
    linear-gradient(180deg, rgba(7,7,10,0) 70%, #07070A 100%);
}
.ch-wrap {
  position: relative; max-width: 1240px; margin: 0 auto; padding: 0 28px;
  display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 40px; align-items: center;
}

/* copy */
.ch-crumbs { display: flex; gap: 8px; align-items: center; font-size: 13px; color: rgba(255,255,255,.5); margin-bottom: 26px; }
.ch-crumbs a { color: rgba(255,255,255,.75); text-decoration: none; transition: color .2s; }
.ch-crumbs a:hover { color: var(--ch-orange); }
.ch-crumbs [aria-current] { color: #fff; }
.ch-eyebrow {
  display: inline-flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700;
  letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.7);
}
.ch-eyebrow::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: var(--ch-orange); box-shadow: 0 0 12px rgba(247,129,31,.6); }
.ch-title {
  margin: 18px 0 24px; font-size: clamp(38px, 5.4vw, 80px); line-height: 1.02;
  letter-spacing: -0.04em; font-weight: 800;
}
.ch-title-line { display: block; }
.ch-rotate { color: var(--ch-orange); white-space: nowrap; }
.ch-desc { margin: 0; max-width: 540px; font-size: 18px; line-height: 1.65; color: rgba(255,255,255,.66); }
.ch-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
.ch-btn {
  display: inline-flex; align-items: center; gap: 12px; text-decoration: none; font-weight: 700; font-size: 15px;
  border-radius: 999px; padding: 8px 8px 8px 22px; transition: transform .25s, background .25s;
}
.ch-btn:hover { transform: translateY(-2px); }
.ch-btn-icon { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: #fff; color: #0B0B0C; transition: transform .3s; }
.ch-btn:hover .ch-btn-icon { transform: rotate(45deg); }
.ch-btn--orange { background: var(--ch-orange); color: #fff; box-shadow: 0 10px 30px rgba(247,129,31,.35); }
.ch-btn--ghost { background: rgba(255,255,255,.06); color: #fff; border: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(6px); }

/* globe */
.ch-globe { position: relative; aspect-ratio: 1; width: 100%; max-width: 600px; justify-self: end; }
.ch-globe canvas { display: block; width: 100%; height: 100%; }
.ch-globe-tag {
  position: absolute; left: 50%; bottom: 2%; transform: translateX(-50%); white-space: nowrap;
  display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,.1); background: rgba(10,10,14,.6); backdrop-filter: blur(8px);
  font-size: 12px; color: rgba(255,255,255,.65); letter-spacing: .04em; pointer-events: none;
}
.ch-globe-tag i { width: 7px; height: 7px; border-radius: 50%; background: var(--ch-orange); box-shadow: 0 0 10px var(--ch-orange); }

.ch-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

@media (max-width: 1000px) {
  .ch-hero { padding: 140px 0 130px; }
  .ch-wrap { grid-template-columns: 1fr; gap: 10px; }
  .ch-globe { justify-self: center; max-width: 480px; margin-top: 10px; }
}
@media (max-width: 680px) {
  .ch-hero { padding: 120px 0 110px; }
  .ch-wrap { padding: 0 18px; }
  .ch-desc { font-size: 16px; }
  .ch-rotate { white-space: normal; }
  .ch-globe { max-width: 360px; }
  .ch-globe-tag { font-size: 11px; }
}
`;
