import { gsap, ScrollTrigger, prefersReducedMotion } from "@/gsap/core/setup";
import { scrollPinFromPin } from "@/gsap/presets/pin/scrollPinFromPin";

function getMaxScrollLeft(el: HTMLElement): number {
  return Math.max(0, el.scrollWidth - el.clientWidth);
}

export function runWorksTopAnimation(): void {
  const root = document.querySelector<HTMLElement>("[data-works-top-root]");
  if (!root) return;
  const cardSlider = root.querySelector<HTMLElement>("[data-card-slider]");
  const bgWrapper = root.querySelector<HTMLElement>(
    "[data-background-wrapper]",
  );
  const overlay = root.querySelector<HTMLElement>("[data-animation-overlay]");
  const next = root.nextElementSibling as HTMLElement;
  const cta = root.querySelector<HTMLElement>("[data-works-cta]");
  const titleBlock = root.querySelector<HTMLElement>("[data-works-top-title]");
  const hint = root.querySelector<HTMLElement>("[data-works-top-hint]");

  if (!cardSlider || !bgWrapper || !next) return;

  if (prefersReducedMotion()) {
    gsap.set([cardSlider], { opacity: 1 });
    return;
  }

  const scroller = cardSlider.querySelector<HTMLElement>(
    ".works-card-slider-scroll",
  );
  if (!scroller) return;

  gsap.set([titleBlock, overlay, hint, cardSlider], { opacity: 0 });

  const headingTl = gsap.timeline({ paused: true });

  headingTl.fromTo(
    overlay,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: "power2.out" },
  );
  headingTl.fromTo(
    titleBlock,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: "power2.out" },
    "<",
  );
  headingTl.fromTo(
    hint,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: "power2.out" },
    "<",
  );

  ScrollTrigger.create({
    trigger: root,
    start: "top -2%",
    end: "+=50",
    animation: headingTl,
    scrub: true,
    toggleActions: "play none none reverse",
  });

  const cardTl = gsap.timeline({ paused: true });
  cardTl.to(
    cardSlider,
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    },
    0,
  );

  cardTl.to(
    scroller,
    {
      opacity: 1,
      scrollLeft: () => getMaxScrollLeft(scroller),
      duration: 5,
      ease: "none",
    },
    0,
  );
  cardTl.to({}, { duration: 2 });

  const worksSt = ScrollTrigger.create({
    trigger: root,
    start: "bottom bottom",
    end: "+=1200",
    pin: root,
    scrub: 1,
    animation: cardTl,
    invalidateOnRefresh: true,
  });

  scrollPinFromPin(
    [bgWrapper, cardSlider, titleBlock, cta, hint],
    next,
    () => worksSt.end,
  );
}
