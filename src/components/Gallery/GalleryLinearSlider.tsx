import { useState, useMemo } from "react";
import { GalleryTrack } from "@/components/Gallery/GalleryTrack";
import { sortByDate } from "@/utils/sortByDate";
import { filterByCategory } from "@/utils/filterByCategory";
import { type CategoryOption } from "@/type/category";
import ImageLightboxModal from "@/components/Lightbox/ImageLightboxModal";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import useGalleryLightboxScrollBridge from "@/components/Lightbox/hooks/useLightboxScrollBridge";
import { ArchiveCategoryChips } from "@/components/UI/ArchiveCategoryChips";
import { ArchiveDateSortSelect } from "@/components/UI/ArchiveDateSortSelect";
import type { DateSortOrder } from "@/type/DateSortOrder";
import { toTimeMsOrZero } from "@/utils/toTimeMsOrZero";
import { useRevealDispatch } from "@/gsap/core/useRevealDispatch";
import { useRevealRefreshOnChange } from "@/hooks/useRevealRefreshOnChange";
import { buildArchiveListKey } from "@/utils/archive/buildArchiveListKey";
import { useScrollArchiveMainOnFilterChange } from "@/hooks/useScrollArchiveMainOnFilterChange";

type GalleryLinearSliderProps = {
  items: GalleryLinearSliderItem[];
  categories: CategoryOption[];
  initialCategory?: string;
};

export const GalleryLinearSlider = ({
  items,
  categories,
  initialCategory,
}: GalleryLinearSliderProps) => {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ?? "All",
  );
  const [sortOrder, setSortOrder] = useState<DateSortOrder>("date-desc");
  // カテゴリで絞る（Allなら全件）
  const filteredByCategoryItems = filterByCategory(
    items,
    selectedCategory,
    (g) => g.categorySlug,
  );

  const displayItems = useMemo(
    () =>
      sortByDate(filteredByCategoryItems, sortOrder, (n) =>
        toTimeMsOrZero(n.createdAt),
      ),
    [filteredByCategoryItems, sortOrder],
  );

  const lightboxBridge = useGalleryLightboxScrollBridge(displayItems);

  // 初回ペイント後の useEffect で reveal 再スキャン（島内 [data-reveal] を拾う）
  useRevealDispatch();

  // アーカイブのフィルタ・並び替えなどで `[data-reveal]` 付きの中身が差し替わったあと、
  // GSAP の reveal（`initRevealAnimation`）に DOM を全文再スキャンさせる。
  useRevealRefreshOnChange([buildArchiveListKey(selectedCategory, sortOrder)]);

  // カテゴリ／ソート変更のたび一覧（#archive-main）へスクロール（deps は listKey で変化を 1 本にまとめる）
  useScrollArchiveMainOnFilterChange([selectedCategory, sortOrder]);

  return (
    <section className="w-full">
      <ArchiveCategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <ArchiveDateSortSelect
        value={sortOrder}
        onChange={setSortOrder}
      />
      <div
        key={buildArchiveListKey(selectedCategory, sortOrder)}
        data-reveal
        id="archive-main"
      >
        <GalleryTrack
          items={displayItems}
          resetKey={buildArchiveListKey(selectedCategory, sortOrder)}
          onOpenImage={lightboxBridge.openAt}
          // Lightboxを閉じた位置までトラックを戻すためのターゲットID
          scrollToId={lightboxBridge.scrollToId}
          // 同じIDでも再スクロールを起こすためのトリガー
          scrollToken={lightboxBridge.scrollToken}
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
