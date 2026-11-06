import Link from "next/link";
import StarField from "@/components/StarField";
import RotatingHeading from "@/components/RotatingHeading";

/**
 * Hero banner for the Works pages — same build as the Services hero:
 * drifting star field behind everything, copy with a rotating two-line
 * heading on the left, a creative visual on the right.
 *
 * `lines`  — [white line, orange line] pairs for the rotating heading
 * `visual` — what sits in the right column
 * `below`  — full-width content under the two columns (stats, marquee…)
 */
export default function WorksHero({ crumbs = [], eyebrow, lines, desc, visual, below, className = "", children }) {
  return (
    <section className={`wh-hero ${className}`}>
      <div className="wh-stars" aria-hidden="true">
        <StarField />
      </div>
      <div className="wh-glow" aria-hidden="true" />

      <div className="wh-wrap">
        <div className="wh-grid">
          {/* ── left: copy ── */}
          <div className="wh-copy">
            {crumbs.length > 0 && (
              <nav className="ls-crumbs" aria-label="Breadcrumb">
                {crumbs.map((c, i) => (
                  <span key={c.label} style={{ display: "contents" }}>
                    {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                    {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                  </span>
                ))}
              </nav>
            )}
            {eyebrow && <span className="ls-eyebrow ls-eyebrow--light">{eyebrow}</span>}
            <RotatingHeading lines={lines} className="wh-title" accentClassName="wh-accent" />
            {desc && <p className="ls-hero-desc wh-desc">{desc}</p>}
            {children}
          </div>

          {/* ── right: creative visual ── */}
          {visual && <div className="wh-visual">{visual}</div>}
        </div>

        {below}
      </div>
    </section>
  );
}
