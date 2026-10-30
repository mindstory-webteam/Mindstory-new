import Image from "next/image";
import { blogs } from "@/lib/data";
import { ArrowUpRight } from "./Icons";

export default function Blogs() {
  return (
    <section id="blog" className="bg-paper pb-24 md:pb-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 border-t border-line pt-24 md:flex-row md:items-end md:pt-36">
          <div>
            <p data-reveal className="eyebrow text-muted">Featured blogs</p>
            <h2 data-reveal-words className="mt-5 max-w-2xl text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              Insights from the <span className="text-brand">digital</span> frontline.
            </h2>
          </div>
          <a data-reveal href="https://mindstory.in/blog/" className="group inline-flex items-center gap-2 self-start rounded-full border border-ink px-6 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-white md:self-auto">
            All articles <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </a>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {blogs.map((b) => (
            <a key={b.href} href={b.href} className="group block">
              <div data-reveal-img className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-line">
                <Image
                  src={b.img}
                  alt={b.title}
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                />
              </div>
              <div data-reveal className="mt-6">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand">{b.tag}</span>
                <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight md:text-2xl">
                  <span className="bg-gradient-to-r from-ink to-ink bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                    {b.title}
                  </span>
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-ink">
                  Continue reading <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
