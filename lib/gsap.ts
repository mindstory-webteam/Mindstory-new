"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

/** Wrap every word of an element's text nodes in masked spans, for reveal animations. */
export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "1") return Array.from(el.querySelectorAll<HTMLElement>(".word"));
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? "").split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(" "));
          } else {
            const mask = document.createElement("span");
            mask.style.display = "inline-block";
            mask.style.overflow = "hidden";
            mask.style.verticalAlign = "top";
            mask.style.paddingBottom = "0.1em";
            mask.style.marginBottom = "-0.1em";
            const w = document.createElement("span");
            w.className = "word";
            w.textContent = p;
            mask.appendChild(w);
            frag.appendChild(mask);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
  el.dataset.split = "1";
  return Array.from(el.querySelectorAll<HTMLElement>(".word"));
}
