import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BlogListing from "@/components/learn/BlogListing";
import { LearnHero, LearnCta } from "@/components/learn/LearnUI";
import "@/styles/learn.css";

export const metadata = {
  title: "Blog — Digital Marketing Insights | Mindstory",
  description:
    "Ideas, playbooks and marketing notes from Mindstory — SEO, analytics, social media, performance ads and branding.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="ls-page">
        <LearnHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Learn" }, { label: "Blog" }]}
          eyebrow="Featured blogs"
          title={<>Insights from the <em>digital frontline.</em></>}
          desc="Practical advice from the work we do every day — SEO, analytics, social, ads and branding."
        />
        <BlogListing />
        <LearnCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
