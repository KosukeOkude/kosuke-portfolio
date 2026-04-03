import { gsap, ScrollTrigger, prefersReducedMotion } from "@/gsap/core/setup";
import { SELECTORS } from "@/gsap/core/selectors";

let worksTopAnimationStarted = false;

export function runWorksTopAnimation(): void {
  if (worksTopAnimationStarted) return;
  const root = document.querySelector(SELECTORS.worksTopRoot);
  const cardSlider = root?.querySelector(SELECTORS.cardSlider);

  if (!root || !cardSlider) return;

  // アニメーションは行わず、最終表示状態だけ即時に出す
  if (prefersReducedMotion()) {
    gsap.set([cardSlider], {
      opacity: 1,
    });
    worksTopAnimationStarted = true;
    return;
  }

  const scroller = cardSlider.querySelector<HTMLElement>(
    SELECTORS.worksCardSliderScroll,
  );
  if (!scroller) return;
  worksTopAnimationStarted = true;

  gsap.set([cardSlider], { opacity: 0 });

  function getMaxScrollLeft(el: HTMLElement): number {
    return Math.max(0, el.scrollWidth - el.clientWidth);
  }
  const fadeInCardSlider = (): void => {
    gsap.to(cardSlider, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    });
  };
  const tl = gsap.timeline({ paused: true });
  tl.to(
    scroller,
    {
      scrollLeft: () => getMaxScrollLeft(scroller),
      duration: 5,
      ease: "none",
    },
    0,
  );
  tl.to({}, { duration: 1.2 });
  ScrollTrigger.create({
    trigger: root,
    start: "bottom bottom",
    end: "+=1000",
    pin: root,
    scrub: 1,
    animation: tl,
    invalidateOnRefresh: true,
    onEnter: fadeInCardSlider,
    onEnterBack: fadeInCardSlider,
  });
}
