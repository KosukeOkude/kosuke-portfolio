import { useEffect, useRef } from "react";
import { ARCHIVE_MAIN_ANCHOR_ID } from "@/constants/archiveMainAnchor";

const archiveMainHash = `#${ARCHIVE_MAIN_ANCHOR_ID}`;

/**
 * 詳細の「More in this category」などから `#archive-main` 付きでアーカイブに戻ったとき、
 * 島の描画後に `id="archive-main"` へ `scrollIntoView` する（1 回だけ）。
 *
 * `?category=` によるチップ同期は `useArchiveCategoryFromQuery` に任せる。
 * メニューからの素の `/works` `/news` ではハッシュが無いためスクロールしない。
 */
export function useArchiveMoreInCategoryLanding(): void {
  const didScrollRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash !== archiveMainHash) {
      return;
    }

    const scrollArchiveMainIntoView = (): void => {
      if (didScrollRef.current) return;
      const el = document.getElementById(ARCHIVE_MAIN_ANCHOR_ID);
      if (!el) return;
      didScrollRef.current = true;
      el.scrollIntoView({ behavior: "auto", block: "start" });
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(scrollArchiveMainIntoView);
    });
    const timeoutId = window.setTimeout(scrollArchiveMainIntoView, 120);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, []);
}