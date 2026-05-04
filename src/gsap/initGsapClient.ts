import {
  whenDomReady,
  isHomePath,
  runGlobalRevealAnimation,
  REVEAL_REFRESH_EVENT,
  registerScrollTriggerRefreshOnResize,
  registerScrollTriggerRefreshOnLoad,
} from "@/gsap/core";
import { animationHeroIntro, runWorksTopAnimation } from "@/gsap/preset";
import "@/gsap/preset";

// Reveal アニメーション（hydrate 前は astro-island 外のみ、refresh 後に全文スキャン）
function initRevealAnimation(): void {
  runGlobalRevealAnimation({ skipInsideAstroIslands: true });
  window.addEventListener(REVEAL_REFRESH_EVENT, () => {
    runGlobalRevealAnimation();
  });
}

whenDomReady(initRevealAnimation);

// トップページ専用アニメーション
if (isHomePath()) {
  whenDomReady(animationHeroIntro);
  whenDomReady(runWorksTopAnimation);
  whenDomReady(registerScrollTriggerRefreshOnResize);
  whenDomReady(registerScrollTriggerRefreshOnLoad);
}
