import type { DateSortOrder } from "@/type/DateSortOrder";


// utils/buildArchiveListKey.ts
export function buildArchiveListKey(
  category: string,
  sortOrder: DateSortOrder,
): string {
  return `${category}-${sortOrder}`;
}
