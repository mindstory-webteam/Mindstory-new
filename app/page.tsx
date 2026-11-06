import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import WhyUs from "@/components/WhyUs";
import OnAir from "@/components/OnAir";
import Reviews from "@/components/Reviews";
import Blogs from "@/components/Blogs";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
    <Preloader/>
      <Navbar />
      <main>
        <Hero />
         <Services />
        {/* <Clients /> */}
        <About />
       
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