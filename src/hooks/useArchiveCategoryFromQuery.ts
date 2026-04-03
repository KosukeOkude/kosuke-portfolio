import { useEffect, type Dispatch, type SetStateAction } from "react";
import { parseCategoryQueryParam } from "@/utils/parseCategoryQueryParam";

/**
 * アーカイブ島のマウント時に、現在の URL の `?category=` を 1 回だけ読み、
 * `parseCategoryQueryParam` で正規化した値があれば `selectedCategory` に反映する。
 *
 * 詳細ページの「More in this category」などから `?category=foo` 付きで遷移したとき、
 * チップの選択状態を URL と一致させる用途。ハッシュの有無は問わない。
 *
 * 発火タイミングは **`useEffect` の初回実行**（コミット後、通常はペイント後）。
 */
export function useArchiveCategoryFromQuery(
  setSelectedCategory: Dispatch<SetStateAction<"All" | string>>,
): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = parseCategoryQueryParam(
      new URLSearchParams(window.location.search).get("category"),
    );
    if (parsed !== null) {
      setSelectedCategory(parsed);
    }
  }, [setSelectedCategory]);
}