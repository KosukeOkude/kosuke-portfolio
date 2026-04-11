
import { useEffect, useRef, type DependencyList } from "react";

/**
 * GSAP ScrollTrigger の PIN 開始位置へ Lenis でスクロールするフック。
 *
 * `useScrollArchiveMainOnFilterChange` が `scrollIntoView` で要素へ「おおよそ」寄せるのに対し、
 * このフックは `st.start`（PIN が始まるページ上の Y 座標）という正確な数値へ Lenis でスクロールする。
 * そのため GSAP の横スクロール変換（scrub）が絡む場面では、こちらの方がスクロール位置の精度が高く
 * ユーザー体験も良い。横スクロールトリガーを使うアーカイブ（Works・Gallery）はこちらを使う。
 *
 * deps に指定した値が変化したとき（初回マウントを除く）、
 * pinSt.current.start まで滑らかにスクロールする。
 *
 * - 初回マウント時は実行しない（ページ表示直後の意図しないスクロールを防ぐ）
 * - pinSt が null の場合（アイテムが少なく ST 未生成）は fallbackSelector の要素へスクロール
 * - fallbackSelector も省略された場合は何もしない
 * - rAF 内で Lenis を動的インポートして呼び出す（SSR 安全）
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
      if (st) {
        lenis?.scrollTo(st.start, { duration: 0.5 });
      } else {
        const resolvedSt = pinSt.current;
        if (resolvedSt) {
          lenis?.scrollTo(resolvedSt.start, { duration: 0.5 });
        } else if (fallbackSelector) {
          const el = document.querySelector(fallbackSelector);
          lenis?.scrollTo(el as HTMLElement, { duration: 0.5 });
        }
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, deps);
}
