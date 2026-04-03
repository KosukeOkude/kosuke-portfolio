import { useMemo, useState, useCallback } from "react";
import type { WorkForClient } from "@/data/works";
import { WorksCardSlider } from "@/components/Works/WorksCardSlider";
import { filterByCategory } from "@/utils/filterByCategory";
import { sortByDate } from "@/utils/sortByDate";
import { useAllCategories } from "@/utils/useAllCategories";
import { ArchiveCategoryChips } from "@/components/UI/ArchiveCategoryChips";
import { formatArchiveCategoryLabel } from "@/utils/archive/formatArchiveCategoryLabel";
import { ArchiveDateSortSelect } from "@/components/UI/ArchiveDateSortSelect";
import { useRevealDispatch } from "@/gsap/core/useRevealDispatch";
import WorksArchiveHint from "@/components/Works/WorksArchiveHint";
import { useArchiveMoreInCategoryLanding } from "@/hooks/useArchiveMoreInCategoryLanding";
import { useRevealRefreshOnChange } from "@/hooks/useRevealRefreshOnChange";
import { buildArchiveListKey } from "@/utils/archive/buildArchiveListKey";
import type { DateSortOrder } from "@/type/DateSortOrder";
import { useArchiveCategoryFromQuery } from "@/hooks/useArchiveCategoryFromQuery";
import { useScrollArchiveMainOnFilterChange } from "@/hooks/useScrollArchiveMainOnFilterChange";

interface WorksArchiveSectionProps {
  works: WorkForClient[];
}

export const WorksArchiveSection = ({ works }: WorksArchiveSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<"All" | string>(
    "All",
  );
  const [sortOrder, setSortOrder] = useState<DateSortOrder>("date-desc");

  //一意なカテゴリを抽出し、先頭に 'All' を追加
  const getCategory = useCallback((n: WorkForClient) => n.category, []);

  const allCategories = useAllCategories(works, getCategory);

  const filteredWorks = useMemo(() => {
    const filtered = filterByCategory(
      works,
      selectedCategory,
      (w) => w.category,
    );
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

  // カテゴリ／ソート変更のたび一覧（#archive-main）へスクロール（deps は listKey で変化を 1 本にまとめる）
  useScrollArchiveMainOnFilterChange([selectedCategory, sortOrder]);

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
      <WorksArchiveHint orientation="左右" />
      <section
        aria-label="Works archive"
        className="space-y-4"
      >
        <div
          key={buildArchiveListKey(selectedCategory, sortOrder)}
          data-reveal
        >
          <WorksCardSlider
            works={filteredWorks}
            resetKey={buildArchiveListKey(selectedCategory, sortOrder)}
          />
        </div>
      </section>
    </>
  );
};
