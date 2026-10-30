"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js hero visual: a breathing particle "mind" sphere in brand orange,
 * with orbiting rings. Reacts to the pointer and to scroll.
 */
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const group = new THREE.Group();
    scene.add(group);

    // ---------- particle sphere (fibonacci distribution) ----------
    const COUNT = window.innerWidth < 768 ? 4200 : 9000;
    const positions = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      positions.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
      randoms[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    const uniforms = {
      uTime: { value: 0 },
      uRadius: { value: 1.75 },
      uPixel: { value: renderer.getPixelRatio() },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#f6811f") },
      uColorB: { value: new THREE.Color("#ffd1a1") },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uRadius; uniform float uPixel; uniform vec2 uMouse;
        attribute float aRandom;
        varying float vMix; varying float vAlpha;
        // cheap 3D noise
        vec3 hash3(vec3 p){ p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6))); return -1.0 + 2.0*fract(sin(p)*43758.5453123); }
        float noise(vec3 p){
          vec3 i = floor(p); vec3 f = fract(p); vec3 u = f*f*(3.0-2.0*f);
          return mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)),dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                         mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
                     mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                         mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
        }
        void main(){
          vec3 p = position;
          float n = noise(p * 1.6 + vec3(uTime * 0.25, uTime*0.18, 0.0));
          float m = length(uMouse) * 0.35;
          float disp = 1.0 + n * (0.32 + m) + sin(uTime * 1.2 + aRandom * 6.28) * 0.015;
          vec3 pos = p * uRadius * disp;
          vMix = smoothstep(-0.35, 0.45, n);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.4 + aRandom * 2.2) * uPixel * (6.0 / -mv.z);
          vAlpha = 0.35 + 0.65 * smoothstep(-2.5, 1.5, mv.z + 6.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA; uniform vec3 uColorB;
        varying float vMix; varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a * vAlpha);
        }
      `,
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);

    // ---------- orbit rings ----------
    const rings: THREE.Line[] = [];
    const ringMat = new THREE.LineBasicMaterial({ color: 0xf6811f, transparent: true, opacity: 0.22 });
    [2.45, 2.85, 3.3].forEach((r, i) => {
      const curve = new THREE.EllipseCurve(0, 0, r, r * (0.92 - i * 0.04), 0, Math.PI * 2);
      const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(220));
      const line = new THREE.Line(g, ringMat.clone());
      (line.material as THREE.LineBasicMaterial).opacity = 0.24 - i * 0.06;
      line.rotation.x = Math.PI / 2.3 + i * 0.25;
      line.rotation.y = i * 0.5;
      group.add(line);
      rings.push(line);
    });

    // satellite dots on rings
    const satGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffb877 });
    const sats = rings.map((ring) => {
      const s = new THREE.Mesh(satGeo, satMat);
      ring.add(s);
      return s;
    });

    // ---------- sizing ----------
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // keep sphere framed on narrow screens
      camera.position.z = w < 768 ? 8.2 : 6.2;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---------- interaction ----------
    const target = new THREE.Vector2(0, 0);
    const onMove = (e: PointerEvent) => {
      target.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = clock.getElapsedTime();
      uniforms.uTime.value = reduced ? 0 : t;
      uniforms.uMouse.value.lerp(target, 0.05);

      const scrollP = Math.min(window.scrollY / window.innerHeight, 1);
      group.rotation.y = t * 0.08 + uniforms.uMouse.value.x * 0.35;
      group.rotation.x = -uniforms.uMouse.value.y * 0.25 + scrollP * 0.6;
      group.position.y = scrollP * 0.8;
      group.scale.setScalar(1 + scrollP * 0.25);

      rings.forEach((ring, i) => {
        ring.rotation.z = t * (0.12 + i * 0.05) * (i % 2 ? -1 : 1);
        const r = 2.45 + i * 0.425;
        const a = t * (0.6 - i * 0.12) + i * 2;
        sats[i].position.set(Math.cos(a) * r, Math.sin(a) * r * (0.92 - i * 0.04), 0);
      });

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" aria-hidden />;
}
