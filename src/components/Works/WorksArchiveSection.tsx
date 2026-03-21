import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import type { WorkForClient } from '@/data/works';
import { WorksCardSlider } from '@/components/Works/WorksCardSlider';
import { WorksCategories } from '@/components/Works/WorksCategories';
import { WorksSortSelect, type SortOrder } from '@/components/Works/WorksSortSelect';
import { normalizeSlug } from '@/lib/sanity/normalizeSlug';

interface WorksArchiveSectionProps {
  works: WorkForClient[];
}

export const WorksArchiveSection: FC<WorksArchiveSectionProps> = ({ works }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-desc');

  // work.category から一意なカテゴリを抽出し、先頭に 'All' を追加
  const allCategories = useMemo(() => {
    const catSet = new Set<string>();
    for (const work of works) {
      catSet.add(work.category);
    }
    return ['All', ...catSet];
  }, [works]);

  // シングルページの「More in this category」からの ?category=... クエリを初期カテゴリに反映する
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const raw = params.get('category');
    if(!raw) return;
    const normalized = normalizeSlug(raw);

    if(normalized === 'all') setSelectedCategory('All');
    else setSelectedCategory(normalized);

  }, []);

  function filterByCategory(works: WorkForClient[], category: string): WorkForClient[] {
    return category === 'All'
    ? works
    : works.filter(w => w.category === category);
  }

  function sortWorks(works: WorkForClient[], sortOrder: 'date-desc' | 'date-asc' = 'date-desc'): WorkForClient[] {
    return [...works].sort((a, b) => {
      //降順ソート
      if (sortOrder === 'date-desc') {
        return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
      }
      //昇順ソート
      if (sortOrder === 'date-asc') {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      }
      return 0;
    });
  }
  const filteredWorks = useMemo(() => {
    const filtered = filterByCategory(works, selectedCategory);
    return sortWorks(filtered, sortOrder);
  }, [works, selectedCategory, sortOrder]);

  return (
    <>
      <WorksCategories categories={allCategories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      <WorksSortSelect value={sortOrder} onChange={setSortOrder} />
      <p className="text-xs md:text-sm text-white/60 mb-4">上下スクロールで作品が流れます</p>
      <section aria-label="Works archive" className="space-y-4">
        <WorksCardSlider works={filteredWorks} resetKey={`${selectedCategory}-${sortOrder}`}/>
      </section>
    </>
  );
};
