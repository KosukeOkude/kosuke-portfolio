import { lenis } from "@/client/initLenis";
import { ScrollTrigger } from "@/gsap/core/setup";

export function scrollToHashOnLoad(): void {
  const hash = window.location.hash;
  if (!hash) return;

  ScrollTrigger.addEventListener("refresh", function onRefresh() {
    ScrollTrigger.removeEventListener("refresh", onRefresh);

    const target = document.querySelector(hash);
    if (!target || !lenis) return;

    lenis.scrollTo(target as HTMLElement);
  });
}

scrollToHashOnLoad();
