import { useCallback, useMemo, useState } from "react";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import { clampIndex } from "@/components/Lightbox/utils/clampIndex";
import { galleryDomIds } from "@/utils/gallery/galleryDomIds";
import { mapGalleryItemsToLightboxItems } from "@/components/Lightbox/utils/mapItemsToLightboxItems";

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

  // Lightboxで最後に見ていた index から、Track側のDOM idへ橋渡しする
  const closeAt = useCallback(
    (lastActiveIndex: number) => {
      const safeIndex = clampIndex(lastActiveIndex, displayItems.length);
      const item = displayItems[safeIndex];
      const targetId = item ? galleryDomIds(item.id) : null;

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
  };
}
