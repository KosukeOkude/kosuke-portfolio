import { ScrollTrigger } from "@/gsap/core/setup";

let loadRefreshRegistered = false;

export function registerScrollTriggerRefreshOnLoad(): void {
  if (typeof window === "undefined" || loadRefreshRegistered) return;
  loadRefreshRegistered = true;

  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  });
}
