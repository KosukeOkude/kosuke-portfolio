import type { DateSortOrder } from "@/types";

// 日付値をミリ秒に変換する。Invalid Date のときは 0 を返す
export function toTimeMsOrZero(value: string | number | Date): number {
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

// DateSortOrder に従って配列を日付順に並び替える
export function sortByDate<T>(
  items: T[],
  sortOrder: DateSortOrder,
  getDateMs: (item: T) => number,
): T[] {
  const copy = [...items];
  if (sortOrder === "date-desc") {
    return copy.sort((a, b) => getDateMs(b) - getDateMs(a));
  } else {
    return copy.sort((a, b) => getDateMs(a) - getDateMs(b));
  }
}

// スラッグを小文字・トリムで統一し、全体で一貫した形式に保つ
export function normalizeSlug(input: string): string {
  return input.trim().toLowerCase();
}

// "All" のときはフィルタしない。それ以外は getCategory が一致する要素だけ残す
export function filterByCategory<T>(
  items: T[],
  category: string,
  getCategory: (item: T) => string,
): T[] {
  return category === "All"
    ? items
    : items.filter((item) => getCategory(item) === category);
}

// Sanity の画像 URL から指定幅リストの srcset 文字列を生成する
export function buildSrcSet(url: string, widths: number[]): string {
  if (!url) return "";
  return widths
    .map((w) => {
      const u = new URL(url);
      u.searchParams.set("w", String(w));
      u.searchParams.delete("h");
      return `${u.toString()} ${w}w`;
    })
    .join(", ");
}

// カテゴリ slug を表示用ラベルに変換する（"All" はそのまま、それ以外は先頭大文字）
export function formatArchiveCategoryLabel(category: string): string {
  return category === "All"
    ? "All"
    : category.charAt(0).toUpperCase() + category.slice(1);
}

// アーカイブ一覧の React key 用文字列を生成する
export function buildArchiveListKey(category: string, sortOrder: DateSortOrder): string {
  return `${category}-${sortOrder}`;
}

/** 詳細 → アーカイブ遷移時にスクロールさせる一覧エリア（全アーカイブ共通） */
export const ARCHIVE_MAIN_ANCHOR_ID = "archive-main";
