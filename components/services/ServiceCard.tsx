import Link from "next/link";
import type { Service } from "@/lib/services";
import ServiceIcon, { Arrow } from "./ServiceIcon";

/**
 * Card linking to /services/<slug> — used on the listing page and as "related" on detail pages.
 * `wide` stretches it across two columns (used when a category has an odd number of services).
 */
export default function ServiceCard({ service, index, wide = false }: { service: Service; index?: number; wide?: boolean }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      data-reveal="true"
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-ink hover:bg-ink hover:text-white hover:shadow-[0_30px_60px_-30px_rgba(12,11,10,0.45)] md:p-8 ${
        wide ? "sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-x-10" : ""
      }`}
    >
      {/* glow on hover */}
      <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/0 blur-3xl transition-colors duration-500 group-hover:bg-brand/30" />

      <div className="relative flex flex-col">
        <div className="flex items-start justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-deep transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
            <ServiceIcon name={service.icon} className="h-6 w-6" />
          </span>
          {index !== undefined && !wide && <span className="text-sm font-medium text-brand">{String(index + 1).padStart(2, "0")}</span>}
        </div>
        <h3 className="mt-8 text-2xl font-medium tracking-tight">{service.title}</h3>
        <p className="mt-1 text-[15px] text-muted transition-colors group-hover:text-white/60">{service.short}</p>
        {wide && <p className="mt-4 hidden max-w-sm text-[15px] leading-relaxed text-muted transition-colors group-hover:text-white/60 sm:block">{service.intro}</p>}
      </div>

      <div className={`relative flex flex-1 flex-col ${wide ? "sm:border-l sm:border-line sm:pl-10 sm:transition-colors sm:group-hover:border-white/10" : ""}`}>
        {wide && index !== undefined && <span className="hidden self-end text-sm font-medium text-brand sm:block">{String(index + 1).padStart(2, "0")}</span>}
        <ul
          className={`mt-6 space-y-2 border-t border-line pt-6 transition-colors group-hover:border-white/10 ${
            wide ? "sm:mt-4 sm:border-t-0 sm:pt-0" : ""
          }`}
        >
          {service.deliverables.slice(0, wide ? 4 : 3).map((d) => (
            <li key={d.title} className="flex items-center gap-2.5 text-[15px] text-ink/80 transition-colors group-hover:text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {d.title}
            </li>
          ))}
        </ul>

        <span className="mt-auto inline-flex items-center gap-3 pt-8 text-[15px] font-medium">
          Explore
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand">
            <Arrow />
          </span>
        </span>
      </div>
    </Link>
  );
}
