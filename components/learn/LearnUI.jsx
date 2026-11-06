import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/data/blogs";

/* ── Icons ── */
export const ArrowUpRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" /><path d="M8 7h9v9" />
  </svg>
);
export const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/* ── Dark page hero (same look as the home hero) ── */
export function LearnHero({ eyebrow, title, desc, crumbs = [], className = "", children }) {
  return (
    <section className={`ls-hero ${className}`}>
      <div className="ls-hero-orbit" aria-hidden="true" />
      <div className="ls-wrap">
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
        <h1 className="ls-hero-title">{title}</h1>
        {desc && <p className="ls-hero-desc">{desc}</p>}
        {children}
      </div>
    </section>
  );
}

/* ── Cover: real image if provided, otherwise branded planet art ── */
export function Cover({ post, index = 0, priority = false, showTag = true }) {
  return (
    <div className="ls-cover">
      {post.cover ? (
        <Image src={post.cover} alt={post.title} fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={priority} />
      ) : (
        <div className="ls-cover-art" data-v={index % 3} aria-hidden="true">
          <span className="ls-cover-word">{post.category}</span>
        </div>
      )}
      {showTag && post.cover && <span className="ls-cover-tag">{post.category}</span>}
    </div>
  );
}

/* ── Blog card ── */
export function BlogCard({ post, index = 0 }) {
  return (
    <Link href={`/blog/${post.slug}`} className="ls-card">
      <Cover post={post} index={index} />
      <div className="ls-card-body">
        <div className="ls-meta">
          <span>{post.category}</span><i />
          <time dateTime={post.date}>{formatDate(post.date)}</time><i />
          <span>{post.readTime} min read</span>
        </div>
        <h3 className="ls-card-title">{post.title}</h3>
        <p className="ls-card-excerpt">{post.excerpt}</p>
        <span className="ls-card-more">Continue reading <ArrowRight /></span>
      </div>
    </Link>
  );
}

/* ── Bottom CTA band ── */
export function LearnCta({
  title = "Ready to write your success story?",
  desc = "Talk to us — we'll arrange a free consultation to understand your needs.",
}) {
  return (
    <section className="ls-section" style={{ paddingTop: 0 }}>
      <div className="ls-wrap">
        <div className="ls-cta">
          <div>
            <span className="ls-eyebrow ls-eyebrow--light">Your success story starts here</span>
            <h2>{title}</h2>
            <p>{desc}</p>
          </div>
          <div className="ls-cta-actions">
            <Link href="/contact" className="ls-btn ls-btn--orange">
              Get a Proposal <span className="ls-btn-icon"><ArrowUpRight /></span>
            </Link>
            <a href="tel:+918281001410" className="ls-btn ls-btn--ghost">
              +91-8281001410 <span className="ls-btn-icon"><ArrowUpRight /></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
