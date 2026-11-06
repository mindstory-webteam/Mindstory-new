import { industryLabel } from "@/data/works";

/**
 * Right-hand visual for a case-study hero: the project's cover in a floating,
 * tilted browser frame in front of an orange planet, with a spinning
 * "case study" badge, industry + market chips and a "Delivered" card.
 * Pure CSS animation — server-safe.
 */
export default function CaseVisual({ work, index = 1, total = 1 }) {
  const ringId = `cv-ring-${work.slug}`;
  const pad = (n) => String(n).padStart(2, "0");
  const site = `${work.slug.replace(/-/g, "")}.com`;

  return (
    <div className="cv">
      <div className="cv-planet" aria-hidden="true" />
      <div className="cv-orbit" aria-hidden="true" />

      {/* the cover, framed like a live site */}
      <figure className="cv-frame">
        <div className="cv-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{site}</span>
        </div>
        <div className="cv-shot">
          <img src={work.image} alt={`${work.client} — ${work.title}`} loading="eager" decoding="async" />
        </div>
      </figure>

      {/* spinning badge */}
      <div className="cv-badge" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="cv-ring">
          <defs>
            <path id={ringId} d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
          </defs>
          <text>
            {/* textLength stretches the words to exactly one lap of the ring, so they never overlap */}
            <textPath href={`#${ringId}`} startOffset="0" textLength="286" lengthAdjust="spacing">
              CASE STUDY • MINDSTORY • CASE STUDY • MINDSTORY •
            </textPath>
          </text>
        </svg>
        <span className="cv-badge-num">
          {pad(index)}
          <small>/{pad(total)}</small>
        </span>
      </div>

      <span className="cv-chip cv-chip--industry">
        <i /> {industryLabel(work.industry)}
      </span>
      <span className="cv-chip cv-chip--market">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {work.location}
      </span>

      <div className="cv-card">
        <small>Delivered</small>
        <ul>
          {work.services.slice(0, 3).map((s) => (
            <li key={s}>
              <span aria-hidden="true">✓</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
