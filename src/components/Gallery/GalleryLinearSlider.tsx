import { useState, useMemo, useRef, useCallback } from "react";
import { GalleryTrack } from "@/components/Gallery/GalleryTrack";
import { sortByDate, buildArchiveListKey } from "@/utils";

import ImageLightboxModal from "@/components/Lightbox/ImageLightboxModal";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import useGalleryLightboxScrollBridge from "@/components/Lightbox/hooks";
import { ArchiveCategoryChips } from "@/components/UI/ArchiveCategoryChips";
import { ArchiveDateSortSelect } from "@/components/UI/ArchiveDateSortSelect";
import type { DateSortOrder } from "@/types";
import { toTimeMsOrZero, filterByCategory } from "@/utils";
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
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? "All");
  const [sortOrder, setSortOrder] = useState<DateSortOrder>("date-desc");
  // カテゴリで絞る（Allなら全件）
  const filteredByCategoryItems = filterByCategory(
    items,
    selectedCategory,
    (g) => g.categorySlug,
  );

  const displayItems = useMemo(
    () =>
      sortByDate(filteredByCategoryItems, sortOrder, (n) => toTimeMsOrZero(n.createdAt)),
    [filteredByCategoryItems, sortOrder],
  );

  // Lightbox の開閉状態と、閉じた際に元の画像位置へトラックを戻すスクロール情報を管理
  const lightboxBridge = useGalleryLightboxScrollBridge(displayItems);

  // 初回ペイント後の useEffect で reveal 再スキャン（島内 [data-reveal] を拾う）
  useRevealDispatch();

  // アーカイブのフィルタ・並び替えなどで `[data-reveal]` 付きの中身が差し替わったあと、
  // GSAP の reveal（`initRevealAnimation`）に DOM を全文再スキャンさせる。
  useRevealRefreshOnChange([buildArchiveListKey(selectedCategory, sortOrder)]);

  // 横スクロール領域の ref（GSAP と scrollTo 共用）
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const listKey = buildArchiveListKey(selectedCategory, sortOrder);

  // 横スクロールを縦スクロールに変換する GSAP ScrollTrigger を設定
  const { maxScrollLeft, pinSt } = useHorizontalScrollTrigger(
    scrollerRef,
    listKey,
    "[data-gallery-scroller]",
    "[data-gallery-slug-root]",
  );

  // カテゴリ／ソート変更時に PIN 開始位置（ギャラリー先頭）へ戻す
  useScrollToPinStart(pinSt, [selectedCategory, sortOrder], "#archive-main");

  // useScrollArchiveMainOnFilterChange([selectedCategory, sortOrder]);

  // ソート・カテゴリ変更時に「最後に見た画像への復元スクロール」をキャンセルする
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
    <section className="w-full">
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
        key={buildArchiveListKey(selectedCategory, sortOrder)}
        data-reveal-once
      >
        <GalleryTrack
          items={displayItems}
          resetKey={buildArchiveListKey(selectedCategory, sortOrder)}
          onOpenImage={lightboxBridge.openAt}
          scrollToId={lightboxBridge.scrollToId}
          scrollToken={lightboxBridge.scrollToken}
          scrollerRef={scrollerRef}
          maxScrollLeft={maxScrollLeft}
          pinSt={pinSt}
        />
      </div>

      <ImageLightboxModal
        // GalleryLinearSliderItem[] を LightboxItem[] に変換済みの配列
        items={lightboxBridge.lightboxItems}
        initialIndex={lightboxBridge.initialIndex}
        isOpen={lightboxBridge.isOpen}
        onClose={lightboxBridge.closeAt}
        // 閉じたときのフォーカス復帰先（トラック上の元ボタン）
        returnTargetId={lightboxBridge.returnTargetId}
      />
    </section>
  );
};
