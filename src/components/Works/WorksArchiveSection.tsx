import { useEffect, useMemo, useState, useCallback } from 'react';
import type { WorkForClient } from '@/data/works';
import { WorksCardSlider } from '@/components/Works/WorksCardSlider';
import { WorksCategories } from '@/components/Works/WorksCategories';
import { WorksSortSelect } from '@/components/Works/WorksSortSelect';
import { filterByCategory } from '@/utils/filterByCategory';
import { sortByDate, type DateSortOrder } from '@/utils/sortByDate';
import { parseCategoryQueryParam } from '@/utils/parseCategoryQueryParam';
import { useAllCategories } from '@/utils/useAllCategories';

interface WorksArchiveSectionProps {
  works: WorkForClient[];
}

export const WorksArchiveSection = ({ works }:WorksArchiveSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
  const [sortOrder, setSortOrder] = useState<DateSortOrder>('date-desc');

  //一意なカテゴリを抽出し、先頭に 'All' を追加
  const getCategory = useCallback((n: WorkForClient) => n.category, []);
  const allCategories = useAllCategories(works, getCategory);

  // シングルページの「More in this category」からの ?category=... クエリを初期カテゴリに反映する
  useEffect(() => {
    if(typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const parsed = parseCategoryQueryParam(params.get('category'));
    if(parsed !== null) setSelectedCategory(parsed);
  }, [])



  const filteredWorks = useMemo(() => {
    const filtered = filterByCategory(works, selectedCategory, w => w.category);
    return sortByDate(filtered, sortOrder, w => new Date(w.date).getTime());
  }, [works, selectedCategory, sortOrder]);

  return (
    <>
      <WorksCategories
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <WorksSortSelect
        value={sortOrder}
        onChange={setSortOrder}
      />
      <p className="text-xs md:text-sm text-white/60 mb-4">上下スクロールで作品が流れます</p>
      <section aria-label="Works archive" className="space-y-4">
        <WorksCardSlider works={filteredWorks} resetKey={`${selectedCategory}-${sortOrder}`}/>
      </section>
    </>
  );
};
