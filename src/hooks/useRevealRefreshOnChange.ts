import { useEffect, type DependencyList } from "react";
import { REVEAL_REFRESH_EVENT } from "@/gsap/core/useRevealDispatch";

/**
 * アーカイブのフィルタ・並び替えなどで `[data-reveal]` 付きの中身が差し替わったあと、
 * GSAP の reveal（`initRevealAnimation`）に DOM を全文再スキャンさせる。
 *
 * `useRevealDispatch` は島のマウント直後に 1 回だけ投げる用。
 * こちらは **依存（deps）が変わるたび** に `reveal:refresh` を発火する。
 * 同じイベントを `window` で購読している `initRevealAnimation` が `runGlobalRevealAnimation` を再度走らせる。
 */


export function useRevealRefreshOnChange(deps: DependencyList): void {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(REVEAL_REFRESH_EVENT));
  }, deps);
}
