import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { ScrollTrigger } from "@/gsap/core/setup";
import gsap from "gsap";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export let lenis: Lenis | null = null;

export function initLenisWithScrollTrigger(): void {
  if (prefersReducedMotion()) return;
  lenis = new Lenis({
    autoRaf: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    if (!lenis) return;
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

initLenisWithScrollTrigger();
