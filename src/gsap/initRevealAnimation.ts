import { whenDomReady } from "@/gsap/core/whenDomReady";
import { runGlobalRevealAnimation } from "@/gsap/core/runGlobalRevealAnimation";
import { REVEAL_REFRESH_EVENT } from "@/gsap/core/useRevealDispatch";

/** hydrate 前に島内へ gsap しない（不一致防止）。refresh で島内も含め全文を再処理。 */
function initRevealAnimation(): void {
  runGlobalRevealAnimation({ skipInsideAstroIslands: true }); // 初回は astro-island 外だけ
  window.addEventListener(REVEAL_REFRESH_EVENT, () => {
    runGlobalRevealAnimation(); // 島マウント後など：全文スキャン
  });
}

whenDomReady(initRevealAnimation);
