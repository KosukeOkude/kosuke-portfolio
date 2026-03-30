import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/gsap/core/setup";

export const WORKS_TOP_CARD_READY = "works-top-cards-ready";

let worksTopAnimationStarted = false;

function runWorksTopAnimation(): void {
  if (worksTopAnimationStarted) return;
  const root = document.querySelector("[data-works-top-root]");
  const cardSlider = root?.querySelector("[data-card-slider]");

  if (!root || !cardSlider) return;
  const overlay = root.querySelector("[data-section-overlay]");
  const HeadingBlock = root.querySelector("[data-heading-block]");
  const hint = root.querySelector("[data-scroll-hint]");

  // アニメーションは行わず、最終表示状態だけ即時に出す
  if (prefersReducedMotion()) {
    gsap.set([overlay, HeadingBlock, hint, cardSlider], {
      opacity: 1,
    });
    worksTopAnimationStarted = true;
    return;
  }

  const scroller = cardSlider.querySelector<HTMLElement>(
    ".works-card-slider-scroll",
  );
  if (!scroller) return;
  worksTopAnimationStarted = true;

  gsap.set([overlay, HeadingBlock, hint, cardSlider], { opacity: 0 });

  // 横スクロールで右端まで動かすときの scrollLeft の最大値
  function getMaxScrollLeft(el: HTMLElement): number {
    return Math.max(0, el.scrollWidth - el.clientWidth);
  }

  const tl = gsap.timeline({ paused: true });
  tl.to(overlay, { opacity: 1, duration: 1 }, "+=0.5");
  tl.to(
    [HeadingBlock, hint],
    { opacity: 1, duration: 0.45 },
    "+=0.5",
  );
  tl.to(cardSlider, { opacity: 1, duration: 0.8 }, "+=0.5");
  tl.to(
    scroller,
    {
      scrollLeft: () => getMaxScrollLeft(scroller),
      duration: 5,
      ease: "none",
    },
    ">",
  );
  tl.to({}, { duration: 1.2 });

  ScrollTrigger.create({
    trigger: root,
    start: "center center",
    end: "+=2000",
    pin: root,
    scrub: 1,
    animation: tl,
    invalidateOnRefresh: true,
  });
}

// カードスライダー準備完了のカスタムイベントで Works トップのアニメを開始する
export function registerWorksTopAnimationListener(): void {
  window.addEventListener(
    WORKS_TOP_CARD_READY,
    runWorksTopAnimation,
    {
      passive: true,
    },
  );
}
