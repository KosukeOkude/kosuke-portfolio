import { gsap } from "@/gsap/core/setup";

export function playRevealOnce(target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  const isAlreadyInView = rect.top < window.innerHeight;

  if (!isAlreadyInView) {
    gsap.set(target, { opacity: 0, y: 0 });
  }

  gsap.to(target, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: target,
      start: "top bottom",
      toggleActions: "play none none none",
      invalidateOnRefresh: true,
    },
  });
}
