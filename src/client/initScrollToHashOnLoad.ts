import { lenis } from "@/client/initLenis";

import { waitForScrollTriggerRefresh } from "@/utils/waitForScrollTriggerRefresh";
/**
 * ページロード時に URL のハッシュ（例: `#contact`）が存在する場合、
 * ScrollTrigger の初回 refresh 完了後に lenis でそのセクションへスクロールする。
 *
 * ScrollTrigger の refresh を待つのは、GSAP が pin/ST を計算し終える前に
 * scrollTo を呼ぶとスクロール位置がずれるため。
 */
export function scrollToHashOnLoad(): void {
  const hash = window.location.hash;
  if (!hash) return;

  const lenisInstance = lenis;

  const target = document.querySelector(hash);
  if (!target || !lenisInstance) return;

  waitForScrollTriggerRefresh(() => {
    lenisInstance.scrollTo(target as HTMLElement);
  });
}

scrollToHashOnLoad();
