import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { LearnHero, LearnCta, ArrowUpRight } from "@/components/learn/LearnUI";
import WorkCard, { WorkMedia } from "@/components/works/WorkCard";
import { WORKS, getWork, typeLabel, industryLabel } from "@/data/works";
import "@/styles/learn.css";
import "@/styles/pages.css";
import "@/styles/works.css";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return { title: "Project not found | Mindstory" };
  return {
    title: `${work.client} Case Study — ${work.category} | Mindstory`,
    description: work.tagline,
    openGraph: { title: `${work.client} — ${work.title}`, description: work.tagline, images: [work.image] },
  };
}

export default async function WorkDetailPage({ params }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const idx = WORKS.indexOf(work);
  const next = WORKS[(idx + 1) % WORKS.length];
  const related = WORKS.filter((w) => w.slug !== work.slug && w.slug !== next.slug &&
    (w.industry === work.industry || w.types.some((t) => work.types.includes(t)))).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="ls-page">
        <LearnHero
          className="ls-case-hero"
          crumbs={[{ label: "Home", href: "/" }, { label: "Works", href: "/works" }, { label: work.client }]}
          eyebrow={`Case study · ${work.category}`}
          title={work.title}
          desc={work.tagline}
        >
          <div className="ls-case-tags">
            {work.services.map((s) => <span key={s}>{s}</span>)}
          </div>
        </LearnHero>

        <div className="ls-wrap ls-case-cover">
          <WorkMedia work={work} eager />
          <div className="ls-case-facts">
            <div><small>Client</small><b>{work.client}</b></div>
            <div><small>Industry</small><b>{industryLabel(work.industry)}</b></div>
            <div><small>Work</small><b>{work.types.map(typeLabel).join(", ")}</b></div>
            <div><small>Market</small><b>{work.location}</b></div>
          </div>
        </div>

        <div className="ls-wrap" style={{ paddingTop: 30, paddingBottom: 60 }}>
          <section className="ls-case-block">
            <h2><small>01</small>The challenge</h2>
            <div><p>{work.challenge}</p></div>
          </section>

          <section className="ls-case-block">
            <h2><small>02</small>Our approach</h2>
            <div>
              <ol className="ls-case-steps">
                {work.approach.map((a) => <li key={a}>{a}</li>)}
              </ol>
            </div>
          </section>

          <section className="ls-case-block">
            <h2><small>03</small>What we delivered</h2>
            <div className="ls-case-chips">
              {work.delivered.map((d) => <span key={d}>{d}</span>)}
            </div>
          </section>

          <section className="ls-case-block">
            <h2><small>04</small>The outcome</h2>
            <div className="ls-case-results">
              {work.results.map((r) => <div key={r}><span>{r}</span></div>)}
            </div>
          </section>
        </div>

        {/* ── Next project ── */}
        <section className="ls-section" style={{ paddingTop: 0 }}>
          <div className="ls-wrap">
            <Link href={`/works/${next.slug}`} className="ls-next">
              <div className="ls-next-body">
                <span className="ls-eyebrow ls-eyebrow--light">Next project</span>
                <h3>{next.client}</h3>
                <p>{next.tagline}</p>
                <span className="ls-btn ls-btn--orange" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                  View case study <span className="ls-btn-icon"><ArrowUpRight /></span>
                </span>
              </div>
              <WorkMedia work={next} />
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <section className="ls-section" style={{ paddingTop: 0 }}>
            <div className="ls-wrap">
              <div className="ls-section-head">
                <div>
                  <span className="ls-eyebrow">More work</span>
                  <h2 className="ls-h2">Similar projects.</h2>
                </div>
                <Link href="/works" className="ls-btn ls-btn--dark">
                  View all work <span className="ls-btn-icon"><ArrowUpRight /></span>
                </Link>
              </div>
              <div className="ls-works">
                {related.map((w) => <WorkCard key={w.slug} work={w} num={WORKS.indexOf(w) + 1} />)}
              </div>
            </div>
          </section>
        )}

        <LearnCta title={`Want results like ${work.client}?`} desc="Tell us about your brand — we'll set up a free consultation." />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
