"use client";

import { useEffect, useRef, useState } from "react";
import PillNav, { type PillNavItem } from "./PillNav";
import { nav, site } from "@/lib/data";
import { ArrowUpRight } from "./Icons";

// Top-level links (same pages as before) + the on-page section each one lights up for.
const ITEMS: PillNavItem[] = nav.map((n) => ({ label: n.label, href: n.href }));
const SECTION_FOR: Record<string, string> = {
  About: "about",
  Services: "services",
  Works: "work",
  Learn: "blog",
  Contact: "contact",
};

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | undefined>(undefined);
  const lastY = useRef(0);

  // hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 300 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: the dot follows whichever section is in the middle of the screen
  useEffect(() => {
    const entries = Object.entries(SECTION_FOR)
      .map(([label, id]) => ({ label, el: document.getElementById(id) }))
      .filter((e): e is { label: string; el: HTMLElement } => !!e.el);
    const onScroll = () => {
      const mid = window.innerHeight * 0.45;
      const hit = entries.find(({ el }) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      setActive(hit ? ITEMS.find((i) => i.label === hit.label)?.href : undefined);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
        hidden && !menuOpen ? "-translate-y-[140%]" : "translate-y-0"
      }`}
    >
      <div className="container-x flex items-start justify-between gap-3 pt-4">
        {/* PillNav: logo mark + pill bar; collapses into its own menu on small screens */}
        <div className="min-w-0 flex-1">
          <PillNav
            logo="/mindstory.webp"
            logoAlt="Mindstory home"
            logoHref="#top"
            items={ITEMS}
            activeHref={active ?? ""}
            theme="dark"
            layout="split"
            size="md"
            surface="glass"
            itemStyle="plain"
            hoverEffect="fill"
            indicator="dot"
            highlightColor="#f6811f"
            highlightTextColor="#ffffff"
            barColor="rgba(12, 11, 10, 0.72)"
            textColor="#ffffff"
            collapse="auto"
            onMenuToggle={setMenuOpen}
            ariaLabel="Main"
          />
        </div>

        {/* CTA */}
        <a
          href={site.proposal}
          className="group hidden h-11 shrink-0 items-center gap-2 rounded-full bg-brand pl-5 pr-1.5 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(246,129,31,0.8)] transition-colors hover:bg-brand-deep sm:inline-flex"
        >
          Get a Proposal
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    </header>
  );
}