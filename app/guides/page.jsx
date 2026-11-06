import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import GuidesList from "@/components/learn/GuidesList";
import { LearnHero, LearnCta } from "@/components/learn/LearnUI";
import "@/styles/learn.css";

export const metadata = {
  title: "Guides — Step-by-step Marketing Playbooks | Mindstory",
  description:
    "Free step-by-step playbooks from Mindstory for local SEO, GA4, social content, landing pages, Google Ads and branding.",
};

export default function GuidesPage() {
  return (
    <>
      <Navbar />
      <main className="ls-page">
        <LearnHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Learn" }, { label: "Guides" }]}
          eyebrow="Guides"
          title={<>Step-by-step <em>playbooks.</em></>}
          desc="The same checklists our team uses on client work — written so you can follow them yourself."
        />
        <GuidesList />
        <LearnCta
          title="Rather have us run the playbook?"
          desc="We'll handle the setup, the testing and the reporting — you get the results."
        />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
