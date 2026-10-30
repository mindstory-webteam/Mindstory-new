import { reviews } from "@/lib/data";
import { Google, Star } from "./Icons";

function Card({ name, text }: { name: string; text: string }) {
  return (
    <figure className="mr-5 flex w-[320px] shrink-0 flex-col justify-between rounded-3xl border border-line bg-white p-7 md:w-[400px]">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5 text-brand">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4" />
            ))}
          </div>
          <Google className="h-5 w-5" />
        </div>
        <blockquote className="mt-5 text-[17px] leading-relaxed text-ink/85">“{text}”</blockquote>
      </div>
      <figcaption className="mt-8 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-sm font-medium text-brand-deep">
          {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </span>
        <span>
          <span className="block text-sm font-medium">{name}</span>
          <span className="block text-xs text-muted">Posted on Google</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const a = reviews.slice(0, 4);
  const b = reviews.slice(4);
  return (
    <section id="reviews" className="overflow-hidden border-t border-line bg-paper py-24 md:py-36">
      <div className="container-x mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p data-reveal className="eyebrow text-muted">Client love</p>
          <h2 data-reveal-words className="mt-5 max-w-3xl text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
            Experiences of our <span className="text-brand">delighted</span> customers.
          </h2>
        </div>
        <div data-reveal className="flex items-center gap-4 rounded-2xl border border-line bg-white px-6 py-4">
          <Google className="h-8 w-8" />
          <div>
            <p className="text-lg font-medium">Excellent</p>
            <p className="text-sm text-muted">Based on 109 reviews</p>
          </div>
        </div>
      </div>

      <div className="pause-on-hover space-y-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="animate-marquee flex w-max">
          {[...a, ...a, ...a, ...a].map((r, i) => <Card key={i} {...r} />)}
        </div>
        <div className="animate-marquee flex w-max [animation-direction:reverse]">
          {[...b, ...b, ...b, ...b].map((r, i) => <Card key={i} {...r} />)}
        </div>
      </div>
    </section>
  );
}
