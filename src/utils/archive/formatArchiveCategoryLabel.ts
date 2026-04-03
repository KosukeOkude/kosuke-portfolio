/**
 * アーカイブのカテゴリチップ向けの表示用文字列。
 *
 * CMS などからは識別子としての `category` 文字列（フィルタ・クエリと同じ値＝`slug` 相当）だけが来ることが多く、
 * `ArchiveCategoryChips` は `{ slug, label }` のうち **画面上の見た目用 `label`** を別途必要とする。
 * この関数はその `label` 用に、**`All` はそのまま**、それ以外は **先頭 1 文字だけ大文字**（タイトルケース風）にする。
 * 識別子そのものは `slug` 側で変えず、表示だけ整える用途。
 */
export function formatArchiveCategoryLabel(category: string): string {
  return category === "All"
    ? "All"
    : category.charAt(0).toUpperCase() + category.slice(1);
}