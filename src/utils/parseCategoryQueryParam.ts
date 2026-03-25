import { normalizeSlug } from '@/utils/normalizeSlug';

/**
 * `?category=` のクエリ値を、アーカイブの selectedCategory 用に解釈する。
 * MoreInCategory などのリンクと WorksArchiveSection / NewsArchiveSection の状態を揃える。
 *
 * @returns クエリなし・空のときは null（呼び出し側は state を更新しない）。
 *          "all"（normalize 後）なら 'All'、それ以外は normalizeSlug 済みの文字列。
 */

export function parseCategoryQueryParam(raw: string | null): 'All' | string | null {
  if (!raw) return null;
  const normalized = normalizeSlug(raw);
  if (normalized === 'all') return 'All';
  return normalized;
}
