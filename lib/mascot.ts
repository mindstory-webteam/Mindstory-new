// Cursor-following mascot for a single still image (the cat version needs a 90-frame
// sequence; this one gets its life from motion instead): it leans toward the cursor,
// turns around to face whichever side the cursor is on, breathes, and plays small clips.
import { gsap } from "@/lib/gsap";

export type MascotAction = "wave" | "jump" | "peek" | "reset" | "next";
export type MascotEngine = { play: (action: MascotAction) => void; destroy: () => void };

export const MASCOT = {
  src: "/astronaut.png",
  width: 726,
  height: 1233,
  /** which way the artwork looks: the astronaut points up and to the left */
  facing: "left" as "left" | "right",
  /** cursor must be this far past the middle (−1…1) before it turns around */
  turnAt: 0.22,
  /** how far it leans toward the cursor */
  lean: { x: 16, y: 10, rotate: 4, tilt: 10 },
  /** go back to the resting pose after this long without movement */
  idleAfterMs: 7000,
  /** where the "eyes" are, as a share of the image height (for aiming) */
  eyes: 0.17,
};

/**
 * leanEl  → moves/tilts toward the cursor
 * flipEl  → mirrors the image when it turns around
 */
export function createMascotEngine(leanEl: HTMLElement, flipEl: HTMLElement): MascotEngine {
  const cfg = MASCOT;
  const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reduceQuery.matches || document.documentElement.dataset.reducedMotion === "true";

  let target = { x: 0, y: 0 };
  let lastMove = -1e9;
  let inside = false;
  let facing: "left" | "right" = cfg.facing;
  let busyUntil = 0;
  let clicks = 0;
  let clip: gsap.core.Timeline | null = null;
  let turnTl: gsap.core.Timeline | null = null;

  gsap.set(leanEl, { transformPerspective: 900, transformOrigin: "50% 100%" });
  gsap.set(flipEl, { transformOrigin: "50% 100%" });

  const toX = gsap.quickTo(leanEl, "x", { duration: 0.8, ease: "power3.out" });
  const toY = gsap.quickTo(leanEl, "y", { duration: 0.8, ease: "power3.out" });
  const toR = gsap.quickTo(leanEl, "rotation", { duration: 0.9, ease: "power3.out" });
  const toRY = gsap.quickTo(leanEl, "rotationY", { duration: 0.9, ease: "power3.out" });

  /** turn around: squash to a sliver, swap sides, spring back (reads like a real turn) */
  function face(side: "left" | "right", fast = false) {
    if (side === facing) return;
    facing = side;
    const sx = side === cfg.facing ? 1 : -1;
    turnTl?.kill();
    if (reduced()) {
      gsap.set(flipEl, { scaleX: sx });
      return;
    }
    turnTl = gsap
      .timeline()
      .to(flipEl, { scaleX: 0.06 * sx * -1, scaleY: 0.97, duration: fast ? 0.12 : 0.18, ease: "power2.in" })
      .to(flipEl, { scaleX: sx, scaleY: 1, duration: fast ? 0.32 : 0.45, ease: "back.out(2)" });
  }

  function aim() {
    if (performance.now() < busyUntil) return;
    const idle = !inside || performance.now() - lastMove > cfg.idleAfterMs;
    const t = idle || reduced() ? { x: 0, y: 0 } : target;
    toX(t.x * cfg.lean.x);
    toY(t.y * cfg.lean.y);
    toR(t.x * cfg.lean.rotate);
    toRY(t.x * cfg.lean.tilt);
    if (idle) face(cfg.facing);
    else if (t.x > cfg.turnAt) face("right");
    else if (t.x < -cfg.turnAt) face("left");
  }

  function onMove(e: PointerEvent) {
    const r = leanEl.getBoundingClientRect();
    if (!r.width) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * cfg.eyes;
    const sx = Math.max(window.innerWidth * 0.32, 220);
    const sy = Math.max(window.innerHeight * 0.32, 200);
    target = {
      x: Math.max(-1, Math.min(1, (e.clientX - cx) / sx)),
      y: Math.max(-1, Math.min(1, (e.clientY - cy) / sy)),
    };
    lastMove = performance.now();
    inside = true;
    aim();
  }
  const onLeave = () => {
    inside = false;
    aim();
  };
  const idleTimer = window.setInterval(aim, 1000);

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);

  function play(action: MascotAction) {
    if (action === "next") action = clicks++ % 2 === 0 ? "wave" : "jump";
    clip?.kill();
    if (action === "reset") {
      lastMove = -1e9;
      busyUntil = 0;
      face(cfg.facing);
      aim();
      return;
    }
    if (reduced()) return;
    const tl = gsap.timeline({ onComplete: () => { busyUntil = 0; aim(); } });
    clip = tl;
    if (action === "wave") {
      // a friendly side-to-side rock from the feet
      busyUntil = performance.now() + 1600;
      tl.to(leanEl, { rotation: -7, x: -6, duration: 0.22, ease: "sine.out" })
        .to(leanEl, { rotation: 6, x: 6, duration: 0.3, ease: "sine.inOut" })
        .to(leanEl, { rotation: -5, x: -4, duration: 0.28, ease: "sine.inOut" })
        .to(leanEl, { rotation: 3, x: 2, duration: 0.26, ease: "sine.inOut" })
        .to(leanEl, { rotation: 0, x: 0, duration: 0.3, ease: "sine.inOut" });
    } else if (action === "jump") {
      // crouch, launch, a little spin in the air, land with a squash
      busyUntil = performance.now() + 1500;
      tl.to(flipEl, { scaleY: 0.9, duration: 0.14, ease: "power2.out" })
        .to(leanEl, { y: -70, duration: 0.36, ease: "power2.out" }, ">")
        .to(flipEl, { scaleY: 1.05, duration: 0.2, ease: "power2.out" }, "<")
        .to(leanEl, { rotationY: "+=360", duration: 0.55, ease: "power2.inOut" }, "<")
        .to(leanEl, { y: 0, duration: 0.34, ease: "power2.in" })
        .to(flipEl, { scaleY: 0.9, duration: 0.08, ease: "power1.out" })
        .to(flipEl, { scaleY: 1, duration: 0.5, ease: "elastic.out(1.1, 0.4)" })
        .set(leanEl, { rotationY: 0 });
    } else if (action === "peek") {
      // look around: right, left, right, then settle
      busyUntil = performance.now() + 2400;
      const look = (side: "left" | "right", x: number) =>
        tl.add(() => face(side, true)).to(leanEl, { x, rotation: x / 6, duration: 0.45, ease: "sine.inOut" }).to({}, { duration: 0.25 });
      look("right", 14);
      look("left", -14);
      look("right", 10);
      tl.to(leanEl, { x: 0, rotation: 0, duration: 0.4, ease: "sine.inOut" });
    }
  }

  return {
    play,
    destroy() {
      clip?.kill();
      turnTl?.kill();
      window.clearInterval(idleTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    },
  };
}
