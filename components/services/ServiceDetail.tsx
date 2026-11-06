import Link from "next/link";
import { getCategory, whyMindstory, type Service } from "@/lib/services";
import StarField from "@/components/StarField";
import RotatingHeading from "@/components/RotatingHeading";
import ServiceIcon, { Arrow } from "./ServiceIcon";
import ServiceCard from "./ServiceCard";
import ServiceCta from "./ServiceCta";
import OrbitPlanet from "./OrbitPlanet";
import ServiceImage from "./ServiceImage";

/** lower-case a service name for use mid-sentence, but keep acronyms like "SEO" */
const inSentence = (t: string) => (t === t.toUpperCase() ? t : t.toLowerCase());

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** The common service page — everything on it comes from the `service` data object. */
export default function ServiceDetail({ service, related }: { service: Service; related: Service[] }) {
  const category = getCategory(service.category);
  const [mainWork, ...otherWork] = service.showcase;

  // banner heading: the service's own headline first, then a few short lines
  // built from its name — every pair reads as a complete phrase
  const headlines: [string, string][] = [
    [service.headline[0].trim(), service.headline[1]],
    [service.title, "that drives growth."],
    [service.title, "done right."],
    [service.title, "built for your brand."],
  ];

  return (
    <>
      <style>{`
        @keyframes sd-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .sd-marquee { animation: sd-marquee 32s linear infinite; }
        .sd-marquee-wrap:hover .sd-marquee { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .sd-marquee { animation: none; } }
      `}</style>

      {/* ── hero ── */}
      <section className="relative isolate overflow-hidden bg-ink pb-28 pt-36 text-white md:pb-40 md:pt-48">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <StarField />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 hidden h-[640px] w-[640px] rounded-full bg-brand/15 blur-[140px] lg:block"
          style={{ right: "4%", top: "50%", transform: "translateY(-50%)" }}
        />

        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <nav data-reveal="true" aria-label="Breadcrumb" className="text-sm text-white/40">
              <Link href="/" className="transition-colors hover:text-brand">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/services" className="transition-colors hover:text-brand">
                Services
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/70">{service.title}</span>
            </nav>

            <p data-reveal="true" className="eyebrow mt-10 text-white/40">
              {category.label} · {service.title}
            </p>
            {/* plain data-reveal (not data-reveal-words): the word splitter would rewrite the rotating letters */}
            <div data-reveal="true">
              <RotatingHeading
                lines={headlines}
                className="mt-6 text-[clamp(2.6rem,6.4vw,5.8rem)] font-medium leading-[0.96] tracking-[-0.04em]"
              />
            </div>
            <p data-reveal="true" className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
              {service.intro}
            </p>

            <div data-reveal="true" className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="https://mindstory.in/growth-marketing/"
                className="group inline-flex items-center gap-3 rounded-full bg-brand py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
              >
                Get a Proposal
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                  <Arrow />
                </span>
              </a>
              <a href="#included" className="text-[15px] font-medium text-white/70 underline-offset-8 hover:text-white hover:underline">
                What&apos;s included
              </a>
            </div>
          </div>

          <div data-reveal="true" className="hidden lg:col-span-5 lg:block">
            <OrbitPlanet icon={service.icon} seed={service.slug} />
          </div>
        </div>
      </section>

      {/* ── highlights (overlapping the hero) ── */}
      <section className="relative z-10 -mt-14 bg-transparent md:-mt-20">
        <div className="container-x">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-[0_30px_60px_-30px_rgba(12,11,10,0.35)] sm:grid-cols-3">
            {service.highlights.map((h) => (
              <div key={h.label} data-reveal="true" className="bg-white px-7 py-8 md:px-10 md:py-10">
                <p className="text-[clamp(2rem,3.8vw,3.2rem)] font-medium leading-none tracking-[-0.04em] text-ink">{h.value}</p>
                <p className="mt-3 text-sm text-muted">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── overview: image + why it matters ── */}
      <section className="bg-paper pb-8 pt-24 text-ink md:pt-32">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div data-reveal="true" className="relative lg:col-span-6">
            <ServiceImage
              src={service.overview.image.src}
              alt={service.overview.image.alt}
              label={service.title}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[5/4] rounded-[2rem] lg:aspect-[4/5]"
            />
            {/* floating badge */}
            <div className="absolute -bottom-7 left-6 flex items-center gap-4 rounded-2xl bg-ink py-4 pl-4 pr-6 text-white shadow-[0_24px_50px_-20px_rgba(12,11,10,0.6)] md:left-10">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand">
                <ServiceIcon name={service.icon} className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-white/40">{category.label}</span>
                <span className="block text-base font-medium">{service.title}</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <p data-reveal="true" className="eyebrow text-muted">
              Why it matters
            </p>
            <h2
              data-reveal-words="true"
              className="mt-5 text-[clamp(2rem,4.2vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em]"
            >
              {service.overview.title[0]}
              <span className="text-brand">{service.overview.title[1]}</span>
            </h2>
            <p data-reveal="true" className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {service.overview.text}
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.overview.points.map((p) => (
                <li key={p} data-reveal="true" className="flex items-start gap-3 text-[15px] leading-relaxed">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                    <Check />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── what's included ── */}
      <section id="included" className="scroll-mt-24 bg-paper py-20 text-ink md:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p data-reveal="true" className="eyebrow text-muted">
                What&apos;s included
              </p>
              <h2
                data-reveal-words="true"
                className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.03em]"
              >
                Everything you get with <span className="text-brand">{inSentence(service.title)}.</span>
              </h2>
            </div>
            <p data-reveal="true" className="max-w-sm text-lg leading-relaxed text-muted">
              Take the full package or just the parts you need — we&apos;ll shape it around your goals.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((d, i) => (
              <div
                key={d.title}
                data-reveal="true"
                className="group rounded-3xl border border-line bg-white p-8 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-white"
              >
                <span className="text-sm font-medium text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl font-medium tracking-tight">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted transition-colors group-hover:text-white/60">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── showcase gallery ── */}
      {mainWork && (
        <section className="bg-ink py-20 text-white md:py-28">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p data-reveal="true" className="eyebrow text-white/40">
                  In action
                </p>
                <h2
                  data-reveal-words="true"
                  className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.03em]"
                >
                  A closer look at <span className="text-brand">the work.</span>
                </h2>
              </div>
              <p data-reveal="true" className="max-w-sm text-lg leading-relaxed text-white/60">
                A glimpse of what {inSentence(service.title)} looks like when we put it to work for a brand.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-12">
              {[mainWork, ...otherWork].map((w, i) => (
                <figure
                  key={w.title}
                  data-reveal="true"
                  className={`group relative overflow-hidden rounded-3xl ${
                    i === 0
                      ? "aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[560px]"
                      : "aspect-[16/10] lg:col-span-5"
                  }`}
                >
                  <ServiceImage
                    fill
                    zoom
                    src={w.image.src}
                    alt={w.image.alt}
                    label={w.title}
                    sizes={i === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                    <span>
                      <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-medium">{w.tag}</span>
                      <span className={`mt-3 block font-medium tracking-tight ${i === 0 ? "text-3xl" : "text-xl"}`}>{w.title}</span>
                    </span>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                      <Arrow />
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── process ── */}
      <section className="bg-paper py-20 text-ink md:py-28">
        <div className="container-x">
          <p data-reveal="true" className="eyebrow text-muted">
            How we do it
          </p>
          <h2
            data-reveal-words="true"
            className="mt-5 text-[clamp(2rem,4.4vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.03em]"
          >
            From brief to <span className="text-brand">results.</span>
          </h2>

          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-line md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-[2px] md:w-auto" />
            {service.process.map((p, i) => (
              <li key={p.title} data-reveal="true" className="relative pl-10 md:pl-0 md:pt-12">
                <span
                  className={`absolute left-0 top-0 h-4 w-4 rounded-full border-[3px] border-paper ${
                    i === service.process.length - 1 ? "bg-brand ring-4 ring-brand/20" : "bg-ink"
                  }`}
                />
                <span className="text-sm font-medium text-brand">Step {i + 1}</span>
                <h3 className="mt-2 text-2xl font-medium tracking-tight">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── who it's for + tools ── */}
      <section className="border-t border-line bg-paper py-20 text-ink md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-reveal="true" className="eyebrow text-muted">
              Who it&apos;s for
            </p>
            <h2
              data-reveal-words="true"
              className="mt-5 text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.03em]"
            >
              Built for brands <span className="text-brand">like yours.</span>
            </h2>
            <p data-reveal="true" className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Whatever your industry, we adapt {inSentence(service.title)} to your customers, your market and your budget.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-3">
              {service.industries.map((ind) => (
                <span
                  key={ind}
                  data-reveal="true"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-[15px] font-medium transition-colors hover:border-brand hover:text-brand"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* tools marquee */}
        <div className="mt-20">
          <p data-reveal="true" className="container-x eyebrow text-muted">
            Tools we use
          </p>
          <div className="sd-marquee-wrap relative mt-6 overflow-hidden border-y border-line bg-white py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="sd-marquee flex w-max gap-4">
              {[...service.tools, ...service.tools, ...service.tools, ...service.tools].map((tool, i) => (
                <span
                  key={`${tool}-${i}`}
                  aria-hidden={i >= service.tools.length ? true : undefined}
                  className="flex items-center gap-4 whitespace-nowrap text-[clamp(1.25rem,2.4vw,2rem)] font-medium tracking-tight text-ink/80"
                >
                  {tool}
                  <span className="text-brand">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── why Mindstory (image banner) ── */}
      <section className="relative isolate overflow-hidden py-24 text-white md:py-36">
        <ServiceImage
          fill
          src={whyMindstory.image.src}
          alt={whyMindstory.image.alt}
          label="Team photo"
          sizes="100vw"
          className="-z-20"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/50" />
        <div className="container-x">
          <p data-reveal="true" className="eyebrow text-white/50">
            Why Mindstory
          </p>
          <h2
            data-reveal-words="true"
            className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em]"
          >
            One team, every skill — <span className="text-brand">all in-house.</span>
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {whyMindstory.reasons.map((r) => (
              <div key={r.value} data-reveal="true" className="bg-ink/70 p-7 backdrop-blur md:p-8">
                <p className="text-2xl font-medium tracking-tight text-brand md:text-3xl">{r.value}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/65">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-ink py-20 text-white md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p data-reveal="true" className="eyebrow text-white/40">
              FAQ
            </p>
            <h2
              data-reveal-words="true"
              className="mt-5 text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.03em]"
            >
              Questions, <span className="text-brand">answered.</span>
            </h2>
            <p data-reveal="true" className="mt-5 max-w-sm text-lg leading-relaxed text-white/60">
              Still curious? Call us on{" "}
              <a href="tel:+918281001410" className="text-white underline-offset-4 hover:underline">
                +91-8281001410
              </a>
              .
            </p>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7 lg:col-start-6">
            {service.faqs.map((f, i) => (
              <details key={f.q} data-reveal="true" className="group py-6 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start gap-5 text-left">
                  <span className="mt-1 text-sm font-medium text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-lg font-medium md:text-xl">{f.q}</span>
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-transform duration-300 group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4" aria-hidden>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 pl-10 pr-12 text-[15px] leading-relaxed text-white/60">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── related ── */}
      {related.length > 0 && (
        <section className="bg-paper py-20 text-ink md:py-28">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p data-reveal="true" className="eyebrow text-muted">
                  Works well with
                </p>
                <h2
                  data-reveal-words="true"
                  className="mt-5 text-[clamp(2rem,4.4vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.03em]"
                >
                  Pair it with <span className="text-brand">these.</span>
                </h2>
              </div>
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 self-start rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-brand md:self-auto"
              >
                All services
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                  <Arrow />
                </span>
              </Link>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ServiceCard key={r.slug} service={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ServiceCta title={`Ready to start with ${inSentence(service.title)}?`} />
    </>
  );
}