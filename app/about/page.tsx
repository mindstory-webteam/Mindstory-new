import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutStats from "@/components/about/AboutStats";
import AboutTimeline from "@/components/about/AboutTimeline";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import AboutLocations from "@/components/about/AboutLocations";
import AboutCta from "@/components/about/AboutCta";

export const metadata: Metadata = {
  title: "About Us | Mindstory — Digital Marketing Agency in Kerala",
  description:
    "Since 2016, Mindstory has helped 400+ brands grow with story-led digital marketing — SEO, social, performance ads, web and branding from Thrissur, Kochi and the GCC.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutStats />
        <AboutTimeline />
        <AboutValues />
        <AboutTeam />
        <AboutLocations />
        <AboutCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}