import { gsap, ScrollTrigger, prefersReducedMotion } from "@/gsap/core/setup";
import { scrollPinFromPin } from "@/gsap/presets/pin/scrollPinFromPin";
// import { scrollPinTo } from "@/gsap/presets/pin/scrollPin";

export function animationHeroIntro(): void {
  const root = document.querySelector<HTMLElement>("[data-hero-root]");
  if (!root) return;
  const videoWrap = root.querySelector<HTMLElement>("[data-hero-bg-parallax]");
  const overlay = root.querySelector<HTMLElement>("[data-hero-overlay]");
  const profileWrap = root.querySelector<HTMLElement>("[data-hero-profile-wrap]");
  const nameEl = root.querySelector<HTMLElement>("[data-hero-name]");
  const titleEl = root.querySelector<HTMLElement>("[data-hero-title]");
  const next = root.nextElementSibling as HTMLElement | null;

  if (!overlay || !profileWrap || !nameEl || !titleEl) return;

  if (prefersReducedMotion()) {
    gsap.set([profileWrap, nameEl, titleEl], { opacity: 1 });
    return;
  }
  gsap.set([overlay, profileWrap, nameEl, titleEl], { opacity: 0 });
  const isTouchDevice = navigator.maxTouchPoints > 0;

  const tl = gsap.timeline({ paused: true });

  if (isTouchDevice) {
    tl.play();
    tl.to(overlay, { opacity: 0, duration: 1 });
    tl.to([nameEl, titleEl, profileWrap], { opacity: 1, duration: 0.45 }, "+=0.08");
    return;
  }

  tl.to({}, { duration: 2 });
  tl.to(overlay, { opacity: 1, duration: 1 });
  tl.to(profileWrap, { opacity: 1, duration: 0.8 }, "-=0.5");
  tl.to([nameEl, titleEl], { opacity: 1, duration: 0.45 }, "+=0.08");
  tl.to({}, { duration: 1 });

  const introSt = ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "+=1700",
    pin: true,
    scrub: 1,
    animation: tl,
    invalidateOnRefresh: true,
  });

  scrollPinFromPin([videoWrap], next, () => introSt.end);
  ScrollTrigger.refresh();
}
