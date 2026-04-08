import { lenis } from "@/client/initLenis";

export function scrollToHashOnLoad (): void {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.querySelector(hash);
    if(!target || !lenis) return;

    lenis.scrollTo(target as HTMLElement);

    window.addEventListener('load', scrollToHashOnLoad);
}

export function initHashScroll(): void {
  document.addEventListener("click", (e) => {
    const anchor = (e.target as Element).closest<HTMLAnchorElement>(
      "a[href*'#']",
    );
    if (!anchor) return;

    const url = new URL(anchor.href);

    if (url.pathname !== window.location.pathname) return;
    const target = document.querySelector(url.hash);
    if (!target || !lenis) return;
    e.preventDefault();
    lenis.scrollTo(target as HTMLElement);
  });
}

initHashScroll();
