"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BLOGS, BLOG_CATEGORIES, formatDate } from "@/data/blogs";
import { BlogCard, Cover, ArrowUpRight } from "./LearnUI";

const PAGE_SIZE = 6;

export default function BlogListing() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const featured = BLOGS.find((b) => b.featured) || BLOGS[0];
  const isFiltering = cat !== "All" || query.trim() !== "";

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOGS.filter((b) => {
      if (!isFiltering && b.slug === featured.slug) return false; // featured shown separately
      if (cat !== "All" && b.category !== cat) return false;
      if (q && !`${b.title} ${b.excerpt} ${b.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [cat, query, isFiltering, featured.slug]);

  return (
    <section className="ls-section">
      <div className="ls-wrap">
        {!isFiltering && (
          <Link href={`/blog/${featured.slug}`} className="ls-featured">
            <Cover post={featured} index={1} priority />
            <div className="ls-featured-body">
              <span className="ls-badge">Featured</span>
              <div className="ls-meta">
                <span>{featured.category}</span><i />
                <time dateTime={featured.date}>{formatDate(featured.date)}</time><i />
                <span>{featured.readTime} min read</span>
              </div>
              <h2 className="ls-featured-title">{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="ls-btn ls-btn--orange" style={{ alignSelf: "flex-start" }}>
                Read the article <span className="ls-btn-icon"><ArrowUpRight /></span>
              </span>
            </div>
          </Link>
        )}

        <div className="ls-toolbar">
          <div className="ls-chips" role="tablist" aria-label="Filter by category">
            {BLOG_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={cat === c}
                className={`ls-chip ${cat === c ? "is-active" : ""}`}
                onClick={() => { setCat(c); setVisible(PAGE_SIZE); }}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="ls-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input
              type="search"
              placeholder="Search articles"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
              aria-label="Search articles"
            />
          </label>
        </div>

        {posts.length === 0 ? (
          <div className="ls-empty">No articles match that yet. Try another category or search.</div>
        ) : (
          <div className="ls-grid">
            {posts.slice(0, visible).map((p, i) => <BlogCard key={p.slug} post={p} index={i} />)}
          </div>
        )}

        {visible < posts.length && (
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button type="button" className="ls-btn ls-btn--dark" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load more articles <span className="ls-btn-icon"><ArrowUpRight /></span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
