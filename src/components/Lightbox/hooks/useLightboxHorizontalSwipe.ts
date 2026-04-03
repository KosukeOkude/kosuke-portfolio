import { useCallback, useRef, type TouchEvent } from 'react';

export type useLightboxHorizontalSwipeOptions = {
  itemCount: number;
  swipeThresholdPx?: number;
  goPrev: () => void;
  goNext: () => void;
};


//横スワイプで goPrev / goNext を呼ぶ。戻り値はタッチ用ハンドラのみ。

export function useLightboxHorizontalSwipe({ goPrev, goNext, itemCount, swipeThresholdPx = 40 }: useLightboxHorizontalSwipeOptions) {
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartXRef.current = t.clientX;
    touchStartYRef.current = t.clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (itemCount <= 0) return;

      const startX = touchStartXRef.current;
      const startY = touchStartYRef.current;
      if (startX === null || startY === null) return;

      const t = e.changedTouches[0];
      if (!t) return;

      const deltaX = t.clientX - startX;
      const deltaY = t.clientY - startY;

      const isMostlyHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
      const isEnoughSwipe = Math.abs(deltaX) >= swipeThresholdPx;

      touchStartXRef.current = null;
      touchStartYRef.current = null;

      if (!isMostlyHorizontal || !isEnoughSwipe) return;

      if (deltaX > 0) {
        goPrev();
      } else if (deltaX < 0) {
        goNext();
      }
    },
    [goNext, goPrev, itemCount, swipeThresholdPx],
  );

  return {
    onTouchStart,
    onTouchEnd,
  };
}
