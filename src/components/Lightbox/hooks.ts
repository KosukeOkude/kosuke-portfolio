import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import lightboxImageIntro from "@/components/Lightbox/lightboxImageIntro";
import { clampIndex } from "@/components/Lightbox/clampIndex";
import { mapGalleryItemsToLightboxItems } from "@/components/Lightbox/mapItemsToLightboxItems";
import type { LightboxItem } from "@/types";

// --- スクロールロック・背景 ---

// Lightbox が開いている間 body に lightbox-open クラスを付ける
export function useBodyBackgroundHide(isOpen: boolean) {
  useEffect(() => {
    document.body.classList.toggle("lightbox-open", isOpen);
    return () => document.body.classList.remove("lightbox-open");
  }, [isOpen]);
}

// Lightbox が開いている間スクロールを止め、lenis の内部状態を維持する
export function useBodyScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    import("@/client").then(({ lenis }) => lenis?.stop());
    document.body.style.overflow = "hidden";
    return () => {
      import("@/client").then(({ lenis }) => lenis?.start());
      document.body.style.overflow = "";
    };
  }, [lock]);
}

// --- フォーカス管理 ---

// 閉じたときに指定 ID の要素へフォーカスを戻す
export function useFocusElementWhenLightboxCloses(
  isOpen: boolean,
  elementId: string | null | undefined,
) {
  const prevIsOpenRef = useRef<boolean>(false);
  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;
    if (!wasOpen || isOpen || !elementId) return;
    const el = document.getElementById(elementId);
    if (el && typeof el.focus === "function") el.focus();
  }, [isOpen, elementId]);
}

// --- キーボード・スワイプ・ホイール ---

// Escape / ArrowLeft / ArrowRight のキー操作を処理する
export function useLightboxWindowKeyboard({
  isOpen,
  onRequestClose,
  goPrev,
  goNext,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  goPrev: () => void;
  goNext: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onRequestClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, isOpen, onRequestClose]);
}

// ホイール操作で画像を切り替える（600ms スロットリング）
export function useLightboxWheelNavigation({
  isOpen,
  goPrev,
  goNext,
}: {
  isOpen: boolean;
  goPrev: () => void;
  goNext: () => void;
}) {
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
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const THROTTLE_MS = 600;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaX) < 30) return;
      const now = Date.now();
      if (now - lastWheelTime < THROTTLE_MS) return;
      lastWheelTime = now;
      if (e.deltaX > 0) goNextRef.current();
      else goPrevRef.current();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isOpen]);
}

