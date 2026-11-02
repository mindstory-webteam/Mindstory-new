"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/* ------------------------------------------------------------------ */
/* Mega menu content — keyed by the nav label. Items without an entry  */
/* (e.g. Contact) behave like normal links. Replace hrefs with yours.  */
/* ------------------------------------------------------------------ */
type MegaLink = { label: string; href: string; desc?: string };
type MegaMenu = {
  eyebrow: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
  columns: { heading: string; links: MegaLink[] }[];
  feature?: { tag: string; title: string; href: string };
};

const MEGA: Record<string, MegaMenu> = {
  About: {
    eyebrow: "Who we are",
    title: "A Kerala agency with a storyteller's brain",
    desc: "Strategists, designers, writers and media buyers working as one team.",
    cta: { label: "Our story", href: "/about" },
    columns: [
      {
        heading: "Company",
        links: [
          { label: "About Mindstory", href: "/about", desc: "Who we are and how we work" },
          { label: "Our process", href: "/about#process", desc: "From brief to launch" },
          { label: "Team", href: "/about#team", desc: "The people behind the work" },
        ],
      },
      {
        heading: "Join us",
        links: [
          { label: "Careers", href: "/careers", desc: "Open roles" },
          { label: "Internships", href: "/careers#internships", desc: "Learn on real briefs" },
        ],
      },
    ],
  },
  Services: {
    eyebrow: "What we do",
    title: "Everything your brand needs to grow",
    desc: "Pick one service or let us run the whole thing end to end.",
    cta: { label: "All services", href: "/services" },
    columns: [
      {
        heading: "Brand",
        links: [
          { label: "Brand strategy", href: "/services/brand-strategy", desc: "Positioning and messaging" },
          { label: "Identity design", href: "/services/branding", desc: "Logos, systems, guidelines" },
          { label: "Video production", href: "/services/video", desc: "Ads, reels and films" },
        ],
      },
      {
        heading: "Growth",
        links: [
          { label: "Social media", href: "/services/social-media", desc: "Content and community" },
          { label: "Performance ads", href: "/services/performance-marketing", desc: "Meta & Google campaigns" },
          { label: "SEO", href: "/services/seo", desc: "Rank and get found" },
        ],
      },
      {
        heading: "Digital",
        links: [
          { label: "Web design", href: "/services/web-design", desc: "Fast, modern websites" },
          { label: "E-commerce", href: "/services/ecommerce", desc: "Stores that convert" },
        ],
      },
    ],
    feature: { tag: "Free audit", title: "Get a free review of your digital presence", href: "/contact" },
  },
  Works: {
    eyebrow: "Our work",
    title: "Brands we've helped tell their story",
    desc: "Campaigns, identities and websites across industries.",
    cta: { label: "View all work", href: "/works" },
    columns: [
      {
        heading: "By type",
        links: [
          { label: "Branding", href: "/works?type=branding" },
          { label: "Campaigns", href: "/works?type=campaigns" },
          { label: "Websites", href: "/works?type=web" },
          { label: "Video", href: "/works?type=video" },
        ],
      },
      {
        heading: "By industry",
        links: [
          { label: "Real estate", href: "/works?industry=real-estate" },
          { label: "Healthcare", href: "/works?industry=healthcare" },
          { label: "Education", href: "/works?industry=education" },
          { label: "Retail & F&B", href: "/works?industry=retail" },
        ],
      },
    ],
    feature: { tag: "Case study", title: "See how a campaign turned clicks into customers", href: "/works" },
  },
  Learn: {
    eyebrow: "Learn",
    title: "Ideas, playbooks and marketing notes",
    desc: "Practical advice from the work we do every day.",
    cta: { label: "Read the blog", href: "/blog" },
    columns: [
      {
        heading: "Resources",
        links: [
          { label: "Blog", href: "/blog", desc: "Latest articles" },
          { label: "Guides", href: "/blog?tag=guides", desc: "Step-by-step playbooks" },
          { label: "FAQs", href: "/faq", desc: "Answers to common questions" },
        ],
      },
    ],
  },
};

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | undefined>(undefined);
  const [mega, setMega] = useState<string | null>(null); // label of open mega menu
  const [shownMega, setShownMega] = useState<string | null>(null); // keeps content during fade-out
  const [desktop, setDesktop] = useState(false);
  const lastY = useRef(0);
  const navWrap = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  /* ---------------- mega menu ---------------- */

  // mega menus are desktop-only; PillNav's own collapsed menu handles small screens
  useEffect(() => {
    const mq = matchMedia(DESKTOP_QUERY);
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const openMega = useCallback(
    (label: string) => {
      cancelClose();
      setMega(label);
      setShownMega(label);
    },
    [cancelClose]
  );

  const closeMega = useCallback(() => {
    cancelClose();
    setMega(null);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMega(null), 160);
  }, [cancelClose]);

  // find which nav item (if any) a DOM node belongs to
  const labelFor = (target: EventTarget | null): string | null => {
    const a = (target as HTMLElement | null)?.closest?.("a");
    if (!a || !navWrap.current?.contains(a)) return null;
    const href = a.getAttribute("href");
    return ITEMS.find((i) => i.href === href)?.label ?? null;
  };

  const onNavOver = (e: React.MouseEvent | React.FocusEvent) => {
    if (!desktop || menuOpen) return;
    const label = labelFor(e.target);
    if (label && MEGA[label]) openMega(label);
    else if (label) closeMega(); // a plain link like Contact
  };

  // mark PillNav's links that own a mega menu, and keep aria-expanded in sync
  useEffect(() => {
    const links = navWrap.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [];
    links.forEach((a) => {
      const label = ITEMS.find((i) => i.href === a.getAttribute("href"))?.label;
      if (label && MEGA[label] && desktop) {
        a.setAttribute("aria-haspopup", "true");
        a.setAttribute("aria-expanded", String(mega === label));
        a.setAttribute("aria-controls", "mega-panel");
      } else {
        a.removeAttribute("aria-haspopup");
        a.removeAttribute("aria-expanded");
        a.removeAttribute("aria-controls");
      }
    });
  }, [mega, desktop]);

  // close on Escape, on outside click, when the bar hides, or when the mobile menu opens
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const label = mega;
        closeMega();
        // return focus to the trigger
        const trigger = Array.from(navWrap.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []).find(
          (a) => a.getAttribute("href") === ITEMS.find((i) => i.label === label)?.href
        );
        trigger?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!navWrap.current?.contains(t) && !panelRef.current?.contains(t)) closeMega();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [mega, closeMega]);

  useEffect(() => {
    if (hidden || menuOpen || !desktop) setMega(null);
  }, [hidden, menuOpen, desktop]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  const menu = shownMega ? MEGA[shownMega] : null;
  const isOpen = !!mega;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
        hidden && !menuOpen && !isOpen ? "-translate-y-[140%]" : "translate-y-0"
      }`}
    >
      <div className="container-x flex items-start justify-between gap-3 pt-4">
        {/* PillNav: logo mark + pill bar; collapses into its own menu on small screens */}
        <div
          ref={navWrap}
          className="min-w-0 flex-1"
          onMouseOver={onNavOver}
          onFocus={onNavOver}
          onMouseLeave={() => isOpen && scheduleClose()}
        >
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

      {/* Mega menu panel — desktop only, sits just under the bar */}
      {desktop && (
        <div className="container-x relative">
          <div
            id="mega-panel"
            ref={panelRef}
            role="region"
            aria-label={shownMega ? `${shownMega} menu` : undefined}
            aria-hidden={!isOpen}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onTransitionEnd={() => !isOpen && setShownMega(null)}
            className={`absolute inset-x-0 top-0 pt-3 transition-[opacity,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
              isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            }`}
            // keep links out of the tab order while closed
            inert={!isOpen}
          >
            {menu && (
              <div
                key={shownMega}
                className="grid grid-cols-12 gap-6 overflow-hidden rounded-3xl border border-white/10 p-6 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl backdrop-saturate-150"
                style={{ background: "rgba(12, 11, 10, 0.72)" }}
              >
                {/* intro */}
                <div className="col-span-4 flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#f6811f]">{menu.eyebrow}</p>
                    <p className="mt-3 text-xl font-semibold leading-snug tracking-tight">{menu.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{menu.desc}</p>
                  </div>
                  <a
                    href={menu.cta.href}
                    onClick={closeMega}
                    className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 text-sm font-medium transition-colors hover:bg-[#f6811f]"
                  >
                    {menu.cta.label}
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </div>

                {/* link columns */}
                <div
                  className={`${menu.feature ? "col-span-5" : "col-span-8"} grid gap-6`}
                  style={{ gridTemplateColumns: `repeat(${menu.columns.length}, minmax(0, 1fr))` }}
                >
                  {menu.columns.map((col) => (
                    <div key={col.heading}>
                      <p className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.14em] text-white/40">{col.heading}</p>
                      <ul className="space-y-1">
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <a
                              href={l.href}
                              onClick={closeMega}
                              className="group block rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.08] focus-visible:bg-white/[0.08] focus-visible:outline-none"
                            >
                              <span className="flex items-center gap-2 text-sm font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-white/25 transition-colors group-hover:bg-[#f6811f]" />
                                {l.label}
                              </span>
                              {l.desc && <span className="mt-0.5 block pl-3.5 text-xs text-white/50">{l.desc}</span>}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* feature card */}
                {menu.feature && (
                  <a
                    href={menu.feature.href}
                    onClick={closeMega}
                    className="group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-2xl p-5"
                    style={{
                      background:
                        "radial-gradient(120% 90% at 100% 0%, rgba(246,129,31,0.55) 0%, rgba(246,129,31,0.12) 45%, rgba(255,255,255,0.03) 100%)",
                    }}
                  >
                    <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    <span className="w-fit rounded-full border border-white/25 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider">
                      {menu.feature.tag}
                    </span>
                    <span className="mt-3 text-base font-semibold leading-snug">{menu.feature.title}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}