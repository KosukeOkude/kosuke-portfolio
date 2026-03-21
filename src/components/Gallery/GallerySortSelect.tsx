import type { FC } from 'react';

export type GallerySortOrder = 'date-desc' | 'date-asc';

interface GallerySortSelectProps {
    value: GallerySortOrder;
    onChange: (value: GallerySortOrder) => void;
}

export const GallerySortSelect: FC<GallerySortSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
        <label htmlFor="gallery-sort-order" className="sr-only">
            並び替え
        </label>
        <select id="gallery-sort-order" name="sortOrder" value={value} onChange={(e) => onChange(e.target.value as GallerySortOrder)}>
            <option value="date-desc">新しい順</option>
            <option value="date-asc">古い順</option>
        </select>
    </div>
  );
};