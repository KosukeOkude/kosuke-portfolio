import { useCallback } from "react";
import { clampIndex } from "@/components/Lightbox/utils/clampIndex";
import { useLightboxWindowKeyboard } from "@/components/Lightbox/hooks/useLightboxWindowKeyboard";
import { useLightboxHorizontalSwipe } from "@/components/Lightbox/hooks/useLightboxHorizontalSwipe";
type UseLightboxKeyboardAndSwipeOptions = {
  isOpen: boolean;
  itemCount: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onRequestClose: () => void;
  swipeThresholdPx?: number;
};

export function useLightboxKeyboardAndSwipe({
  isOpen,
  itemCount,
  setActiveIndex,
  onRequestClose,
  swipeThresholdPx = 40,
}: UseLightboxKeyboardAndSwipeOptions) {
  const goPrev = useCallback(() => {
    if (itemCount <= 0) return;
    setActiveIndex((prev) => clampIndex(prev - 1, itemCount));
  }, [itemCount, setActiveIndex]);

  const goNext = useCallback(() => {
    if (itemCount <= 0) return;
    setActiveIndex((next) => clampIndex(next + 1, itemCount));
  }, [itemCount, setActiveIndex]);

  //* 開いているときだけ window に keydown を付ける（副作用のみ）。
  useLightboxWindowKeyboard({ isOpen, onRequestClose, goPrev, goNext });

  //横スワイプで goPrev / goNext を呼ぶ。戻り値はタッチ用ハンドラのみ。
  const { onTouchStart, onTouchEnd } = useLightboxHorizontalSwipe({
    itemCount,
    swipeThresholdPx,
    goPrev,
    goNext,
  });

  return {
    goPrev,
    goNext,
    onTouchStart,
    onTouchEnd,
  };
}
