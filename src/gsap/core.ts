import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin, Draggable } from "gsap/all";
import type { RunGlobalRevealOptions } from "@/types";

// --- セットアップ ---

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(Draggable);

// モバイルのアドレスバー出入りによる高さ変化でピン位置がズレる問題を防ぐ
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, MotionPathPlugin, Draggable };

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// --- DOM ユーティリティ ---

// DOM 準備完了後にコールバックを実行する
export function whenDomReady(callback: () => void): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
}

// 要素が astro-island の内側にあるか判定する
export function skipInsideAstroIslands(el: Element): boolean {
  return el.closest("astro-island") !== null;
}

// --- ScrollTrigger リフレッシュ ---

let resizeRefreshRegistered = false;

// リサイズ・向き変更時に ScrollTrigger をリフレッシュする（幅変化のみ対応）
export function registerScrollTriggerRefreshOnResize(): void {
  if (resizeRefreshRegistered) return;
  resizeRefreshRegistered = true;

  let timeoutId: ReturnType<typeof setTimeout>;
  let lastWidth = window.innerWidth;

  const debouncedRefresh = (): void => {
    const currentWidth = window.innerWidth;
    if (currentWidth === lastWidth) return;
    lastWidth = currentWidth;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  };

  window.addEventListener("resize", debouncedRefresh, { passive: true });
  window.addEventListener("orientationchange", () => {
    ScrollTrigger.refresh();
  });
}

let loadRefreshRegistered = false;

// ページロード完了後に ScrollTrigger をリフレッシュする（rAF 2重で確実に）
export function registerScrollTriggerRefreshOnLoad(): void {
  if (typeof window === "undefined" || loadRefreshRegistered) return;
  loadRefreshRegistered = true;

  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  });
}

// --- Reveal イベント ---

export const REVEAL_REFRESH_EVENT = "reveal:refresh";

// 初回マウント時に reveal:refresh を1回発火する（Astro 島の hydration 後に再スキャンさせる）
export function useRevealDispatch(): void {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(REVEAL_REFRESH_EVENT));
  }, []);
}

// --- Reveal アニメーション ---

const started = new WeakSet<Element>();

// [data-reveal] などのセレクタに ScrollTrigger 付きフェードインを付与する
export function runGlobalRevealAnimation(options?: RunGlobalRevealOptions): void {
  import("@/gsap/preset").then(({ applyRevealBySelector }) => {
    const selectors = [
      "[data-reveal]",
      "[data-reveal-each]",
      "[data-reveal-once]",
      "[data-reveal-enter]",
      "[data-reveal-bottom]",
    ] as const;
    for (const selector of selectors) {
      applyRevealBySelector({ selector, options, started });
    }
  });
}

// --- パスユーティリティ ---

export function isHomePath(): boolean {
  const p = window.location.pathname;
  return p === "/" || p === "";
}
