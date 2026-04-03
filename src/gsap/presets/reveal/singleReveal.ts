import { gsap } from "@/gsap/core/setup";

export function playRevealSingle(target: HTMLElement) {
  gsap.set(target, { opacity: 0, y: 16 });
  gsap.to(target, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: target,
      start: "top 90%",
      toggleActions:"play reverse play reverse",
      invalidateOnRefresh: true,
    },
  });
}
