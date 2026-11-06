import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { BLOGS, getBlogBySlug, getRelatedBlogs, formatDate } from "@/data/blogs";
import { LearnHero, LearnCta, BlogCard, Cover, ArrowUpRight } from "@/components/learn/LearnUI";
import { ReadingProgress, ShareButtons } from "@/components/learn/ArticleClient";
import "@/styles/learn.css";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Pre-render every post at build time
export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Article not found | Mindstory" };
  return {
    title: `${post.title} | Mindstory Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

function Block({ block, first }) {
  switch (block.type) {
    case "h2":
      return <h2 id={slugify(block.text)}>{block.text}</h2>;
    case "list":
      return <ul>{block.items.map((it) => <li key={it}>{it}</li>)}</ul>;
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    default:
      return <p className={first ? "ls-lead" : undefined}>{block.text}</p>;
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const idx = BLOGS.findIndex((b) => b.slug === slug);
  const prev = BLOGS[idx - 1];
  const next = BLOGS[idx + 1];
  const related = getRelatedBlogs(slug, 3);
  const toc = post.content.filter((b) => b.type === "h2");
  const initials = post.author.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Mindstory" },
    publisher: { "@type": "Organization", name: "Mindstory" },
  };

  return (
    <>
      <ReadingProgress />
      <Navbar />
      <main className="ls-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <LearnHero
          className="ls-article-hero"
          crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.category }]}
          eyebrow={post.category}
          title={post.title}
        >
          <div className="ls-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time><i />
            <span>{post.readTime} min read</span>
          </div>
          <div className="ls-author">
            <span className="ls-avatar">{initials}</span>
            <div>
              <strong>{post.author.name}</strong>
              <small>{post.author.role}</small>
            </div>
          </div>
        </LearnHero>

        <div className="ls-wrap ls-article-cover">
          <Cover post={post} index={idx} priority />
        </div>

        <div className="ls-wrap ls-article-layout">
          <article>
            <div className="ls-prose">
              {post.content.map((b, i) => <Block key={i} block={b} first={i === 0} />)}
            </div>

            {(prev || next) && (
              <nav className="ls-postnav" aria-label="More articles">
                {prev ? (
                  <Link href={`/blog/${prev.slug}`}><small>← Previous</small><strong>{prev.title}</strong></Link>
                ) : <span />}
                {next ? (
                  <Link href={`/blog/${next.slug}`}><small>Next →</small><strong>{next.title}</strong></Link>
                ) : <span />}
              </nav>
            )}
          </article>

          <aside className="ls-aside">
            {toc.length > 0 && (
              <div className="ls-box">
                <h4>On this page</h4>
                <ul className="ls-toc">
                  {toc.map((h) => <li key={h.text}><a href={`#${slugify(h.text)}`}>{h.text}</a></li>)}
                </ul>
              </div>
            )}
            <div className="ls-box">
              <h4>Share</h4>
              <ShareButtons title={post.title} />
            </div>
            <div className="ls-box ls-box--dark">
              <h4>Need help with this?</h4>
              <p>Our team does this every day for brands across Kerala and the GCC.</p>
              <Link href="/contact" className="ls-btn ls-btn--orange">
                Talk to us <span className="ls-btn-icon"><ArrowUpRight /></span>
              </Link>
            </div>
          </aside>
        </div>

        <section className="ls-section" style={{ paddingTop: 0 }}>
          <div className="ls-wrap">
            <div className="ls-section-head">
              <div>
                <span className="ls-eyebrow">Keep reading</span>
                <h2 className="ls-h2">More from the blog.</h2>
              </div>
              <Link href="/blog" className="ls-btn ls-btn--dark">
                All articles <span className="ls-btn-icon"><ArrowUpRight /></span>
              </Link>
            </div>
            <div className="ls-grid">
              {related.map((p, i) => <BlogCard key={p.slug} post={p} index={i} />)}
            </div>
          </div>
        </section>

        <LearnCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
