import { useEffect } from "react";
import { computeScrollLeftToCenterChild } from "@/utils/gallery/computeScrollLeftToCenterChild";

type UseGalleryTrackScrollToItemOptions = {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  scrollToId: string | null;
  scrollToken: number;
  maxScrollLeft: React.RefObject<number | null>;
  pinSt: React.RefObject<ScrollTrigger | null>;
};

/**
 * Lightbox を閉じた際に、元の画像が中央に来る位置まで GalleryTrack を横スクロールで戻すフック。
 *
 * 横スクロールは GSAP ScrollTrigger の scrub で縦スクロールに変換されているため、
 * scrollLeft を直接操作せず「縦の scrollY に換算して lenis.scrollTo」で移動する。
 *
 * 計算式:
 *   targetLeft / maxScrollLeft = ratio（0〜1）
 *   targetScrollY = st.start + ratio * (st.end - st.start)
 *
 * - `scrollToId` が変わった or `scrollToken` が更新されるたびに発火（同じ ID を連続で閉じても再実行される）。
 * - `pinSt` または `maxScrollLeft` が未確定（ST 未生成）の場合は何もしない。
 *
 * 関数名は「lenis 経由で縦座標に変換してスクロールする」実装だが、
 * 呼び出し側の意図（"指定 ID の画像を中央へ戻す"）を優先してこの名前のままにしている。
 */
export function useGalleryTrackScrollToItem({
  scrollerRef,
  scrollToId,
  scrollToken,
  maxScrollLeft,
  pinSt,
}: UseGalleryTrackScrollToItemOptions) {
  useEffect(() => {
    if (!scrollToId) return;

    let innerFrameId: number | null = null;
    const frameId = requestAnimationFrame(async () => {
      const { lenis } = await import("@/client/initLenis");

      const scrollerElement = scrollerRef.current; // GalleryTrackのスクロール要素を狙う
      if (!scrollerElement) return;

      const targetElement = document.getElementById(scrollToId);
      if (!targetElement) return;

      // 対象画像をトラック中央に表示するための scrollLeft 値を計算
      const targetLeft = computeScrollLeftToCenterChild(scrollerElement, targetElement);

      const st = pinSt.current;
      const max = maxScrollLeft.current;

      if (!st || !max || max <= 0 || !lenis) {
        return;
      }

      // targetLeft が横スクロール全体のどのくらいの割合か（0〜1）
      const ratio = Math.min(targetLeft / max, 1);
      // その割合を ST の縦スクロール範囲に当てはめて、目標の縦座標を求める
      const targetScrollY = st.start + ratio * (st.end - st.start);

      innerFrameId = requestAnimationFrame(() => {
        lenis.scrollTo(targetScrollY);
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      if (innerFrameId !== null) cancelAnimationFrame(innerFrameId);
    };
  }, [scrollToId, scrollToken, scrollerRef, maxScrollLeft, pinSt]);
}
