import { gsap, ScrollTrigger, prefersReducedMotion } from "@/gsap/core/setup";
// import { scrollPinTo } from "@/gsap/presets/pin/scrollPin";

export function animationHeroIntro(): void {
  const root = document.querySelector<HTMLElement>("[data-hero-root]");
  if (!root) return;
  const videoWrap = root.querySelector<HTMLElement>("[data-hero-bg-parallax]");
  const overlay = root.querySelector<HTMLElement>("[data-hero-overlay]");
  const hint = root.querySelector<HTMLElement>("[data-hero-scroll-hint]");
  const profileWrap = root.querySelector<HTMLElement>(
    "[data-hero-profile-wrap]",
  );
  const nameEl = root.querySelector<HTMLElement>("[data-hero-name]");
  const titleEl = root.querySelector<HTMLElement>("[data-hero-title]");
  const next = root.nextElementSibling as HTMLElement | null;

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
  tl.to({}, { duration: 1 });

  // 背景をピン固定したい場合、ピンされる要素（ルート）と移動させたいラッパー（ここではvideoWrapなど）を分けておき、
  // ピンが効いている間はルートのみ固定、「Y方向の移動」はラッパー要素を別のScrollTriggerで動かす方法がベストプラクティスです。
  // こうすることで、ピンが終わっても背景がグイッと上には流れず、ラッパーだけY方向で固定されます。

  // まずpin: trueでルート要素そのものを1200pxスクロール分ピン固定する。
  const introSt = ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "+=1200",
    pin: true,
    scrub: 1,
    animation: tl,
    invalidateOnRefresh: true,
  });

  // 次に、ピンが終了した直後から、背景ラッパー含む要素群にy方向のトランスフォームを適用し、
  // ピンの終了位置(introSt.end)から次要素(next)のトップまで「Y: +100vh」移動させて、動的なレイヤー構成を実現する。
  gsap.to([overlay, profileWrap, nameEl, titleEl, videoWrap], {
    y: "+=100vh",
    ease: "none",
    scrollTrigger: {
      trigger: videoWrap,
      start: () => introSt.end,
      endTrigger: next!,
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  ScrollTrigger.refresh();
}
