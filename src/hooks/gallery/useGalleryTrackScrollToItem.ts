import { useEffect } from "react";
import { computeScrollLeftToCenterChild } from "@/utils/gallery/computeScrollLeftToCenterChild";

type UseGalleryTrackScrollToItemOptions = {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  scrollToId: string | null;
  scrollToken: number;
};

export function useGalleryTrackScrollToItem({
  scrollerRef,
  scrollToId,
  scrollToken,
}: UseGalleryTrackScrollToItemOptions) {
  useEffect(() => {
    if (!scrollToId) return;
    const frameId = requestAnimationFrame(() => {
      const scrollerElement = scrollerRef.current; // GalleryTrackのスクロール要素を狙う
      if (!scrollerElement) return;

      const targetElement = document.getElementById(scrollToId);
      if (!targetElement) return;

      const targetLeft = computeScrollLeftToCenterChild(
        scrollerElement,
        targetElement,
      );

      scrollerElement.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      });
    });
    return () => cancelAnimationFrame(frameId);
  }, [scrollToId, scrollToken, scrollerRef]);
}
