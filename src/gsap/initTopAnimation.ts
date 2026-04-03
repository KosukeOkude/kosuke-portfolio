import { whenDomReady } from "@/gsap/core/whenDomReady";

import { animationHeroIntro } from "@/gsap/presets/pinAnimations/hero.animation";

import { registerScrollTriggerRefreshOnResize } from "@/gsap/core/scrollTriggerRefresh";
import { registerScrollTriggerRefreshOnLoad } from "@/gsap/core/registerScrollTriggerRefreshOnLoad";

import { runWorksTopAnimation } from "@/gsap/presets/pinAnimations/worksTop.animation";

import { isHomePath } from "@/utils/homePath";

if (isHomePath()) {
  whenDomReady(animationHeroIntro);

  whenDomReady(runWorksTopAnimation);

  whenDomReady(registerScrollTriggerRefreshOnResize);

  whenDomReady(registerScrollTriggerRefreshOnLoad);
}
