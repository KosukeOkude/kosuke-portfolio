/**
 * アーカイブ一覧などで、選択中カテゴリに応じて配列を絞り込む。
 *
 * - `category === "All"` のときは **フィルタしない**（元の配列をそのまま返す。新しい配列は作らない）。
 * - それ以外は `getCategory(item)` が `category` と一致する要素だけ残す。
 * - `getCategory` で News / Works など型 `T` ごとに「比較に使う文字列」（チップの slug と同じ値）を取り出す。
 */
export function filterByCategory<T>(
  items: T[],
  category: string,
  getCategory: (item: T) => string,
): T[] {
  return category === "All"
    ? items
    : items.filter((item) => getCategory(item) === category);
}
