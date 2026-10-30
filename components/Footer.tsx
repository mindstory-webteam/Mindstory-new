"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowUpRight, WhatsApp } from "./Icons";
import Magnetic from "./Magnetic";
import LightRays from "./LightRays";

const serviceLinks = [
  { label: "Digital Marketing", href: "https://mindstory.in/digital-advertising/" },
  { label: "Social Media Management", href: "https://mindstory.in/social-media-marketing/" },
  { label: "Website Development", href: "https://mindstory.in/web-development/" },
  { label: "Logo & Branding", href: "https://mindstory.in/logo-identity/" },
  { label: "Creative Design", href: "https://mindstory.in/creative-design/" },
  { label: "SEO", href: "https://mindstory.in/search-engine-optimization/" },
];
const companyLinks = [
  { label: "About Us", href: "https://mindstory.in/about/" },
  { label: "Our Clients", href: "https://mindstory.in/clients/" },
  { label: "Case Studies", href: "https://mindstory.in/case-studies/" },
  { label: "Blog", href: "https://mindstory.in/blog/" },
  { label: "Careers", href: "https://mindstory.in/career/" },
  { label: "Request a Free Quote", href: "https://mindstory.in/request-quote/" },
];

// Right-hand CTA image (from mindstory.in). Swap for any image in /public, e.g. "/footer-cta.png".
const CTA_IMAGE = "/charter.png";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-cta-big]", {
        yPercent: 40,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 35%", scrub: true },
      });
      gsap.from("[data-cta-img]", {
        y: 80,
        rotate: 4,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-cta-img]", start: "top 90%" },
      });
      // gentle float once it's in place
      gsap.to("[data-cta-float]", { y: -14, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    },
    { scope: root }
  );

  return (
    <footer ref={root} id="contact" className="grain relative overflow-hidden bg-ink text-white">
      {/* LightRays background — brand-orange beams from the top */}
      <div className="pointer-events-none absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#f6811f"
          raysSpeed={0.8}
          lightSpread={0.9}
          rayLength={1.6}
          glow={0.5}
          haze={0.3}
          atmosphere={0.4}
          intensity={0.95}
          followMouse
          mouseInfluence={0.12}
          cursorShadow
          clickPulse
          fadeDistance={1.2}
          saturation={1.1}
          opacity={0.9}
        />
      </div>
      {/* soften the beams behind the link columns so text stays readable */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/85 to-transparent" />

      {/* CTA: copy + button on the left, image on the right */}
      <div className="container-x relative grid items-center gap-14 border-t border-white/10 pt-24 md:pt-36 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p data-reveal className="eyebrow text-white/60">Your success story starts here</p>
          <h2 data-cta-big className="mt-8 text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.045em]">
            Let&apos;s write <br className="hidden sm:block" />
            your <span className="text-brand">story.</span>
          </h2>
          <p className="mt-8 max-w-md text-lg text-white/60">
            Tell us where you want to go. We&apos;ll arrange a free consultation and craft a strategy tailored to your brand.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic>
              <a
                href={site.proposal}
                className="group inline-flex items-center gap-3 rounded-full bg-brand py-2 pl-7 pr-2 text-[15px] font-medium text-white shadow-[0_10px_40px_-10px_rgba(246,129,31,0.7)] transition-colors hover:bg-white hover:text-ink"
              >
                Get a Proposal
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Magnetic>
            <a href={site.phoneHref} className="text-[15px] text-white/70 underline-offset-8 transition-colors hover:text-white hover:underline">
              or call {site.phone}
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          {/* image only — the PNG is transparent, so no card or frame behind it */}
          <div data-cta-img className="relative mx-auto max-w-[520px]">
            <div className="pointer-events-none absolute inset-[12%] rounded-full bg-brand/25 blur-[90px]" aria-hidden />
            <div data-cta-float className="relative aspect-[1440/1172]">
              <Image
                src={CTA_IMAGE}
                alt="Mindstory astronaut mascot"
                fill
                sizes="(min-width:1024px) 520px, 90vw"
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* footer grid */}
      <div className="container-x relative mt-24 grid gap-12 border-t border-white/10 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Image src="/logo-light.png" alt="Mindstory — Digital Partner" width={489} height={127} className="h-10 w-auto" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/55">
            A trusted digital marketing agency in Kerala with 10+ years of expertise — creative strategies, measurable results and lasting brand growth.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Services</p>
          <ul className="mt-5 space-y-3">
            {serviceLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-[15px] text-white/75 transition-colors hover:text-brand">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Company</p>
          <ul className="mt-5 space-y-3">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-[15px] text-white/75 transition-colors hover:text-brand">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Contact</p>
          <a href={site.phoneHref} className="mt-5 block text-2xl font-medium hover:text-brand">{site.phone}</a>
          <a href={`mailto:${site.email}`} className="mt-2 block text-white/75 hover:text-brand">{site.email}</a>
          <p className="mt-2 text-sm text-white/45">{site.hours}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 transition-colors hover:border-brand hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x relative flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row">
        <p>© {new Date().getFullYear()} Mindstory. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="https://mindstory.in/privacy-policy/" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
        </div>
      </div>

      {/* floating WhatsApp */}
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition-transform hover:scale-110"
      >
        <WhatsApp className="h-7 w-7" />
      </a>
    </footer>
  );
}