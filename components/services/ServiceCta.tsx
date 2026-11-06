import { Arrow } from "./ServiceIcon";

/** Free-audit call to action — same offer as the services mega menu. */
export default function ServiceCta({
  title = "Get a free review of your digital presence",
  text = "Tell us where you want to grow. We'll audit your brand, website and channels and show you what to fix first — free.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-paper pb-24 md:pb-36">
      <div className="container-x">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-white md:rounded-[2.75rem] md:px-16 md:py-24">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[460px] w-[460px] rounded-full bg-brand/35 blur-[120px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-[420px] w-[420px] rounded-full border border-dashed border-white/10" />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <span data-reveal="true" className="inline-flex rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]">
                Free audit
              </span>
              <h2 data-reveal-words="true" className="mt-6 text-[clamp(2.2rem,5.4vw,4.8rem)] font-medium leading-[1] tracking-[-0.04em]">
                {title}
              </h2>
              <p data-reveal="true" className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                {text}
              </p>
            </div>
            <div data-reveal="true" className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
              <a
                href="https://mindstory.in/growth-marketing/"
                className="group inline-flex items-center gap-3 rounded-full bg-brand py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
              >
                Get a Proposal
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                  <Arrow />
                </span>
              </a>
              <a href="tel:+918281001410" className="text-[15px] font-medium text-white/70 underline-offset-8 hover:text-white hover:underline">
                or call +91-8281001410
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
