import ArrowIcon from "./ArrowIcon";

export default function AboutCta() {
  return (
    <section id="contact" className="bg-paper pb-24 md:pb-36">
      <div className="container-x">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand px-6 py-16 text-white md:px-16 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[420px] w-[420px] rounded-full border border-dashed border-white/30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-20 -z-10 h-[420px] w-[420px] rounded-full bg-brand-deep/60 blur-[90px]"
          />

          <p data-reveal="true" className="eyebrow text-white/70 [&::before]:bg-white">
            Your success story starts here
          </p>
          <h2
            data-reveal-words="true"
            className="mt-6 max-w-4xl text-[clamp(2.4rem,6vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.04em]"
          >
            Let&apos;s write your brand&apos;s next chapter.
          </h2>
          <p data-reveal="true" className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Tell us where you want to grow. We&apos;ll set up a free consultation and design a
            strategy built around your goals.
          </p>

          <div data-reveal="true" className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="https://mindstory.in/growth-marketing/"
              className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
            >
              Get a Proposal
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45 group-hover:bg-brand group-hover:text-white">
                <ArrowIcon />
              </span>
            </a>
            <a
              href="tel:+918281001410"
              className="rounded-full border border-white/40 px-6 py-[14px] text-[15px] font-medium transition-colors hover:bg-white hover:text-ink"
            >
              +91-8281001410
            </a>
            <a
              href="mailto:hello@mindstory.in"
              className="text-[15px] font-medium underline-offset-8 hover:underline"
            >
              hello@mindstory.in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
