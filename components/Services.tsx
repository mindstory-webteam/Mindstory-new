"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FlowingMenu, { type FlowingMenuItem } from "./FlowingMenu";
import { services, caseStudies } from "@/lib/data";

/*
  Each row: short name in the list, a flowing band on hover with the longer
  promise + a looping video (with a work image as its poster). Replace the
  dummy VIDEOS below with your own clips.
*/
const SHORT = ["SEO", "Social Media", "Performance Ads", "Web Design", "Branding", "Email Marketing"];
const IMAGES = [
  caseStudies[4].img, // Indel Money
  caseStudies[7].img, // Motory
  caseStudies[0].img, // Kairali Ford
  caseStudies[3].img, // Wincentre
  caseStudies[1].img, // Spais
  caseStudies[5].img, // Gold's Gym
];

// Dummy clips from public test-video hosts (all checked to load). Swap for your own,
// e.g. "/videos/seo.mp4" placed in /public/videos.
const VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
  "https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
];

const META = ["Rank #1", "Engage", "Convert", "Captivate", "Identity", "Retain"];

const buildItems = (withMeta: boolean): FlowingMenuItem[] =>
  services.map((s, i) => ({
    text: SHORT[i] ?? s.tag,
    link: s.href,
    marquee: s.title,
    image: IMAGES[i], // poster while the video loads
    video: VIDEOS[i],
    meta: withMeta ? META[i] : undefined,
  }));

export default function Services() {
  const holder = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [wide, setWide] = useState(true);

  // the small side label only on larger screens, so long names never collide with it
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const items = useMemo(() => buildItems(wide), [wide]);

  // mount the menu when it scrolls into view, so its intro sweep is actually seen
  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="services" className="bg-paper py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <p data-reveal className="eyebrow text-muted md:col-span-3">What we do</p>
          <div className="md:col-span-9">
            <h2 data-reveal-words className="text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              An all-in-one digital marketing hub to <span className="text-brand">elevate</span> your brand.
            </h2>
            <p data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              From SEO to custom website design, one team for the whole journey — expanding traffic, boosting revenue and unlocking real business growth.
            </p>
          </div>
        </div>
      </div>

      <div ref={holder} className="mt-14 h-[480px] border-y border-line sm:h-[600px] md:mt-20 md:h-[720px]">
        {show && (
          <FlowingMenu
            items={items}
            ariaLabel="Our services"
            align="left"
            showIndex
            showArrow
            imageShape="pill"
            speed={70}
            direction="alternate"
            followCursor={0.4}
            magnet={0.2}
            stretch={0.6}
            textColor="#0c0b0a"
            bgColor="#f7f4ef"
            marqueeBgColor="#f6811f"
            marqueeTextColor="#ffffff"
            borderColor="#e6e0d6"
            dimInactive
          />
        )}
      </div>

      <div className="container-x mt-8 flex flex-col justify-between gap-4 text-sm text-muted sm:flex-row sm:items-center">
        <p>Hover a service to see the work behind it.</p>
        <a href="https://mindstory.in/services/" className="font-medium text-ink underline-offset-4 hover:text-brand hover:underline">
          All services →
        </a>
      </div>
    </section>
  );
}