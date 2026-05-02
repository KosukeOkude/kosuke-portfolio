import type { DateSortOrder } from '@/types';

interface NewsSortSelectProps {
    value: string
    onChange: (order:DateSortOrder) => void
}

export const NewsSortSelect = ({ value, onChange }: NewsSortSelectProps) => {
  return (
    <div className="mb-4">
        <label htmlFor="works-sort" className="sr-only">並び替え</label>
        <select
            id="works-sort"
            value={value}
            onChange={(e) => onChange(e.target.value as DateSortOrder)}
            className="text-xs md:text-sm bg-white/10 border border-white/30 rounded px-3 py-1.5 text-white"
        >
            <option value="date-desc">新着順</option>
            <option value="date-asc">古い順</option>
        </select>
    </div>
  );
};