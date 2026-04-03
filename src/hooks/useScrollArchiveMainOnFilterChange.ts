import { useEffect, useRef, type DependencyList } from "react";
import { ARCHIVE_MAIN_ANCHOR_ID } from "@/constants/archiveMainAnchor";

/**
 * アーカイブでチップ・並び替えなど **フィルタに相当する値が変わったあと**、
 * `id="archive-main"` の要素へ `scrollIntoView` する（ページ内の一覧エリアへ寄せる）。
 *
 * - `deps` は `useEffect` の依存配列と同じ。例: `[selectedCategory, sortOrder]` や
 *   `[buildArchiveListKey(selectedCategory, sortOrder)]`（いずれも「組が変わったら」でよい）。
 * - **初回マウント時も 1 回実行**される。メニュー直後は動かしたくない場合は呼び出し側で別途ガードするか、
 *   フックに「初回スキップ」を足す。
 * - 詳細からの **`#archive-main` 付き遷移**は `useArchiveMoreInCategoryLanding` の担当。こちらは同じページ上の操作向け。
 * - ページに `id="archive-main"` が無いと何もしない。
 *
 * rAF を二重に入れているのはレイアウト確定後に寄せるため。timeout は島・reveal 直後のフォロー。
 */

export function useScrollArchiveMainOnFilterChange(deps: DependencyList): void {
    const isFirstRunRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isFirstRunRef.current) {
        isFirstRunRef.current = false;
        return;
    }

    const scrollToMainIntoView = (): void => {
      const el = document.getElementById(ARCHIVE_MAIN_ANCHOR_ID);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToMainIntoView);
    });

    const timeoutId = window.setTimeout(scrollToMainIntoView, 120);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, deps);
}
