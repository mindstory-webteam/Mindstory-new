"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { MASCOT } from "@/lib/mascot";
import { CursorMascot, type CursorMascotHandle } from "./CursorMascot";
import RotatingText, { type RotatingTextRef } from "./RotatingText";
import StarField from "./StarField";
import GradientASCII from "./GradientASCII";
import RocketLayer, { type RocketLayerHandle } from "./RocketLayer";

const slides = [
  { first: "Top digital agency", second: "in Kerala" },
  { first: "Stories that", second: "sell brands" },
  { first: "Turn clicks into", second: "customers" },
];

// How long each slide stays on screen (milliseconds)
const SLIDE_DURATION = 5000;

// ASCII glow palette: darkest → brightest (brand orange in the middle)
const ASCII_COLORS = ["#1a0902", "#6b2706", "#d8691a", "#f6811f", "#ffd4a3"];

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

const SKY_LINES = ["Launched!", "To the moon!", "Another brand in orbit.", "Houston, we have leads.", "Ignition!"];

export default function Hero() {
  const host = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const mascot = useRef<CursorMascotHandle>(null);
  const rockets = useRef<RocketLayerHandle>(null);
  const lineA = useRef<RotatingTextRef>(null);
  const lineB = useRef<RotatingTextRef>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [vision, setVision] = useState(false);
  const [reaction, setReaction] = useState("");
  const [launches, setLaunches] = useState(0);
  const [counting, setCounting] = useState(false);
  const reactionCount = useRef(0);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdown = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches || document.documentElement.dataset.reducedMotion === "true");
    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      countdown.current.forEach(clearTimeout);
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
        .fromTo(".ms-float", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 1.1)
        .fromTo(".ms-planet", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, 0.6);
    }, host);
    return () => ctx.revert();
  }, [reduced]);

  // mouse parallax: planet + halo drift against the cursor (CSS vars, no re-renders)
  useEffect(() => {
    const el = host.current;
    if (!el || reduced) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        el.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      });
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  function say(text: string, ms = 2500) {
    setReaction(text);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setReaction(""), ms);
  }

  function play(action: "wave" | "jump" | "peek" | "reset") {
    mascot.current?.play(action);
    if (action === "reset") {
      setVision(false);
      say("Ready for take-off.");
    } else {
      say(action === "jump" ? "One small step for your brand!" : action === "wave" ? "Hello from Mindstory!" : "Looking for your next customer…");
    }
  }
  const react = () => play((["wave", "jump", "peek"] as const)[reactionCount.current++ % 3]);

  // rocket point just beside the astronaut, in hero coordinates
  function padPoint() {
    const h = host.current?.getBoundingClientRect();
    const s = stage.current?.getBoundingClientRect();
    if (!h || !s) return { x: 0, y: 0 };
    return { x: s.left - h.left + s.width * 0.82, y: s.top - h.top + s.height * 0.55 };
  }

  // countdown → lift-off from beside the astronaut
  function launch() {
    if (counting) return;
    if (reduced) {
      say("Lift-off! (motion is reduced)");
      return;
    }
    setCounting(true);
    countdown.current.forEach(clearTimeout);
    const steps = ["3…", "2…", "1…"];
    steps.forEach((s, i) => countdown.current.push(setTimeout(() => say(s, 1200), i * 650)));
    countdown.current.push(
      setTimeout(() => {
        mascot.current?.play("jump");
        rockets.current?.liftOff(padPoint(), 52);
        setLaunches((n) => n + 1);
        say("Lift-off! Your brand is in orbit.");
        setCounting(false);
      }, steps.length * 650),
    );
  }

  // click empty space → a rocket flies through that point
  function onSkyClick(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("button, a, h1, [role='tablist']")) return;
    if (reduced || !host.current) return;
    const r = host.current.getBoundingClientRect();
    rockets.current?.launchTo({ x: e.clientX - r.left, y: e.clientY - r.top });
    const next = launches + 1;
    setLaunches(next);
    if (next % 3 === 0) say(SKY_LINES[(next / 3) % SKY_LINES.length]);
  }

  const slide = slides[active];

  return (
    <section
      ref={host}
      id="top"
      className={`ms-hero${vision ? " ms-vision" : ""}`}
      aria-label="Mindstory introduction"
      onClick={onSkyClick}
    >
      {/* deep space: ASCII glow rising from the horizon + starfield */}
      <div className="ms-bg" aria-hidden>
        <div className="ms-ascii">
          <GradientASCII
            shape={vision ? "eclipse" : "rise"}
            colors={ASCII_COLORS}
            characters=" .·:+*x#@"
            cellSize={14}
            density={0.85}
            glyphOpacity={0.9}
            glow={0.35}
            flicker={0.25}
            softness={0.6}
            flow={0.6}
            speed={0.8}
            gradientOpacity={0.55}
            grain={0.06}
            scrambleRadius={0.08}
            clickEffect="wave"
          />
        </div>
        <StarField className="absolute inset-0" count={240} speed={0.018} glintRate={0.6} />
      </div>

      {/* a little planet with an orbiting satellite (parallax) */}
      <div className="ms-planet" aria-hidden>
        <span className="ms-planet-body" />
        <span className="ms-planet-ring" />
        <span className="ms-orbit">
          <span className="ms-sat" />
        </span>
      </div>

      {/* rockets, exhaust, shooting stars */}
      <RocketLayer ref={rockets} reduced={reduced} className="ms-rockets" />

      {/* edge details */}
      <div className="ms-dots ms-float" role="tablist" aria-label="Slides">
        {slides.map((s, i) => (
          <button key={s.second} role="tab" aria-selected={i === active} aria-label={`Slide ${i + 1}: ${s.first} ${s.second}`} onClick={() => setActive(i)} className={i === active ? "is-on" : ""} />
        ))}
      </div>

      <p className="ms-hint ms-float">
        <span className="ms-hint-dot" /> Click anywhere in space to launch a rocket
        {launches > 0 && <span className="ms-count"> · {launches} launched</span>}
      </p>

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
      <div ref={stage} className="ms-stage">
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
        <button className="ms-launch" onClick={launch} disabled={counting}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M12 2c3 2.5 4.5 6 4.5 10.5V16h-9v-3.5C7.5 8 9 4.5 12 2z" />
            <path d="M7.5 13 5 16v2h2.5M16.5 13 19 16v2h-2.5M10 19.5c.5 1.5 1.2 2.5 2 2.5s1.5-1 2-2.5" />
          </svg>
          {counting ? "Counting…" : "Launch"}
        </button>
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
          --px:0;--py:0;
          /* astronaut size: share of the banner height it may use (raise for bigger) */
          --mascot-height:74;
          position:relative;overflow:hidden;isolation:isolate;color:#fff;background:var(--ms-space);
          min-height:max(760px,100svh);cursor:crosshair;
        }
        .ms-hero button,.ms-hero a{cursor:pointer}

        /* deep space */
        .ms-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;background:
          radial-gradient(40% 40% at 18% 20%,rgba(90,75,170,.06) 0%,rgba(90,75,170,0) 70%),
          radial-gradient(70% 70% at 50% 45%,#07070b 0%,#040407 60%,#010102 100%)}
        .ms-ascii{position:absolute;inset:0;transition:opacity .6s}
        .ms-bg::after{content:'';position:absolute;inset:0;background:radial-gradient(110% 85% at 50% 45%,transparent 50%,rgba(0,0,0,.75) 100%)}

        .ms-rockets{z-index:0}

        /* planet */
        .ms-planet{position:absolute;z-index:0;left:9%;top:30%;width:clamp(60px,7vw,110px);aspect-ratio:1;pointer-events:none;
          translate:calc(var(--px) * -18px) calc(var(--py) * -14px);transition:translate .6s cubic-bezier(.2,.7,.2,1)}
        .ms-planet-body{position:absolute;inset:0;border-radius:50%;
          background:radial-gradient(circle at 35% 30%,#ffc48a 0%,#f6811f 35%,#7a2f08 75%,#2a0f03 100%);
          box-shadow:0 0 50px rgba(246,129,31,.25),inset -10px -12px 24px rgba(0,0,0,.55);animation:ms-bob 7s ease-in-out infinite}
        .ms-planet-ring{position:absolute;left:-30%;right:-30%;top:42%;height:18%;border-radius:50%;border:2px solid rgba(255,200,150,.45);rotate:-18deg;animation:ms-bob 7s ease-in-out infinite}
        .ms-orbit{position:absolute;inset:-55%;border-radius:50%;border:1px dashed rgba(255,255,255,.08);animation:ms-spin 14s linear infinite}
        .ms-sat{position:absolute;top:-4px;left:50%;width:8px;height:8px;border-radius:2px;background:#e9e6f0;box-shadow:-7px 0 0 -2px #f6811f,7px 0 0 -2px #f6811f,0 0 10px rgba(255,255,255,.6)}
        @keyframes ms-bob{50%{transform:translateY(-8px)}}

        /* hint */
        .ms-hint{position:absolute;z-index:4;left:clamp(20px,5vw,80px);bottom:36px;margin:0;display:flex;align-items:center;gap:8px;font-size:.75rem;color:rgba(255,255,255,.45);letter-spacing:.02em;pointer-events:none}
        .ms-hint-dot{width:6px;height:6px;border-radius:50%;background:var(--ms-brand);box-shadow:0 0 0 0 rgba(246,129,31,.6);animation:ms-ping 2s infinite}
        .ms-count{color:var(--ms-brand)}
        @keyframes ms-ping{70%{box-shadow:0 0 0 8px rgba(246,129,31,0)}100%{box-shadow:0 0 0 0 rgba(246,129,31,0)}}

        /* headline */
        .ms-head{position:relative;z-index:1;padding:clamp(110px,15vh,150px) 20px 0;text-align:center;cursor:default}
        .ms-title{margin:14px 0 0;line-height:.95}
        .ms-line-a{font-size:clamp(1.9rem,4.2vw,3.9rem);font-weight:300;font-style:italic;letter-spacing:-.03em;color:#d8701c}
        .ms-line-b{margin-top:.04em;font-size:clamp(3.2rem,10.4vw,10rem);font-weight:600;text-transform:uppercase;letter-spacing:-.045em;color:#cfccd6;text-shadow:0 0 40px rgba(2,2,4,.8)}

        /* centre stage */
        .ms-stage{position:absolute;left:50%;bottom:0;translate:-50% 0;z-index:2;height:calc(var(--mascot-height) * 1%);aspect-ratio:${MASCOT.width} / ${MASCOT.height};container-type:size;pointer-events:none}
        .ms-halo{position:absolute;z-index:0;left:50%;top:56%;width:min(48vw,68svh);aspect-ratio:1;border-radius:50%;pointer-events:none;
          translate:calc(-50% + var(--px) * 10px) calc(-50% + var(--py) * 8px);transition:translate .6s cubic-bezier(.2,.7,.2,1);
          background:radial-gradient(circle at 50% 46%,rgba(255,200,150,.08) 0%,rgba(246,129,31,.035) 38%,rgba(246,129,31,0) 68%)}
        .ms-ring{position:absolute;inset:-2%;border-radius:50%;border:1px solid rgba(246,129,31,.14)}
        .ms-ring::after{content:'';position:absolute;inset:-1px;border-radius:50%;opacity:0;transition:opacity .4s;
          background:conic-gradient(from 0deg,rgba(246,129,31,.7),transparent 18%);
          -webkit-mask:radial-gradient(closest-side,transparent calc(100% - 2px),#000 calc(100% - 1px));mask:radial-gradient(closest-side,transparent calc(100% - 2px),#000 calc(100% - 1px));
          animation:ms-spin 3s linear infinite}
        .ms-vision .ms-ring::after{opacity:1}
        @keyframes ms-spin{to{rotate:360deg}}
        .ms-rise{position:absolute;left:0;right:0;bottom:-14%;pointer-events:auto}
        .ms-mascot-btn{display:block;width:100%;padding:0;border:0;background:none;cursor:pointer}
        .ms-hero::after{content:'';position:absolute;left:0;right:0;bottom:0;height:12%;z-index:3;pointer-events:none;background:linear-gradient(to top,var(--ms-space) 8%,rgba(5,5,10,0))}
        .ms-mascot-btn:focus-visible{outline:2px solid var(--ms-brand);outline-offset:-6px;border-radius:24px}

        .ms-bubble{position:absolute;top:2%;left:78%;z-index:4;width:max-content;max-width:220px;padding:10px 16px;border-radius:16px 16px 16px 4px;background:#fff;color:var(--ms-ink);font-weight:500;font-size:.9rem;
          opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s;pointer-events:none}
        .ms-bubble.show{opacity:1;transform:none}

        /* edges */
        .ms-dots{position:absolute;z-index:3;right:clamp(14px,1.8vw,32px);top:50%;translate:0 -50%;display:flex;flex-direction:column;gap:8px}
        .ms-dots button{width:7px;height:7px;padding:0;border-radius:99px;border:1.5px solid rgba(255,255,255,.7);background:transparent;transition:height .35s,background .35s,border-color .35s}
        .ms-dots button.is-on{height:24px;background:var(--ms-brand);border-color:var(--ms-brand)}

        /* bottom row */
        .ms-playbar{position:absolute;left:50%;bottom:24px;translate:-50% 0;z-index:5;display:flex;gap:2px;padding:4px;border-radius:999px;white-space:nowrap;
          background:var(--ms-glass);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(16px) saturate(1.4);box-shadow:0 18px 40px -20px rgba(0,0,0,.8)}
        .ms-playbar button{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:0;border-radius:999px;background:none;font:inherit;font-size:.8rem;font-weight:500;color:rgba(255,255,255,.7);transition:background .2s,color .2s}
        .ms-playbar button:hover{color:#fff;background:rgba(255,255,255,.12)}
        .ms-playbar button[aria-pressed="true"]{background:#fff;color:var(--ms-ink)}
        .ms-playbar button:focus-visible{outline:2px solid var(--ms-brand);outline-offset:2px}
        .ms-playbar .ms-launch{background:var(--ms-brand);color:#fff}
        .ms-playbar .ms-launch:hover{background:#ff9640}
        .ms-playbar .ms-launch:disabled{opacity:.7;cursor:progress}
        .ms-playbar .ms-icon{padding:8px 11px;font-size:.95rem}

        .ms-socials{position:absolute;z-index:4;right:clamp(20px,5vw,80px);bottom:30px;display:flex;gap:8px}
        .ms-socials a{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;color:#fff;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);transition:background .2s,color .2s,border-color .2s}
        .ms-socials a:hover{background:var(--ms-brand);border-color:var(--ms-brand);color:#fff}

        @media (max-width:1280px){ .ms-hint{display:none} }

        /* tablet & mobile */
        @media (max-width:1024px){
          .ms-hero{display:flex;flex-direction:column;min-height:0;cursor:default}
          .ms-head{padding-top:110px;order:1}
          .ms-stage{order:2}
          .ms-stage{position:relative;left:auto;translate:none;margin:24px auto 0;height:min(64svh,560px)}
          .ms-halo{top:auto;bottom:4%;translate:-50% 0;width:min(92vw,520px)}
          .ms-rise{bottom:-10%}
          .ms-dots,.ms-socials{display:none}
          .ms-planet{left:6%;top:16%;width:54px}
          .ms-bubble{left:auto;right:70%;border-radius:16px 16px 4px 16px}
        }
        @media (max-width:640px){
          .ms-stage{height:min(56svh,440px)}
          .ms-planet{display:none}
          .ms-playbar{bottom:14px;max-width:calc(100% - 24px);overflow-x:auto;scrollbar-width:none}
          .ms-playbar button{padding:7px 10px}
        }
      `}</style>
    </section>
  );
}