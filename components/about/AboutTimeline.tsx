const milestones = [
  { year: "2016", title: "The beginning", text: "Mindstory starts in Thrissur and runs its first digital movie promotions." },
  { year: "2017", title: "Media production", text: "An in-house team for shoots, edits and brand films." },
  { year: "2018", title: "Going further", text: "Music production, a dedicated e-commerce division and expansion into the GCC." },
  { year: "2019", title: "₹1 Crore in ads", text: "Managed over ₹10 million of Google Ads spend for clients." },
  { year: "2020", title: "Remote-first", text: "Moved to a work-from-home model without missing a beat." },
  { year: "2021", title: "Public NCD issue", text: "Complete digital marketing for Indel Money's public NCD issue." },
  { year: "2023", title: "Three more issues", text: "Ran campaigns for three public NCD issuances." },
  { year: "Today", title: "10 years strong", text: "400+ clients, 1,500+ campaigns and still counting." },
];

export default function AboutTimeline() {
  return (
    <section id="journey" className="border-t border-line bg-paper py-24 text-ink md:py-36">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* sticky heading */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p data-reveal="true" className="eyebrow text-muted">
                Our journey
              </p>
              <h2
                data-reveal-words="true"
                className="mt-5 text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]"
              >
                Our story <span className="text-brand">so far.</span>
              </h2>
              <p data-reveal="true" className="mt-6 max-w-sm text-lg leading-relaxed text-muted">
                Fuelled by unlimited cups of coffee ☕ — and a lot of very patient clients.
              </p>
            </div>
          </div>

          {/* vertical timeline */}
          <ol className="relative lg:col-span-7 lg:col-start-6">
            <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-line" />
            {milestones.map((m, i) => {
              const last = i === milestones.length - 1;
              return (
                <li key={m.year} data-reveal="true" className="relative pb-12 pl-12 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-[3px] border-paper ${
                      last ? "bg-brand ring-4 ring-brand/20" : "bg-ink"
                    }`}
                  />
                  <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:gap-8">
                    <p
                      className={`text-2xl font-semibold tracking-tight ${
                        last ? "text-brand" : ""
                      }`}
                    >
                      {m.year}
                    </p>
                    <div className="rounded-3xl border border-line bg-white p-6 transition-colors hover:border-brand/40">
                      <p className="text-lg font-medium">{m.title}</p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{m.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
