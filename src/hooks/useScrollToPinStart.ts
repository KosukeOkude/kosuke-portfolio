
import { useEffect, useRef, type DependencyList } from "react";

/**
 * GSAP ScrollTrigger の PIN 開始位置へスクロールするフック。
 *
 * - デスクトップ: Lenis で瞬時移動（duration: 0）
 * - モバイル: window.scrollTo で瞬時移動（behavior: "instant"）
 *
 * duration: 0.5 などのアニメーションにすると、ユーザーがすぐスクロールした際に
 * Lenis のアニメーションと競合してガタガタになるため、瞬時移動にしている。
 *
 * @param pinSt            - useHorizontalScrollTrigger が返す ScrollTrigger の ref
 * @param deps             - スクロールをトリガーする依存配列（例: [selectedCategory, sortOrder]）
 * @param fallbackSelector - ST 未生成時のフォールバック先（例: "#archive-main"）
 **/

export function useScrollToPinStart(
  pinSt: React.RefObject<ScrollTrigger | null>,
  deps: DependencyList,
  fallbackSelector: string,
): void {
  const isFirstRunRef = useRef(true);
  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      return;
    }

    const rafId = requestAnimationFrame(async () => {
      const { lenis } = await import("@/client/initLenis");
      const st = pinSt.current;

      const targetY = st
        ? st.start
        : (() => {
            const el = document.querySelector(fallbackSelector);
            return el ? el.getBoundingClientRect().top + window.scrollY : 0;
          })();

      if (lenis) {
        // デスクトップ: Lenis で瞬時移動（アニメーション中のスクロール競合を防ぐ）
        lenis.scrollTo(targetY, { duration: 0 });
      } else {
        // モバイル: ネイティブの瞬時スクロール
        window.scrollTo({ top: targetY, behavior: "instant" });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, deps);
}
