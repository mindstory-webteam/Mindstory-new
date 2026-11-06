import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import FaqList from "@/components/learn/FaqList";
import { LearnHero, LearnCta, ArrowUpRight } from "@/components/learn/LearnUI";
import { FAQ_GROUPS } from "@/data/faqs";
import "@/styles/learn.css";

export const metadata = {
  title: "FAQs — Questions, Answered | Mindstory",
  description:
    "Answers to common questions about Mindstory's SEO, social media, ads, branding and web development services.",
};

export default function FaqsPage() {
  // FAQ rich results for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      }))
    ),
  };

  return (
    <>
      <Navbar />
      <main className="ls-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <LearnHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Learn" }, { label: "FAQs" }]}
          eyebrow="FAQ"
          title={<>Questions, <em>answered.</em></>}
          desc="Still curious? Talk to us — we'll arrange a free consultation to understand your needs."
        >
          <div style={{ marginTop: 30 }}>
            <a href="tel:+918281001410" className="ls-btn ls-btn--orange">
              +91-8281001410 <span className="ls-btn-icon"><ArrowUpRight /></span>
            </a>
          </div>
        </LearnHero>
        <FaqList />
        <LearnCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
