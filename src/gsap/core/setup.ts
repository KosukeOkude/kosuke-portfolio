import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/all";
import { Draggable } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(Draggable);

// モバイルのアドレスバー/タブバーの出入りによる高さ変化で
// ScrollTrigger が再計算されてピン位置がズレる問題を防ぐ
ScrollTrigger.config({ ignoreMobileResize: true });



/** OS / ブラウザの「動きを減らす」設定が有効か。 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, MotionPathPlugin, Draggable };
