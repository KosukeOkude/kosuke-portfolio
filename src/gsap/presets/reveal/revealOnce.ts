import { gsap } from "@/gsap/core/setup";

export function playRevealOnce(target: HTMLElement) {
  gsap.set(target, { opacity: 0, y: 0 });
  gsap.to(target, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: target,
      start: "top top+=200px",
      toggleActions: "play none none none",
      invalidateOnRefresh: true,
    },
  });
}
