import { useState, useMemo } from 'react';
import type { FC } from 'react';
import type { GalleryLinearSliderItem } from '@/data/gallery';
import { GallerySortSelect, type GallerySortOrder } from '@/components/Gallery/GallerySortSelect';
import { GallerySliderCategory, type GalleryCategoryOption } from '@/components/Gallery/GallerySliderCategory';
import { GalleryTrack } from '@/components/Gallery/GalleryTrack';

type Props = {
  items: GalleryLinearSliderItem[];
  categories: GalleryCategoryOption[];
  initialCategory?: string;
};



export const GalleryLinearSlider: FC<Props> = ({ items, categories, initialCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? 'All');
  const [sortOrder, setSortOrder] = useState<GallerySortOrder>('date-desc');
  // カテゴリで絞る（Allなら全件）
  const visibleItems = selectedCategory === 'All' ? items : items.filter((item) => item.categorySlug === selectedCategory);
  const visibleItemsSorted = useMemo(() => sortGalleryItems(visibleItems, sortOrder), [visibleItems, sortOrder]);

  function getCreatedAtMs(item: GalleryLinearSliderItem) {
    const ms = new Date(item.createdAt).getTime();
    return Number.isFinite(ms) ? ms : 0;
  }

  function sortGalleryItems(items: GalleryLinearSliderItem[], sortOrder: GallerySortOrder) {
    const copy = [...items];

    if (sortOrder === 'date-desc') {
      return copy.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a));
    }
    if (sortOrder === 'date-asc') {
      return copy.sort((a, b) => getCreatedAtMs(a) - getCreatedAtMs(b));
    }
    return copy;
  }

  return (
    <section className="w-full">

      <GallerySortSelect
        value={sortOrder}
        onChange={setSortOrder}
        />
      <GallerySliderCategory
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <GalleryTrack
        items={visibleItemsSorted}
        resetKey={`${selectedCategory}-${sortOrder}`}
      />
    </section>
  );
}
