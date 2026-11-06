import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCta from "@/components/services/ServiceCta";
import SpaceBackdrop from "@/components/services/SpaceBackdrop";
import ServiceIcon from "@/components/services/ServiceIcon";
import { categories, getServicesByCategory, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Digital Marketing Services in Kerala | Mindstory",
  description:
    "Brand strategy, identity design, video, social media, performance ads, SEO, web design and e-commerce — everything your brand needs to grow, from Mindstory in Thrissur & Kochi.",
};

const approach = [
  { title: "Listen", text: "A free consultation to understand your business, goals and audience." },
  { title: "Plan", text: "A strategy and clear KPIs built around what you want to achieve." },
  { title: "Create", text: "Our in-house team designs, builds, shoots and launches." },
  { title: "Grow", text: "Monthly reports, honest reviews and constant improvement." },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── hero ── */}
        <section className="relative isolate overflow-hidden bg-ink pb-20 pt-36 text-white md:pb-28 md:pt-48">
          <SpaceBackdrop />
          <div className="container-x">
            <nav data-reveal="true" aria-label="Breadcrumb" className="text-sm text-white/40">
              <Link href="/" className="transition-colors hover:text-brand">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/70">Services</span>
            </nav>

            <p data-reveal="true" className="eyebrow mt-10 text-white/40">
              What we do
            </p>
            <h1
              data-reveal-words="true"
              className="mt-6 max-w-5xl text-[clamp(2.8rem,7vw,6.4rem)] font-medium leading-[0.95] tracking-[-0.04em]"
            >
              Everything your brand <span className="text-brand">needs to grow.</span>
            </h1>

            <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-12">
              <p data-reveal="true" className="text-lg leading-relaxed text-white/60 md:col-span-6">
                Pick one service or let us run the whole thing end to end. {services.length} services across brand, growth
                and digital — all under one roof in Thrissur and Kochi.
              </p>
              <div data-reveal="true" className="flex flex-wrap items-start gap-2 md:col-span-5 md:col-start-8 md:justify-end">
                {categories.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:border-brand hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    {c.label}
                    <span className="text-white/40">{getServicesByCategory(c.id).length}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* all services at a glance */}
            <div data-reveal="true" className="mt-14 flex flex-wrap gap-3">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-white/5 py-2 pl-2 pr-4 text-sm text-white/80 ring-1 ring-white/10 transition-colors hover:bg-brand hover:text-white hover:ring-brand"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-brand transition-colors group-hover:bg-white group-hover:text-brand">
                    <ServiceIcon name={s.icon} className="h-4 w-4" />
                  </span>
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── services by category ── */}
        {categories.map((c, ci) => {
          const list = getServicesByCategory(c.id);
          return (
            <section key={c.id} id={c.id} className={`scroll-mt-24 bg-paper py-20 text-ink md:py-28 ${ci ? "border-t border-line" : ""}`}>
              <div className="container-x grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="lg:sticky lg:top-32">
                    <p data-reveal="true" className="eyebrow text-muted">
                      {String(ci + 1).padStart(2, "0")} · {c.label}
                    </p>
                    <h2
                      data-reveal-words="true"
                      className="mt-5 text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.03em]"
                    >
                      {c.title}
                    </h2>
                    <p data-reveal="true" className="mt-5 max-w-sm text-lg leading-relaxed text-muted">
                      {c.text}
                    </p>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
                  {list.map((s, k) => (
                    <ServiceCard
                      key={s.slug}
                      service={s}
                      index={services.indexOf(s)}
                      // odd number of services → the last card spans the full row
                      wide={list.length % 2 === 1 && k === list.length - 1}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* ── how we work ── */}
        <section className="border-t border-line bg-paper py-20 text-ink md:py-28">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p data-reveal="true" className="eyebrow text-muted">
                  How we work
                </p>
                <h2
                  data-reveal-words="true"
                  className="mt-5 text-[clamp(2rem,4.4vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.03em]"
                >
                  One team. <span className="text-brand">One plan.</span>
                </h2>
              </div>
              <p data-reveal="true" className="max-w-sm text-lg leading-relaxed text-muted">
                Every engagement follows the same simple rhythm — with a dedicated manager keeping you in the loop.
              </p>
            </div>
            <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {approach.map((a, i) => (
                <li key={a.title} data-reveal="true" className="group bg-paper p-8 transition-colors duration-500 hover:bg-white">
                  <span className="text-sm font-medium text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-8 text-2xl font-medium tracking-tight">{a.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{a.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ServiceCta />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
