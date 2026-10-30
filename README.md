# Mindstory — Website Redesign

Premium, minimal redesign of [mindstory.in](https://mindstory.in) built with **Next.js (App Router) + TypeScript**, **Tailwind CSS v4**, **GSAP + ScrollTrigger**, **Three.js** and **Lenis** smooth scroll.

Font: **Rubik** — the same family used on the current site (self-hosted via `@fontsource-variable/rubik`, no external font request).
Brand orange: `#F6811F` (sampled from the logo).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 18.18+ (Node 20/22 recommended).

## Structure

```
app/
  layout.tsx       Metadata/SEO, Rubik font, Lenis smooth scroll
  page.tsx         Homepage composition
  globals.css      Tailwind v4 theme tokens (colors, font), helpers
components/
  Navbar.tsx       Glass pill nav, dropdowns, hide-on-scroll, animated mobile menu
  Hero.tsx         Split-word headline reveal + Three.js canvas
  HeroCanvas.tsx   Three.js shader particle sphere with orbit rings (mouse + scroll reactive)
  Clients.tsx      Infinite brand marquee
  Services.tsx     Interactive service rows with line-draw reveals
  Work.tsx         Pinned horizontal-scroll case studies (desktop), swipe row (mobile)
  WhyUs.tsx        Scroll-scrubbed statement, count-up stats, pillars bento
  Reviews.tsx      Dual-direction Google review marquee
  Blogs.tsx        Featured posts with clip-path image reveals
  Faq.tsx          GSAP accordion
  Footer.tsx       Big CTA, magnetic button, footer, WhatsApp button
  Reveal.tsx       Global scroll reveals ([data-reveal], [data-reveal-words], [data-reveal-img])
  Magnetic.tsx     Magnetic hover wrapper
lib/
  data.ts          ALL copy, links, case studies, reviews, FAQs — edit content here
  gsap.ts          GSAP plugin registration + word splitter
public/
  logo.png, logo-light.png
```

## Notes

- Case-study and blog images load from `https://mindstory.in/wp-content/...` (allowed in `next.config.ts`). Swap them for local files in `/public` anytime by editing `lib/data.ts`.
- Links point to the existing mindstory.in inner pages, so this homepage can go live on its own.
- Animations respect `prefers-reduced-motion`.
