import { useMemo, useState, useEffect, useCallback } from 'react';

import NewsList from '@/components/News/NewsList';
import { type NewsArchive } from '@/data/news';
import { NewsCategories } from '@/components/News/NewsCategories';
import { NewsSortSelect } from '@/components/News/NewsSortSelect';
import { sortByDate, type DateSortOrder } from '@/utils/sortByDate';
import { filterByCategory } from '@/utils/filterByCategory';
import { parseCategoryQueryParam } from '@/utils/parseCategoryQueryParam';
import { useAllCategories } from '@/utils/useAllCategories';

interface NewsArchiveProps {
  newsItems: NewsArchive[];
}


export const NewsArchiveSection = ({ newsItems }: NewsArchiveProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
  const [sortOrder, setSortOrder] = useState<DateSortOrder>('date-desc');

  //一意なカテゴリを抽出し、先頭に 'All' を追加
  const getCategory = useCallback((n: NewsArchive) => n.category, []);
  const allCategories = useAllCategories(newsItems, getCategory);

  // シングルページの「More in this category」からの ?category=... クエリを初期カテゴリに反映する
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const parsed = parseCategoryQueryParam(params.get('category'));
    if (parsed !== null) setSelectedCategory(parsed);
  }, []);

  const getDateMs = (n: NewsArchive): number => {
    const ms = new Date(n.date).getTime();
    return Number.isFinite(ms) ? ms : 0;
  };

  const filteredNews = useMemo(() => {
    const filtered = filterByCategory(newsItems, selectedCategory, (n) => n.category);
    return sortByDate(filtered, sortOrder, getDateMs);
  }, [newsItems, selectedCategory, sortOrder]);

  return (
    <div>
      <NewsCategories categories={allCategories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      <NewsSortSelect value={sortOrder} onChange={setSortOrder} />
      <NewsList newsItems={filteredNews} />
    </div>
  );
};
