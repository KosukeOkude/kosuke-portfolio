import { whenDomReady } from "@/gsap/core/whenDomReady";

import { animationHeroIntro } from "@/gsap/presets/pin/hero.animation";

import { registerScrollTriggerRefreshOnResize } from "@/gsap/core/scrollTriggerRefresh";
import { registerScrollTriggerRefreshOnLoad } from "@/gsap/core/registerScrollTriggerRefreshOnLoad";

import { runWorksTopAnimation } from "@/gsap/presets/pin/worksTop.animation";

import { isHomePath } from "@/utils/homePath";

if (isHomePath()) {
  //PC時のみヒーロースクロールトリガー再生
  if (navigator.maxTouchPoints === 0) {
    whenDomReady(animationHeroIntro);
  }

  whenDomReady(runWorksTopAnimation);

  whenDomReady(registerScrollTriggerRefreshOnResize);

  whenDomReady(registerScrollTriggerRefreshOnLoad);
}
