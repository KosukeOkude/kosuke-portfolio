import { useMemo, useState, useCallback, useRef } from "react";
import type { WorkForClient } from "@/data/works";
import { WorksCardSlider } from "@/components/Works/WorksCardSlider";
import { filterByCategory } from "@/utils/filterByCategory";
import { sortByDate } from "@/utils/sortByDate";
import { useAllCategories } from "@/utils/useAllCategories";
import { ArchiveCategoryChips } from "@/components/UI/ArchiveCategoryChips";
import { formatArchiveCategoryLabel } from "@/utils/archive/formatArchiveCategoryLabel";
import { ArchiveDateSortSelect } from "@/components/UI/ArchiveDateSortSelect";
import { useRevealDispatch } from "@/gsap/core/useRevealDispatch";
import { useArchiveMoreInCategoryLanding } from "@/hooks/useArchiveMoreInCategoryLanding";
import { useRevealRefreshOnChange } from "@/hooks/useRevealRefreshOnChange";
import { buildArchiveListKey } from "@/utils/archive/buildArchiveListKey";
import type { DateSortOrder } from "@/type/DateSortOrder";
import { useArchiveCategoryFromQuery } from "@/hooks/useArchiveCategoryFromQuery";
import { useScrollToPinStart } from "@/hooks/useScrollToPinStart";
import { useHorizontalScrollTrigger } from "@/hooks/useHorizontalScrollTrigger";
import WorksArchiveHint from "@/components/Works/WorksArchiveHint";

interface WorksArchiveSectionProps {
  works: WorkForClient[];
}

export const WorksArchiveSection = ({ works }: WorksArchiveSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<"All" | string>("All");
  const [sortOrder, setSortOrder] = useState<DateSortOrder>("date-desc");

  //一意なカテゴリを抽出し、先頭に 'All' を追加
  const getCategory = useCallback((n: WorkForClient) => n.category, []);

  const allCategories = useAllCategories(works, getCategory);

  const filteredWorks = useMemo(() => {
    const filtered = filterByCategory(works, selectedCategory, (w) => w.category);
    return sortByDate(filtered, sortOrder, (w) => new Date(w.date).getTime());
  }, [works, selectedCategory, sortOrder]);

  // slug は item.category、label はチップ表示用（詳細は formatArchiveCategoryLabel）
  const categoryChips = useMemo(
    () =>
      allCategories.map((slug) => ({
        slug,
        // チップの見出し用（識別子 slug とは別）
        label: formatArchiveCategoryLabel(slug),
      })),
    [allCategories],
  );

  // マウント時: URL の ?category= をチップ状態へ反映（More in category 用）
  useArchiveCategoryFromQuery(setSelectedCategory);

  // More in category 等: ?category= 反映 + #archive-main のときだけ一覧ブロックへスクロール
  useArchiveMoreInCategoryLanding();

  // 初回ペイント後の useEffect で reveal 再スキャン（島内 [data-reveal] を拾う）
  useRevealDispatch();

  // アーカイブのフィルタ・並び替えなどで `[data-reveal]` 付きの中身が差し替わったあと、
  // GSAP の reveal（`initRevealAnimation`）に DOM を全文再スキャンさせる。
  useRevealRefreshOnChange([selectedCategory, sortOrder]);

  // 横スクロール領域の ref（GSAP と scrollTo 共用）
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const listKey = buildArchiveListKey(selectedCategory, sortOrder);

  // 横スクロールを縦スクロールに変換する GSAP ScrollTrigger を設定
  const { pinSt } = useHorizontalScrollTrigger(
    scrollerRef,
    listKey,
    "[data-card-slider]",
    "[works-archive-root]",
  );

  // カテゴリ／ソート変更時に PIN 開始位置（Works 一覧先頭）へ戻す
  useScrollToPinStart(pinSt, [selectedCategory, sortOrder], "#archive-main");

  return (
    <>
      <ArchiveCategoryChips
        categories={categoryChips}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <ArchiveDateSortSelect
        value={sortOrder}
        onChange={setSortOrder}
      />
      <section
        aria-label="Works archive"
        className="space-y-4"
      >
        <WorksArchiveHint />
        <WorksCardSlider
          key={buildArchiveListKey(selectedCategory, sortOrder)}
          works={filteredWorks}
          scrollerRef={scrollerRef}
        />
      </section>
    </>
  );
};
