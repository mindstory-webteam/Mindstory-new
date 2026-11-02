import Image from "next/image";
import ArrowIcon from "./ArrowIcon";

const pillars = [
  {
    label: "Mission",
    text: "Turn every brand we touch into a story people remember — and measure it in real business results.",
  },
  {
    label: "Vision",
    text: "To be the most trusted growth partner for ambitious brands in Kerala, the GCC and beyond.",
  },
];

export default function AboutStory() {
  return (
    <section id="story" className="relative overflow-hidden bg-paper py-24 text-ink md:py-36">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* art */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <div className="relative mx-auto aspect-[938/875] w-full max-w-[560px]">
              <div className="absolute inset-[10%] rounded-full bg-brand/15 blur-[70px]" />
              <div className="absolute inset-[14%] rounded-full border border-dashed border-brand/30" />
              <Image
                src="https://mindstory.in/wp-content/uploads/about-mindstory.png"
                alt="The Mindstory team at work"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-contain"
              />
              <div className="absolute left-0 top-[12%] rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_20px_40px_-20px_rgba(12,11,10,0.35)]">
                <p className="text-2xl font-semibold tracking-tight">10 yrs</p>
                <p className="text-xs text-muted">Of growing brands</p>
              </div>
              <div className="absolute bottom-[10%] right-0 rounded-2xl bg-ink px-4 py-3 text-white shadow-[0_20px_40px_-20px_rgba(12,11,10,0.5)]">
                <p className="text-2xl font-semibold tracking-tight text-brand">109</p>
                <p className="text-xs text-white/60">Google reviews · Excellent</p>
              </div>
            </div>
          </div>

          {/* copy */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <p data-reveal="true" className="eyebrow text-muted">
              Who we are
            </p>
            <h2
              data-reveal-words="true"
              className="mt-5 text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]"
            >
              Creativity and code, <span className="text-brand">under one roof.</span>
            </h2>
            <p data-reveal="true" className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              Mindstory began with digital movie promotions in Thrissur. Ten years on, we&apos;re a
              full-stack digital agency — SEO, social, performance ads, web, branding and in-house
              media production — blending storytelling with technical skill.
            </p>
            <p data-reveal="true" className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              Every engagement starts with understanding your business, then builds a strategy
              around the goals that actually matter to you.
            </p>

            <div data-reveal="true" className="mt-10 grid gap-4 sm:grid-cols-2">
              {pillars.map((p) => (
                <div key={p.label} className="rounded-3xl border border-line bg-white p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
                    {p.label}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink">{p.text}</p>
                </div>
              ))}
            </div>

            <div data-reveal="true" className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="https://mindstory.in/our-approach/"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[15px] font-medium text-white transition-colors hover:bg-brand"
              >
                Our approach
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                  <ArrowIcon />
                </span>
              </a>
              <a
                href="https://mindstory.in/case-studies/"
                className="text-[15px] font-medium text-ink underline-offset-8 hover:text-brand hover:underline"
              >
                See our work
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
