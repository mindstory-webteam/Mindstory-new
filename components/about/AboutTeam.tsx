import ArrowIcon from "./ArrowIcon";

const crews = [
  { name: "Strategy", text: "Brand analysis, research and the roadmap every campaign is built on." },
  { name: "Creative", text: "Designers and writers shaping logos, identities, social and campaigns." },
  { name: "Performance", text: "Google, Meta and programmatic ads, run against hard numbers." },
  { name: "SEO & Content", text: "Technical SEO, content and analytics that compound over time." },
  { name: "Web & Tech", text: "Fast, conversion-focused websites and e-commerce builds." },
  { name: "Media Production", text: "Shoots, edits, brand films and music — produced in-house." },
];

export default function AboutTeam() {
  return (
    <section id="team" className="bg-paper py-24 text-ink md:py-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p data-reveal="true" className="eyebrow text-muted">
              The people
            </p>
            <h2
              data-reveal-words="true"
              className="mt-5 text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]"
            >
              30+ Mindstorians, <span className="text-brand">six crews.</span>
            </h2>
          </div>
          <p data-reveal="true" className="max-w-sm text-lg leading-relaxed text-muted">
            Specialists who work as one team — so your brand gets joined-up thinking, not
            disconnected deliverables.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crews.map((c, i) => (
            <div
              key={c.name}
              data-reveal="true"
              className="group relative overflow-hidden rounded-3xl border border-line bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_30px_60px_-30px_rgba(12,11,10,0.3)]"
            >
              <span
                aria-hidden="true"
                className="absolute -right-6 -top-8 text-[7rem] font-semibold leading-none tracking-tighter text-paper transition-colors duration-500 group-hover:text-brand-soft"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-sm font-medium text-white transition-colors duration-500 group-hover:bg-brand">
                  {c.name.charAt(0)}
                </span>
                <h3 className="mt-8 text-2xl font-medium tracking-tight">{c.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* careers banner */}
        <div
          data-reveal="true"
          className="mt-6 flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-soft p-8 md:flex-row md:items-center md:p-10"
        >
          <div>
            <p className="text-2xl font-medium tracking-tight">Want to write the next chapter with us?</p>
            <p className="mt-2 text-[15px] text-muted">
              We&apos;re always looking for curious, creative people.
            </p>
          </div>
          <a
            href="https://mindstory.in/career/"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-brand"
          >
            View careers
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
              <ArrowIcon />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
