import Link from "next/link";
import { ArrowUpRight } from "@/components/learn/LearnUI";
import { typeLabel } from "@/data/works";

/* Image box shared by cards, the case-study cover and "next project" */
export function WorkMedia({ work, num, eager = false, children }) {
  return (
    <div className="ls-work-media">
      {/* plain <img> so remote thumbnails work without next.config changes */}
      <img src={work.image} alt={`${work.client} case study`} loading={eager ? "eager" : "lazy"} decoding="async" />
      {num != null && <span className="ls-work-num">{String(num).padStart(2, "0")}</span>}
      {children}
    </div>
  );
}

export default function WorkCard({ work, num, wide = false }) {
  return (
    <Link href={`/works/${work.slug}`} className={`ls-work ${wide ? "ls-work--wide" : ""}`}>
      <WorkMedia work={work} num={num} eager={wide}>
        <span className="ls-work-cat">{work.category}</span>
        <span className="ls-work-go" aria-hidden="true"><ArrowUpRight size={20} /></span>
      </WorkMedia>
      <div className="ls-work-body">
        <div>
          <h3>{work.client}</h3>
          <p>{work.tagline}</p>
        </div>
        <div className="ls-work-tags">
          {work.types.slice(0, 3).map((t) => <span key={t}>{typeLabel(t)}</span>)}
        </div>
      </div>
    </Link>
  );
}
