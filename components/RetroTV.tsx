"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import s from "./RetroTV.module.css";

export type TVChannel = { number: number; name: string };

type RetroTVProps = {
  /** What plays on the screen. */
  children: React.ReactNode;
  /** Channels available on the VHF dial (max 12). */
  channels: TVChannel[];
  /** Index of the active channel (controlled). */
  channel: number;
  onChannelChange: (index: number) => void;
  /** UHF knob toggles colour / black & white. */
  mono: boolean;
  onMonoChange: (mono: boolean) => void;
  className?: string;
};

// VHF dial numbers, laid out clockwise like the original set
const DIAL = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const STEP = 360 / DIAL.length;
const angleFor = (n: number) => DIAL.indexOf(n) * STEP;

// antenna geometry, measured from the reference photo (cabinet-relative)
const ANTENNAS = [
  { left: "52.2%", length: 46, angle: -144.25 },
  { left: "68.2%", length: 44.4, angle: -37.25 },
];

/** A fully code-drawn 1970s television, branded for Mindstory. */
export default function RetroTV({ children, channels, channel, onChannelChange, mono, onMonoChange, className }: RetroTVProps) {
  const root = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLDivElement>(null);
  const osdRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  const [vhfTurns, setVhfTurns] = useState(0); // full turns, so the knob never spins backwards
  const firstRun = useRef(true);
  const noiseRaf = useRef(0);

  const current = channels[channel];
  const vhfAngle = angleFor(current.number) + vhfTurns * 360;

  /* ---------- TV static (drawn into a tiny canvas, scaled up) ---------- */
  const runStatic = (ms: number) => {
    const c = staticRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(c.width, c.height);
    const end = performance.now() + ms;
    cancelAnimationFrame(noiseRaf.current);
    const draw = () => {
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      if (performance.now() < end) noiseRaf.current = requestAnimationFrame(draw);
    };
    draw();
  };
  useEffect(() => () => cancelAnimationFrame(noiseRaf.current), []);

  const flashOSD = () => {
    if (!osdRef.current) return;
    gsap.killTweensOf(osdRef.current);
    gsap.fromTo(osdRef.current, { opacity: 1 }, { opacity: 0, delay: 2.6, duration: 0.6 });
  };

  /* ---------- power on / off (CRT style) ---------- */
  const powerOn = () => {
    const tl = gsap.timeline();
    tl.set(offRef.current, { opacity: 0 })
      .set(contentRef.current, { clipPath: "inset(49.6% 0% 49.6% 0%)", filter: "brightness(4) saturate(0)" })
      .to(contentRef.current, { clipPath: "inset(49.6% 0% 49.6% 0%)", duration: 0.12 })
      .to(contentRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "expo.out" })
      .to(contentRef.current, { filter: "brightness(1) saturate(1)", duration: 0.7, ease: "power2.out" }, "-=0.25");
    runStatic(500);
    gsap.fromTo(staticRef.current, { opacity: 0.55 }, { opacity: 0, duration: 0.6, delay: 0.15 });
    flashOSD();
    setOn(true);
  };

  const powerOff = () => {
    const tl = gsap.timeline();
    tl.to(contentRef.current, { clipPath: "inset(49.6% 0% 49.6% 0%)", filter: "brightness(4) saturate(0)", duration: 0.25, ease: "power3.in" })
      .to(contentRef.current, { clipPath: "inset(49.6% 50% 49.6% 50%)", duration: 0.2, ease: "power3.in" })
      .set(offRef.current, { opacity: 1 })
      .fromTo(dotRef.current, { scale: 1, opacity: 1 }, { scale: 0, opacity: 0, duration: 0.6, ease: "power2.in" });
    gsap.to(osdRef.current, { opacity: 0, duration: 0.2 });
    setOn(false);
  };

  // switch on when the TV scrolls into view
  useGSAP(
    () => {
      gsap.set(contentRef.current, { clipPath: "inset(49.6% 50% 49.6% 50%)" });
      gsap.set(offRef.current, { opacity: 1 });
      gsap.set(osdRef.current, { opacity: 0 });
      gsap.set(dotRef.current, { scale: 0, opacity: 0 });
      gsap.from(root.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
      gsap.to({}, { scrollTrigger: { trigger: root.current, start: "top 55%", once: true, onEnter: powerOn } });
    },
    { scope: root }
  );

  /* ---------- channel changes: static burst + antenna wobble ---------- */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!on) return;
    runStatic(420);
    gsap.fromTo(staticRef.current, { opacity: 0.9 }, { opacity: 0, duration: 0.35, delay: 0.25, ease: "power1.in" });
    gsap.fromTo(contentRef.current, { filter: "brightness(1.8) saturate(0.2)", x: -6 }, { filter: "brightness(1) saturate(1)", x: 0, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(root.current!.querySelectorAll(`.${s.antenna}`), { "--wob": "3deg" }, { "--wob": "0deg", duration: 1.2, ease: "elastic.out(1.2, 0.3)" });
    flashOSD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  const nextChannel = () => {
    const next = (channel + 1) % channels.length;
    if (angleFor(channels[next].number) <= angleFor(current.number)) setVhfTurns((t) => t + 1);
    onChannelChange(next);
    if (!on) powerOn();
  };

  const toggleMono = () => {
    onMonoChange(!mono);
    flashOSD();
  };

  return (
    <div ref={root} className={`${s.wrap} ${className ?? ""}`}>
      <div className={s.cabinet}>
        {/* antennas */}
        {ANTENNAS.map((a, i) => (
          <div key={i}>
            <span className={s.hinge} style={{ left: a.left }} />
            <div
              className={s.antenna}
              style={{ left: a.left, transform: `rotate(calc(${a.angle}deg + var(--wob, 0deg)))` } as React.CSSProperties}
            >
              <span className={s.rod} style={{ width: `${a.length}cqw` }} />
              <span className={s.tip} style={{ left: `${a.length}cqw` }} />
            </div>
          </div>
        ))}

        <div className={s.bezel} />
        <div className={s.recess} />

        {/* screen */}
        <div className={s.screen}>
          <div ref={contentRef} className={s.content}>
            {children}
          </div>
          <canvas ref={staticRef} width={240} height={180} className={s.static} aria-hidden />
          <div ref={offRef} className={s.offScreen} aria-hidden>
            <span ref={dotRef} className={s.dot} />
          </div>
          <div className={s.scanlines} aria-hidden />
          <div className={s.vignette} aria-hidden />
          <div className={s.glare} aria-hidden />
          <div ref={osdRef} aria-live="polite">
            <span className={`${s.osd} ${s.osdChannel}`}>CH {String(current.number).padStart(2, "0")}</span>
            <span className={`${s.osd} ${s.osdMode}`}>{mono ? "B/W" : "COLOR"}</span>
            <span className={`${s.osd} ${s.osdName}`}>{current.name}</span>
          </div>
        </div>

        {/* control panel */}
        <div className={s.panel}>
          <div className={s.control}>
            <div className={s.dial}>
              {DIAL.map((n, i) => {
                const a = ((i * STEP - 90) * Math.PI) / 180;
                const active = n === current.number;
                const has = channels.some((c) => c.number === n);
                return (
                  <span
                    key={n}
                    className={`${s.dialNum} ${active ? s.dialNumActive : ""}`}
                    style={{ left: `${50 + Math.cos(a) * 41}%`, top: `${50 + Math.sin(a) * 41}%`, opacity: has ? 1 : 0.45 }}
                  >
                    {n}
                  </span>
                );
              })}
              <button
                type="button"
                className={s.knob}
                style={{ transform: `rotate(${vhfAngle}deg)` }}
                onClick={nextChannel}
                aria-label={`Change channel. Now showing channel ${current.number}, ${current.name}`}
              >
                <span className={s.fin} />
              </button>
            </div>
            <span className={s.label}>VHF</span>
          </div>

          <div className={s.control}>
            <div className={s.dial}>
              <span className={s.ticks} />
              <button
                type="button"
                className={s.knob}
                style={{ transform: `rotate(${mono ? 140 : 40}deg)` }}
                onClick={toggleMono}
                aria-pressed={mono}
                aria-label={mono ? "Switch to colour" : "Switch to black and white"}
              >
                <span className={s.fin} />
              </button>
            </div>
            <span className={s.label}>UHF</span>
          </div>
        </div>

        {/* speaker + brand plate with power LED */}
        <div className={s.grille}>
          <div className={s.plate}>
            <Image src="/logo.png" alt="Mindstory" width={489} height={127} />
            <button
              type="button"
              className={`${s.power} ${on ? s.powerOn : ""}`}
              onClick={() => (on ? powerOff() : powerOn())}
              aria-label={on ? "Turn TV off" : "Turn TV on"}
              aria-pressed={on}
            />
          </div>
        </div>

        <span className={s.foot} style={{ left: "8.5%" }} />
        <span className={s.foot} style={{ left: "82%" }} />
      </div>
    </div>
  );
}
