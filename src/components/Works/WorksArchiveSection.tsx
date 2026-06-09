import { useMemo, useState, useCallback, useRef } from "react";
import type { WorkForClient } from "@/data/works";
import { WorksCardSlider } from "@/components/Works/WorksCardSlider";

import { sortByDate, filterByCategory, formatArchiveCategoryLabel,buildArchiveListKey } from "@/utils";
import { useAllCategories } from "@/hooks";
import { ArchiveCategoryChips } from "@/components/UI/ArchiveCategoryChips";

import { ArchiveDateSortSelect } from "@/components/UI/ArchiveDateSortSelect";
import { useRevealDispatch } from "@/gsap/core";
import type { DateSortOrder } from "@/types";
import { useArchiveMoreInCategoryLanding, useRevealRefreshOnChange, useArchiveCategoryFromQuery } from "@/hooks";

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

  const scrollerRef = useRef<HTMLDivElement | null>(null);

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
<WorksCardSlider
          key={buildArchiveListKey(selectedCategory, sortOrder)}
          works={filteredWorks}
          scrollerRef={scrollerRef}
        />
      </section>
    </>
  );
};
