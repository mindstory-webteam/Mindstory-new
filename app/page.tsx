import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Services from "@/components/Services";
import Work from "@/components/Work";
import WhyUs from "@/components/WhyUs";
import OnAir from "@/components/OnAir";
import Reviews from "@/components/Reviews";
import Blogs from "@/components/Blogs";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <Services />
        <Work />
        <OnAir />
        <WhyUs />
        <Reviews />
        <Blogs />
        <Faq />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
