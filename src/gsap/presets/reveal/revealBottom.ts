import { gsap } from "@/gsap/core/setup";

export function playRevealBottom(target: HTMLElement) {
  gsap.set(target, { opacity: 0 });
  gsap.to(target, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: target,
      start: "top 3%",
      toggleActions: "play reverse play reverse",
      invalidateOnRefresh: true,
    },
  });
}
