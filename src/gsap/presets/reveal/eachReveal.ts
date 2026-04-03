import { gsap } from "@/gsap/core/setup";

export function playRevealEach(container: HTMLElement) {
  const children = Array.from(container.children) as HTMLElement[];
  if (children.length === 0) return;
  gsap.set(container, { opacity: 1, y: 0 });
  gsap.set(children, { opacity: 0, y: 16 });
  children.forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        end: "bottom top",
        toggleActions: "play reverse play reverse",
        invalidateOnRefresh: true,
      },
    });
  });
}
