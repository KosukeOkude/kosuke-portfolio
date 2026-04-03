import { useMemo, useState, useCallback } from "react";

import { NewsList } from "@/components/News/NewsList";
import { type NewsArchive } from "@/data/news";
import { sortByDate } from "@/utils/sortByDate";
import { filterByCategory } from "@/utils/filterByCategory";
import { useAllCategories } from "@/utils/useAllCategories";
import { ArchiveCategoryChips } from "@/components/UI/ArchiveCategoryChips";
import { formatArchiveCategoryLabel } from "@/utils/archive/formatArchiveCategoryLabel";
import { ArchiveDateSortSelect } from "@/components/UI/ArchiveDateSortSelect";
import { useRevealDispatch } from "@/gsap/core/useRevealDispatch";
import { useRevealRefreshOnChange } from "@/hooks/useRevealRefreshOnChange";
import { toTimeMsOrZero } from "@/utils/toTimeMsOrZero";
import { useArchiveCategoryFromQuery } from "@/hooks/useArchiveCategoryFromQuery";
import { useArchiveMoreInCategoryLanding } from "@/hooks/useArchiveMoreInCategoryLanding";
import type { DateSortOrder } from "@/type/DateSortOrder";
import { buildArchiveListKey } from "@/utils/archive/buildArchiveListKey";
import { useScrollArchiveMainOnFilterChange } from "@/hooks/useScrollArchiveMainOnFilterChange";

interface NewsArchiveProps {
  newsItems: NewsArchive[];
}

export const NewsArchiveSection = ({ newsItems }: NewsArchiveProps) => {
  const [selectedCategory, setSelectedCategory] = useState<"All" | string>(
    "All",
  );
  const [sortOrder, setSortOrder] = useState<DateSortOrder>("date-desc");

  //一意なカテゴリを抽出し、先頭に 'All' を追加
  const getCategory = useCallback((n: NewsArchive) => n.category, []);

  const allCategories = useAllCategories(newsItems, getCategory);

  const filteredNews = useMemo(() => {
    const filtered = filterByCategory(
      newsItems,
      selectedCategory,
      (n) => n.category,
    );
    // sortByDate 用: item.date をエポック ms にし、Invalid / NaN は 0（同キーとして並ぶ）
    return sortByDate(filtered, sortOrder, (n) => toTimeMsOrZero(n.date));
  }, [newsItems, selectedCategory, sortOrder]);

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

  // 初回ペイント後の useEffect で reveal 再スキャン（島内 [data-reveal] を拾う）
  useRevealDispatch();

  // More in category 等: ?category= 反映 + #archive-main のときだけ一覧ブロックへスクロール
  useArchiveMoreInCategoryLanding();

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
      <div
        key={buildArchiveListKey(selectedCategory, sortOrder)}
        data-reveal
      >
        <NewsList newsItems={filteredNews} />
      </div>
    </>
  );
};
