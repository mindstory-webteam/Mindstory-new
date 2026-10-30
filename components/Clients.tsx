import { clients } from "@/lib/data";

export default function Clients() {
  const row = [...clients, ...clients];
  return (
    <section aria-label="Trusted by leading brands" className="border-b border-line bg-paper py-10 md:py-14">
      <div className="container-x mb-8 flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <p className="eyebrow text-muted">Trusted by leading brands</p>
        <p className="max-w-md text-sm text-muted">
          Custom solutions for brands across education, finance, retail, hospitality and more.
        </p>
      </div>
      <div className="pause-on-hover relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="animate-marquee-slow flex w-max items-center">
          {row.map((c, i) => (
            <span key={i} className="flex items-center whitespace-nowrap text-3xl font-medium tracking-tight text-ink/80 transition-colors hover:text-brand md:text-5xl">
              {c}
              <span className="mx-8 inline-block h-2.5 w-2.5 rotate-45 bg-brand md:mx-12" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
