import { useEffect } from "react";

/**
 * `window` に投げるカスタムイベント名。`initRevealAnimation` が購読し、
 * `runGlobalRevealAnimation` による `[data-reveal]` の全文再スキャンを起こす。
 */
export const REVEAL_REFRESH_EVENT = "reveal:refresh";

/**
 * 初回マウント時に限り、コミット済み DOM に対して `reveal:refresh` を 1 回発火する。
 *
 * 発火タイミングは **`useEffect` の初回実行**＝React がコミットを終えたあと、
 * 通常はブラウザのペイントの後（`useLayoutEffect` より遅い非同期タイミング）。
 * マウントと同一の同期フレーム内ではない。
 *
 * Astro 島は Hydration で後から DOM に載るため、ページ初期の reveal では島内の `[data-reveal]` が
 * まだ無いことがある。そのためコミット後のこのタイミングでもう一度スキャンし、対象に含める。
 * フィルタ変更など依存の更新ごとに再スキャンしたい場合は `useRevealRefreshOnChange` を使う。
 *
 * 開発時 Strict Mode では effect が意図的に二重実行されうる（本番では通常 1 回）。
 */
export function useRevealDispatch(): void {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(REVEAL_REFRESH_EVENT));
  }, []);
}