import { isDateSortOrder } from "@/types";
import type { DateSortOrder } from "@/types";

export interface ArchiveDateSortSelectProps {
  value: DateSortOrder;
  onChange: (order: DateSortOrder) => void;
  /** <label htmlFor> / <select id> 用。1ページに複数あるときはずらす */
  id?: string;
  /** 外側ラッパー（余白など） */
  className?: string;
  /** フォーム送信などで必要なら */
  name?: string;
}

export const ArchiveDateSortSelect = ({
  value,
  onChange,
  className,
  id = 'archive-date-sort',
  name
}: ArchiveDateSortSelectProps) => (
  <div className={`${className ?? ''} mb-5 md:mb-10`}>
    <label
      htmlFor={id}
      className="sr-only"
    >
      並び替え
    </label>
    <select
      id={id}
      value={value}
      name={name}
      onChange={(e) => { const v = e.target.value; if (isDateSortOrder(v)) onChange(v); }}
      className="cursor-pointer text-[12px] md:text-sm bg-white/10 border border-white/30 rounded px-3 py-1.5 text-white"
    >
      <option value="date-asc">新着順</option>
      <option value="date-desc">古い順</option>
    </select>
  </div>
);
