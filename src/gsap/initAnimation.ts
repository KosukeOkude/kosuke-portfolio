import { whenDomReady } from "@/gsap/core/whenDomReady";
import { animationHeroIntro } from "@/gsap/animations/hero.animation";
import { registerScrollTriggerRefreshOnResize } from "@/gsap/core/scrollTriggerRefresh";

import { registerWorksTopAnimationListener } from "@/gsap/animations/worksTop.animation.react";
import { runWorksTopAnimation } from "@/gsap/animations/worksTop.animation";

import { runGalleryTopAnimation } from "@/gsap/animations/galleryTop.animation";
//BaseLayout.astroでインポートしています
whenDomReady(registerScrollTriggerRefreshOnResize);

whenDomReady(animationHeroIntro);

whenDomReady(runWorksTopAnimation);

whenDomReady(runGalleryTopAnimation);
