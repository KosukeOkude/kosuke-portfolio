import { useEffect, useRef } from "react";

type UseLightboxHorizontalSwipeOptions = {
  isOpen: boolean;
  itemCount: number;
  swipeThresholdPx?: number;
  goPrev: () => void;
  goNext: () => void;
};

/**
 * Lightbox 表示中に横スワイプで画像を切り替えるフック（モバイル向け）。
 *
 * ## なぜ window.addEventListener を使うか
 * 以前は React の合成イベント（onTouchStart/onTouchEnd props）を
 * pointer-events-none の div に渡していたが、
 * CSS の pointer-events:none はヒットテストを無効にするためタッチが届かなかった。
 * window に直接登録することでこの問題を回避している。
 *
 * ## なぜ touchmove で preventDefault するか
 * 横スワイプ中にブラウザが「ページの横スクロール」と判定してイベントを横取りする。
 * touchmove の時点で横方向が支配的と分かったら e.preventDefault() を呼ぶことで防ぐ。
 * passive:false の指定が必要。
 */
export function useLightboxHorizontalSwipe({
  isOpen,
  itemCount,
  swipeThresholdPx = 40,
  goPrev,
  goNext,
}: UseLightboxHorizontalSwipeOptions) {
  const goPrevRef = useRef(goPrev);
  const goNextRef = useRef(goNext);

  useEffect(() => { goPrevRef.current = goPrev; }, [goPrev]);
  useEffect(() => { goNextRef.current = goNext; }, [goNext]);

  useEffect(() => {
    if (!isOpen) return;

    let startX: number | null = null;
    let startY: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startX === null || startY === null) return;
      const t = e.touches[0];
      if (!t) return;
      // 横方向が支配的な場合のみブラウザスクロールを止める
      if (Math.abs(t.clientX - startX) > Math.abs(t.clientY - startY)) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (itemCount <= 0 || startX === null || startY === null) return;
      const t = e.changedTouches[0];
      if (!t) return;

      const deltaX = t.clientX - startX;
      const deltaY = t.clientY - startY;
      startX = null;
      startY = null;

      // 縦スワイプ、または閾値未満は無視
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (Math.abs(deltaX) < swipeThresholdPx) return;

      if (deltaX > 0) {
        goPrevRef.current(); // 右スワイプ → 前の画像
      } else {
        goNextRef.current(); // 左スワイプ → 次の画像
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen, itemCount, swipeThresholdPx]);
}
