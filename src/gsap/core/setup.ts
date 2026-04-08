import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/all";
import { Draggable } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(MotionPathPlugin);

gsap.registerPlugin(Draggable);


/** OS / ブラウザの「動きを減らす」設定が有効か。 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, MotionPathPlugin, Draggable };
