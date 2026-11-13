"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { MASCOT } from "@/lib/mascot";
import { CursorMascot, type CursorMascotHandle } from "./CursorMascot";
import RotatingText, { type RotatingTextRef } from "./RotatingText";
import StarField from "./StarField";

const slides = [
  { first: "Top digital agency", second: "in Kerala" },
  { first: "Stories that", second: "sell brands" },
  { first: "Turn clicks into", second: "customers" },
];

// How long each slide stays on screen (milliseconds)
const SLIDE_DURATION = 5000;

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/mindstorian",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/68608253/", icon: <span className="text-[12px] font-bold">in</span> },
  { label: "Facebook", href: "https://facebook.com/mindstorian", icon: <span className="text-[14px] font-bold">f</span> },
  {
    label: "X / Twitter",
    href: "https://twitter.com/mindstorian",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5">
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    ),
  },
  { label: "Behance", href: "https://www.behance.net/mindstorycreative", icon: <span className="text-[11px] font-bold">Bē</span> },
];

export default function Hero() {
  const host = useRef<HTMLElement>(null);
  const mascot = useRef<CursorMascotHandle>(null);
  const lineA = useRef<RotatingTextRef>(null);
  const lineB = useRef<RotatingTextRef>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [vision, setVision] = useState(false);
  const [reaction, setReaction] = useState("");
  const reactionCount = useRef(0);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches || document.documentElement.dataset.reducedMotion === "true");
    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    };
  }, []);

  // one timer drives the headline
  useEffect(() => {
    if (paused || reduced) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % slides.length), SLIDE_DURATION);
    return () => clearTimeout(id);
  }, [active, paused, reduced]);
  useEffect(() => {
    lineA.current?.jumpTo(active);
    lineB.current?.jumpTo(active);
  }, [active]);

  // entrance: halo blooms, astronaut rises from the bottom edge, everything else fades up
  useEffect(() => {
    if (reduced || !host.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(".ms-halo", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 }, 0)
        .fromTo(".ms-rise", { yPercent: 100 }, { yPercent: 0, duration: 1.6 }, 0.1)
        .fromTo(".ms-reveal", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.09 }, 0.25)
        .fromTo(".ms-float", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 1.1);
    }, host);
    return () => ctx.revert();
  }, [reduced]);

  function play(action: "wave" | "jump" | "peek" | "reset") {
    mascot.current?.play(action);
    if (action === "reset") {
      setVision(false);
      setReaction("Ready for take-off.");
    } else {
      setReaction(action === "jump" ? "One small step for your brand!" : action === "wave" ? "Hello from Mindstory!" : "Looking for your next customer…");
    }
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setReaction(""), 2500);
  }
  const react = () => play((["wave", "jump", "peek"] as const)[reactionCount.current++ % 3]);

  const slide = slides[active];

  return (
    <section ref={host} id="top" className={`ms-hero${vision ? " ms-vision" : ""}`} aria-label="Mindstory introduction">
      {/* deep space: starfield + soft orange nebula behind the astronaut */}
      <div className="ms-bg" aria-hidden>
        <StarField className="absolute inset-0" count={380} speed={0.018} glintRate={0.6} />
      </div>

      {/* edge details */}
      <div className="ms-dots ms-float" role="tablist" aria-label="Slides">
        {slides.map((s, i) => (
          <button key={s.second} role="tab" aria-selected={i === active} aria-label={`Slide ${i + 1}: ${s.first} ${s.second}`} onClick={() => setActive(i)} className={i === active ? "is-on" : ""} />
        ))}
      </div>

      {/* TOP: big centred headline */}
      <div className="ms-head" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <p className="eyebrow ms-reveal justify-center text-white/40">#01 Digital Marketing Agency in Kerala</p>
        <h1 className="ms-title ms-reveal" aria-label={`${slide.first} ${slide.second}`}>
          <RotatingText ref={lineA} texts={slides.map((s) => s.first)} className="ms-line-a" reduced={reduced} />
          <RotatingText ref={lineB} texts={slides.map((s) => s.second)} className="ms-line-b" reduced={reduced} />
        </h1>
      </div>

      {/* CENTRE: astronaut rising from the bottom edge */}
      <div className="ms-halo" aria-hidden>
        <span className="ms-ring" />
      </div>
      <div className="ms-stage">
        <div className="ms-rise">
          <button type="button" className="ms-mascot-btn" onClick={react} aria-label="Play with the Mindstory astronaut">
            <CursorMascot ref={mascot} />
          </button>
        </div>
        <span className={`ms-bubble${reaction ? " show" : ""}`} role="status">
          {reaction}
        </span>
      </div>

      {/* BOTTOM row: play bar · socials */}
      <div className="ms-playbar ms-float" aria-label="Play with the astronaut">
        <button onClick={() => play("wave")}>Say hello</button>
        <button onClick={() => play("jump")}>Jump</button>
        <button onClick={() => play("peek")}>Look around</button>
        <button aria-pressed={vision} onClick={() => setVision((v) => !v)}>
          Orbit view
        </button>
        <button className="ms-icon" onClick={() => play("reset")} aria-label="Reset the astronaut">
          ↺
        </button>
      </div>

      <div className="ms-socials ms-float">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            {s.icon}
          </a>
        ))}
      </div>

      <style>{`
        .ms-hero{
          --ms-ink:#0c0b0a;--ms-space:#020204;--ms-brand:#f6811f;--ms-glass:rgba(255,255,255,.07);
          /* astronaut size: share of the banner height it may use (raise for bigger) */
          --mascot-height:74;
          position:relative;overflow:hidden;isolation:isolate;color:#fff;background:var(--ms-space);
          min-height:max(760px,100svh);
        }

        /* deep space: dark centre-lit sky, an orange nebula low behind the astronaut, vignette edges */
        .ms-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;background:
          radial-gradient(32% 40% at 50% 84%,rgba(246,129,31,.10) 0%,rgba(246,129,31,.03) 50%,rgba(246,129,31,0) 75%),
          radial-gradient(40% 40% at 18% 20%,rgba(90,75,170,.05) 0%,rgba(90,75,170,0) 70%),
          radial-gradient(70% 70% at 50% 45%,#07070b 0%,#040407 60%,#010102 100%)}
        .ms-bg::after{content:'';position:absolute;inset:0;background:radial-gradient(110% 85% at 50% 45%,transparent 45%,rgba(0,0,0,.8) 100%)}

        /* headline: centred across the top */
        .ms-head{position:relative;z-index:1;padding:clamp(110px,15vh,150px) 20px 0;text-align:center}
        .ms-title{margin:14px 0 0;line-height:.95}
        .ms-line-a{font-size:clamp(1.9rem,4.2vw,3.9rem);font-weight:300;font-style:italic;letter-spacing:-.03em;color:#d8701c}
        .ms-line-b{margin-top:.04em;font-size:clamp(3.2rem,10.4vw,10rem);font-weight:600;text-transform:uppercase;letter-spacing:-.045em;color:#cfccd6}

        /* centre stage: astronaut anchored to the bottom edge */
        .ms-stage{position:absolute;left:50%;bottom:0;translate:-50% 0;z-index:2;height:calc(var(--mascot-height) * 1%);aspect-ratio:${MASCOT.width} / ${MASCOT.height};container-type:size;pointer-events:none}
        .ms-halo{position:absolute;z-index:0;left:50%;top:56%;width:min(48vw,68svh);aspect-ratio:1;border-radius:50%;translate:-50% -50%;pointer-events:none;
          background:radial-gradient(circle at 50% 46%,rgba(255,200,150,.08) 0%,rgba(246,129,31,.035) 38%,rgba(246,129,31,0) 68%)}
        .ms-ring{position:absolute;inset:-2%;border-radius:50%;border:1px solid rgba(246,129,31,.14)}
        .ms-ring::after{content:'';position:absolute;inset:-1px;border-radius:50%;opacity:0;transition:opacity .4s;
          background:conic-gradient(from 0deg,rgba(246,129,31,.7),transparent 18%);
          -webkit-mask:radial-gradient(closest-side,transparent calc(100% - 2px),#000 calc(100% - 1px));mask:radial-gradient(closest-side,transparent calc(100% - 2px),#000 calc(100% - 1px));
          animation:ms-spin 3s linear infinite}
        .ms-vision .ms-ring::after{opacity:1}
        @keyframes ms-spin{to{rotate:360deg}}
        /* feet sink below the edge, like the subject in the reference */
        .ms-rise{position:absolute;left:0;right:0;bottom:-14%;pointer-events:auto}
        .ms-mascot-btn{display:block;width:100%;padding:0;border:0;background:none;cursor:pointer}
        .ms-hero::after{content:'';position:absolute;left:0;right:0;bottom:0;height:12%;z-index:3;pointer-events:none;background:linear-gradient(to top,var(--ms-space) 8%,rgba(5,5,10,0))}
        .ms-mascot-btn:focus-visible{outline:2px solid var(--ms-brand);outline-offset:-6px;border-radius:24px}

        .ms-bubble{position:absolute;top:2%;left:78%;z-index:4;width:max-content;max-width:220px;padding:10px 16px;border-radius:16px 16px 16px 4px;background:#fff;color:var(--ms-ink);font-weight:500;font-size:.9rem;
          opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s;pointer-events:none}
        .ms-bubble.show{opacity:1;transform:none}

        /* edges */
        .ms-dots{position:absolute;z-index:3;right:clamp(14px,1.8vw,32px);top:50%;translate:0 -50%;display:flex;flex-direction:column;gap:8px}
        .ms-dots button{width:7px;height:7px;padding:0;border-radius:99px;border:1.5px solid rgba(255,255,255,.7);background:transparent;cursor:pointer;transition:height .35s,background .35s,border-color .35s}
        .ms-dots button.is-on{height:24px;background:var(--ms-brand);border-color:var(--ms-brand)}

        /* bottom row */
        .ms-playbar{position:absolute;left:50%;bottom:24px;translate:-50% 0;z-index:5;display:flex;gap:2px;padding:4px;border-radius:999px;white-space:nowrap;
          background:var(--ms-glass);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(16px) saturate(1.4);box-shadow:0 18px 40px -20px rgba(0,0,0,.8)}
        .ms-playbar button{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:0;border-radius:999px;background:none;font:inherit;font-size:.8rem;font-weight:500;color:rgba(255,255,255,.7);cursor:pointer;transition:background .2s,color .2s}
        .ms-playbar button:hover{color:#fff;background:rgba(255,255,255,.12)}
        .ms-playbar button[aria-pressed="true"]{background:#fff;color:var(--ms-ink)}
        .ms-playbar button:focus-visible{outline:2px solid var(--ms-brand);outline-offset:2px}
        .ms-playbar .ms-icon{padding:8px 11px;font-size:.95rem}

        .ms-socials{position:absolute;z-index:4;right:clamp(20px,5vw,80px);bottom:30px;display:flex;gap:8px}
        .ms-socials a{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;color:#fff;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);transition:background .2s,color .2s,border-color .2s}
        .ms-socials a:hover{background:var(--ms-brand);border-color:var(--ms-brand);color:#fff}

        /* tablet & mobile: headline, then the astronaut rising underneath */
        @media (max-width:1024px){
          .ms-hero{display:flex;flex-direction:column;min-height:0}
          .ms-head{padding-top:110px;order:1}
          .ms-stage{order:2}
          .ms-stage{position:relative;left:auto;translate:none;margin:24px auto 0;height:min(64svh,560px)}
          .ms-halo{top:auto;bottom:4%;translate:-50% 0;width:min(92vw,520px)}
          .ms-rise{bottom:-10%}
          .ms-dots,.ms-socials{display:none}
          .ms-bubble{left:auto;right:70%;border-radius:16px 16px 4px 16px}
        }
        @media (max-width:640px){
          .ms-stage{height:min(56svh,440px)}
          .ms-playbar{bottom:14px;max-width:calc(100% - 24px);overflow-x:auto;scrollbar-width:none}
          .ms-playbar button{padding:7px 10px}
        }
      `}</style>
    </section>
  );
}