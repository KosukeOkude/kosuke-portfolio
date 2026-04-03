import { gsap, ScrollTrigger, prefersReducedMotion } from "@/gsap/core/setup";

import { SELECTORS } from "@/gsap/core/selectors";

export function animationHeroIntro(): void {
  const root = document.querySelector(SELECTORS.heroRoot);
  if (!root) return;

  const overlay = root.querySelector(SELECTORS.sectionOverlay);
  const hint = root.querySelector(SELECTORS.heroHint);
  const profileWrap = root.querySelector(SELECTORS.heroProfileWrap);
  const nameEl = root.querySelector(SELECTORS.heroName);
  const titleEl = root.querySelector(SELECTORS.heroTitle);

  if (!overlay || !profileWrap || !nameEl || !titleEl) return;

  if (prefersReducedMotion()) {
    gsap.set([overlay, profileWrap, nameEl, titleEl], { opacity: 1 });
    return;
  }

  gsap.set([overlay, profileWrap, nameEl, titleEl], { opacity: 0 });

  const tl = gsap.timeline({ paused: true });

  tl.to(hint, { opacity: 0, duration: 1 });
  tl.to(overlay, { opacity: 1, duration: 1 });
  tl.to(profileWrap, { opacity: 1, duration: 0.8 }, "-=0.5");
  tl.to([nameEl, titleEl], { opacity: 1, duration: 0.45 }, "+=0.08");
  tl.to({}, { duration: 1.2 });

  ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "+=1200", // このスクロール量で 1 周
    pin: true,
    scrub: 1, // 戻しスクロールで逆再生
    animation: tl,
    invalidateOnRefresh: true,
  });
}
