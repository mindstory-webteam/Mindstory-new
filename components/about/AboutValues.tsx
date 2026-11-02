const values = [
  {
    title: "Story-led strategy",
    text: "Brand analysis comes first, so every campaign reflects your mission, vision and market position.",
  },
  {
    title: "Client-first, always",
    text: "A dedicated manager, daily communication and frequent strategy reviews keep you in the loop.",
  },
  {
    title: "Measured by KPIs",
    text: "Clear, data-driven goals on every campaign — with transparent monthly reporting, good news or not.",
  },
  {
    title: "Local insight, global outlook",
    text: "We know Kerala's digital landscape inside out, and bring that thinking to brands in the GCC and beyond.",
  },
  {
    title: "Craft in-house",
    text: "Strategy, design, film, music and code under one roof — fewer hand-offs, faster turnarounds.",
  },
  {
    title: "Exceed, don't just meet",
    text: "Expectations are the floor. We aim for work that makes your brand the one people talk about.",
  },
];

export default function AboutValues() {
  return (
    <section id="values" className="relative overflow-hidden bg-ink py-24 text-white md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-brand/10 blur-[120px]"
      />
      <div className="container-x relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p data-reveal="true" className="eyebrow text-white/40">
              What we believe
            </p>
            <h2
              data-reveal-words="true"
              className="mt-5 text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]"
            >
              The values behind <span className="text-brand">every campaign.</span>
            </h2>
          </div>
          <p
            data-reveal="true"
            className="text-lg leading-relaxed text-white/60 md:col-span-4 md:col-start-9"
          >
            Standing out takes more than ads. These are the principles we hold ourselves to —
            on every brief, for every client.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div
              key={v.title}
              data-reveal="true"
              className="group bg-ink p-8 transition-colors duration-500 hover:bg-ink-2 md:p-10"
            >
              <span className="text-sm font-medium text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-2xl font-medium tracking-tight">{v.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">{v.text}</p>
              <span className="mt-8 block h-[2px] w-10 bg-white/15 transition-all duration-500 group-hover:w-20 group-hover:bg-brand" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
