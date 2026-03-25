import { useState, useMemo } from 'react';
import type { FC } from 'react';
import type { GalleryLinearSliderItem } from '@/data/gallery';
import { GallerySortSelect } from '@/components/Gallery/GallerySortSelect';
import { GallerySliderCategory } from '@/components/Gallery/GallerySliderCategory';
import { GalleryTrack } from '@/components/Gallery/GalleryTrack';
import { sortByDate, type DateSortOrder } from '@/utils/sortByDate';
import { filterByCategory } from '@/utils/filterByCategory';
import { type CategoryOption } from "@/type/category";

type Props = {
  items: GalleryLinearSliderItem[];
  categories: CategoryOption[];
  initialCategory?: string;
};

export const GalleryLinearSlider: FC<Props> = ({ items, categories, initialCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? 'All');
  const [sortOrder, setSortOrder] = useState<DateSortOrder>('date-desc');
  // カテゴリで絞る（Allなら全件）
  const filteredByCategoryItems = filterByCategory(items, selectedCategory, g => g.categorySlug);

  const getDateMs = (n: GalleryLinearSliderItem) => {
    const ms = new Date(n.createdAt).getTime();
    return Number.isFinite(ms) ? ms : 0;
  };

  const displayItems = useMemo(
        () => sortByDate(filteredByCategoryItems, sortOrder, getDateMs),
        [filteredByCategoryItems, sortOrder]);

  return (
    <section className="w-full">
      <GallerySortSelect value={sortOrder} onChange={setSortOrder} />
      <GallerySliderCategory categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      <GalleryTrack items={displayItems} resetKey={`${selectedCategory}-${sortOrder}`} />
    </section>
  );
};
