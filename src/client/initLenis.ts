import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { ScrollTrigger } from "@/gsap/core/setup";
import gsap from "gsap";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * タッチデバイス（モバイル）かどうかを判定する。
 * モバイルの iOS Safari は position: fixed をビジュアルビューポート基準で描画するため、
 * アドレスバー/タブバーの出入りで GSAP のピン位置がズレる。
 * モバイルでは Lenis を使わず ScrollTrigger.normalizeScroll() でこの問題を回避する。
 */
function isTouchDevice(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

export let lenis: Lenis | null = null;

export function initLenisWithScrollTrigger(): void {
  if (prefersReducedMotion()) return;

  if (isTouchDevice()) {
    // モバイル: Lenis を使わずネイティブスクロール + normalizeScroll でピンズレを防ぐ
    ScrollTrigger.normalizeScroll(true);
    return;
  }

  // デスクトップ: Lenis でスムーズスクロール
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
