const places = [
  { city: "Thrissur", tag: "Where it all began", text: "Our home since 2016 and the heart of the team." },
  { city: "Kochi", tag: "Kerala's business hub", text: "Close to the brands driving Kerala's growth." },
  { city: "GCC", tag: "Since 2018", text: "Serving brands across the Gulf with the same story-led approach." },
];

export default function AboutLocations() {
  return (
    <section id="locations" className="border-t border-line bg-paper py-24 text-ink md:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <h3 className="text-2xl font-medium tracking-tight md:text-3xl">Where you&apos;ll find us</h3>
          <p className="text-sm text-muted">Mon–Fri · 10AM to 6PM</p>
        </div>

        <div className="mt-10 grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {places.map((p) => (
            <div key={p.city} data-reveal="true" className="group py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{p.tag}</p>
              <p className="mt-4 text-[clamp(2.4rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em] transition-colors duration-500 group-hover:text-brand">
                {p.city}
              </p>
              <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
