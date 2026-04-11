import { useEffect, useRef } from "react";

type LightboxWheelNavigationOptions = {
  isOpen: boolean;
  goPrev: () => void;
  goNext: () => void;
};

/**
 * Lightbox 表示中にホイール操作で画像を1枚ずつ切り替えるフック。
 *
 * - 下スクロール → goNext（次の画像）、上スクロール → goPrev（前の画像）
 * - THROTTLE_MS（600ms）以内の連続ホイールは無視し、1操作で1枚だけ進む
 * - deltaY < 30 の小さいイベント（トラックパッドの慣性余韻）は弾く
 * - goPrev/goNext は毎レンダーで新しい関数になるため useRef で最新を保持し、
 *   wheel リスナーの再登録が起きないようにしている（isOpen だけを依存配列に持つ）
 * - passive: false を指定して e.preventDefault() を有効にし、
 *   モーダル背後のページスクロールを防ぐ
 */
export function useLightboxWheelNavigation({
  isOpen,
  goPrev,
  goNext,
}: LightboxWheelNavigationOptions) {
  const goPrevRef = useRef(goPrev);
  const goNextRef = useRef(goNext);

  useEffect(() => {
    goPrevRef.current = goPrev;
  }, [goPrev]);
  useEffect(() => {
    goNextRef.current = goNext;
  }, [goNext]);

  let lastWheelTime = 0;

  useEffect(() => {
    if (!isOpen) return;
    const THROTTLE_MS = 600; //連射防止gsapのアニメーションに合わせて、400msに一回だけ反応

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // deltaY の絶対値が小さすぎる（慣性スクロールの余韻など）は無視
      if (Math.abs(e.deltaY) < 30) return;
      const now = Date.now();
      if (now - lastWheelTime < THROTTLE_MS) return;
      lastWheelTime = now;
      if (e.deltaY > 0) {
        goNextRef.current(); // 下スクロール → 次の画像
      } else {
        goPrevRef.current(); // 上スクロール → 前の画像
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [isOpen]);
}
