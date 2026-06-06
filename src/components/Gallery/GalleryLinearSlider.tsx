import { useState, useMemo, useRef, useCallback } from "react";
import { GalleryTrack } from "@/components/Gallery/GalleryTrack";

import ImageLightboxModal from "@/components/Lightbox/ImageLightboxModal";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import useGalleryLightboxScrollBridge from "@/components/Lightbox/hooks";
import { ArchiveCategoryChips } from "@/components/UI/ArchiveCategoryChips";
import { ArchiveDateSortSelect } from "@/components/UI/ArchiveDateSortSelect";
import type { DateSortOrder } from "@/types";
import { filterByCategory } from "@/utils";
import { useRevealDispatch } from "@/gsap/core";
import { useRevealRefreshOnChange, useHorizontalScrollTrigger } from "@/hooks";
import { useScrollToPinStart } from "@/hooks";

type GalleryLinearSliderProps = {
  items: GalleryLinearSliderItem[];
  categories: CategoryOption[];
  initialCategory?: string;
};

export type CategoryOption = {
  slug: string;
  label: string;
};

export const GalleryLinearSlider = ({
  items,
  categories,
  initialCategory,
}: GalleryLinearSliderProps) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? categories[0]?.slug ?? "");
  const [sortOrder, setSortOrder] = useState<DateSortOrder>("date-asc");

  const filteredItems = filterByCategory(
    items,
    selectedCategory,
    (g) => g.categorySlug,
  );

  const displayItems = useMemo(
    () => sortOrder === "date-desc" ? [...filteredItems].reverse() : filteredItems,
    [filteredItems, sortOrder],
  );

  const listKey = `${selectedCategory}-${sortOrder}`;

  const lightboxBridge = useGalleryLightboxScrollBridge(displayItems);

  useRevealDispatch();
  useRevealRefreshOnChange([listKey]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const { maxScrollLeft, pinSt } = useHorizontalScrollTrigger(
    scrollerRef,
    listKey,
    "[data-gallery-section]",
    "[data-gallery-slug-root]",
  );

  useScrollToPinStart(pinSt, [selectedCategory, sortOrder], "#archive-main");

  const handleCategorySelect = useCallback(
    (cat: string) => {
      lightboxBridge.clearScrollTarget();
      setSelectedCategory(cat);
    },
    [lightboxBridge],
  );

  const handleSortChange = useCallback(
    (order: DateSortOrder) => {
      lightboxBridge.clearScrollTarget();
      setSortOrder(order);
    },
    [lightboxBridge],
  );

  return (
    <section className="w-full" data-gallery-section>
      <ArchiveCategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
      />
      <ArchiveDateSortSelect
        value={sortOrder}
        onChange={handleSortChange}
      />
      <div
        key={listKey}
        data-reveal-once
      >
        <GalleryTrack
          items={displayItems}
          resetKey={listKey}
          onOpenImage={lightboxBridge.openAt}
          scrollToId={lightboxBridge.scrollToId}
          scrollToken={lightboxBridge.scrollToken}
          scrollerRef={scrollerRef}
          maxScrollLeft={maxScrollLeft}
          pinSt={pinSt}
        />
      </div>

      <ImageLightboxModal
        items={lightboxBridge.lightboxItems}
        initialIndex={lightboxBridge.initialIndex}
        isOpen={lightboxBridge.isOpen}
        onClose={lightboxBridge.closeAt}
        returnTargetId={lightboxBridge.returnTargetId}
      />
      
    </section>
  );
};