// 横スワイプで画像を切り替える（モバイル向け）
export function useLightboxHorizontalSwipe({
  isOpen,
  itemCount,
  swipeThresholdPx = 60,
  goPrev,
  goNext,
}: {
  isOpen: boolean;
  itemCount: number;
  swipeThresholdPx?: number;
  goPrev: () => void;
  goNext: () => void;
}) {
  const goPrevRef = useRef(goPrev);
  const goNextRef = useRef(goNext);
  useEffect(() => {
    goPrevRef.current = goPrev;
  }, [goPrev]);
  useEffect(() => {
    goNextRef.current = goNext;
  }, [goNext]);

  useEffect(() => {
    if (!isOpen) return;
    const THROTTLE_MS = 600;
    let lastSwipeTime = 0;
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
      if (Math.abs(t.clientX - startX) > Math.abs(t.clientY - startY)) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (itemCount <= 0 || startX === null || startY === null) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const deltaX = t.clientX - startX;
      const deltaY = t.clientY - startY;
      startX = null;
      startY = null;
      if (Math.abs(deltaX) < Math.abs(deltaY) || Math.abs(deltaX) < swipeThresholdPx)
        return;
      const now = Date.now();
      if (now - lastSwipeTime < THROTTLE_MS) return;
      lastSwipeTime = now;
      if (deltaX > 0) goPrevRef.current();
      else goNextRef.current();
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

// キーボード・スワイプ・ホイールをまとめて管理し goPrev/goNext を返す
export function useLightboxKeyboardAndSwipe({
  isOpen,
  itemCount,
  setActiveIndex,
  onRequestClose,
  swipeThresholdPx = 40,
  items,
  activeIndex,
}: {
  isOpen: boolean;
  itemCount: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onRequestClose: () => void;
  swipeThresholdPx?: number;
  items: LightboxItem[];
  activeIndex: number;
}) {
  const goPrev = useCallback(async () => {
    if (itemCount <= 0) return;
    const newIndex = clampIndex(activeIndex - 1, itemCount);
    const src = items[newIndex].src;
    const img = new Image();
    img.src = src;
    await img.decode();
    setActiveIndex(newIndex);
  }, [itemCount, setActiveIndex, items, activeIndex]);

  const goNext = useCallback(async () => {
    if (itemCount <= 0) return;
    const newIndex = clampIndex(activeIndex + 1, itemCount);
    const src = items[newIndex].src;
    const img = new Image();
    img.src = src;
    await img.decode();
    setActiveIndex(newIndex);
  }, [itemCount, setActiveIndex, items, activeIndex]);

  useLightboxWindowKeyboard({ isOpen, onRequestClose, goPrev, goNext });
  useLightboxHorizontalSwipe({ isOpen, itemCount, swipeThresholdPx, goPrev, goNext });
  useLightboxWheelNavigation({ isOpen, goPrev, goNext });

  return { goPrev, goNext };
}

// --- イントロアニメーション ---

// 開いたとき・スライドが変わったときに入りアニメーションを再生する
export function useLightboxImageIntroAnimation(
  contentRef: React.RefObject<HTMLElement | null>,
  {
    isOpen,
    hasContent,
    contentKey,
  }: {
    isOpen: boolean;
    hasContent: boolean;
    contentKey: string | number;
  },
): void {
  const wasOpenRef = useRef(false);
  const prevContentKeyRef = useRef<string | number | undefined>(undefined);
  const cycleRef = useRef(0);

  useLayoutEffect(() => {
    if (!isOpen || !hasContent) {
      wasOpenRef.current = false;
      prevContentKeyRef.current = undefined;
      return;
    }
    const el = contentRef.current;
    if (!el) return;

    const justOpened = !wasOpenRef.current;
    const previousKey = prevContentKeyRef.current;
    const slideChanged = previousKey !== undefined && previousKey !== contentKey;
    const shouldAnimate = justOpened || slideChanged;

    wasOpenRef.current = true;
    prevContentKeyRef.current = contentKey;

    if (!shouldAnimate) return;

    cycleRef.current += 1;
    const handle = lightboxImageIntro({ el, cycle: cycleRef.current });
    return () => handle.kill();
  }, [isOpen, hasContent, contentKey, contentRef]);
}

// --- ギャラリー Lightbox ブリッジ ---

// Lightbox の開閉状態と、閉じた後に GalleryTrack の元の画像位置へ戻るスクロール情報を管理する
export default function useGalleryLightboxScrollBridge(
  displayItems: GalleryLinearSliderItem[],
) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [returnTargetId, setReturnTargetId] = useState<string | null>(null);
  const [scrollToId, setScrollToId] = useState<string | null>(null);
  const [scrollToken, setScrollToken] = useState(0);

  const lightboxItems = useMemo(
    () => mapGalleryItemsToLightboxItems(displayItems),
    [displayItems],
  );

  const openAt = useCallback((index: number) => {
    setInitialIndex(index);
    setIsOpen(true);
  }, []);

  const clearScrollTarget = useCallback(() => {
    setScrollToId(null);
  }, []);

  const closeAt = useCallback(
    (lastActiveIndex: number) => {
      const safeIndex = clampIndex(lastActiveIndex, displayItems.length);
      const item = displayItems[safeIndex];
      const targetId = item ? `gallery-open-${item.id}` : null;
      setReturnTargetId(targetId);
      setScrollToId(targetId);
      setScrollToken((n) => n + 1);
      setIsOpen(false);
    },
    [displayItems],
  );

  return {
    isOpen,
    initialIndex,
    returnTargetId,
    scrollToId,
    scrollToken,
    lightboxItems,
    openAt,
    closeAt,
    clearScrollTarget,
  };
}
