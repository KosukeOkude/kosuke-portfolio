import {
  gsap,
  ScrollTrigger,
  Draggable,
  prefersReducedMotion,
  whenDomReady,
  skipInsideAstroIslands,
} from "@/gsap/core";
import type { RunGlobalRevealOptions } from "@/types";

// ============================================================
// Reveal アニメーション
// ============================================================

// 子要素を順番にフェードインする
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

// 単体要素をスクロールでフェードイン/アウトする
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
      toggleActions: "play reverse play reverse",
      invalidateOnRefresh: true,
    },
  });
}

// 一度だけフェードインする（スクロールアウトで戻らない）
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

// スクロール進入時のみフェードイン（退出で戻らない）
export function playRevealSingleEnterOnly(target: HTMLElement) {
  gsap.set(target, { opacity: 0, y: 16 });
  gsap.to(target, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: target,
      start: "top 90%",
      toggleActions: "play none none none",
      invalidateOnRefresh: true,
    },
  });
}

// 画面下部に入ったときにフェードイン/アウトする
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

// セレクタに対応する reveal 関数を適用する（runGlobalRevealAnimation から呼ばれる）
export type RevealSelector =
  | "[data-reveal]"
  | "[data-reveal-each]"
  | "[data-reveal-once]"
  | "[data-reveal-enter]"
  | "[data-reveal-bottom]";

type ApplyRevealOptions = {
  selector: RevealSelector;
  options?: RunGlobalRevealOptions;
  started: WeakSet<Element>;
};

export function applyRevealBySelector({
  selector,
  options,
  started,
}: ApplyRevealOptions): void {
  const targetElements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const visibleTargets = options?.skipInsideAstroIslands
    ? targetElements.filter((el) => !skipInsideAstroIslands(el))
    : targetElements;

  visibleTargets.forEach((target) => {
    if (started.has(target)) return;
    started.add(target);

    if (prefersReducedMotion()) {
      gsap.set(target, { opacity: 1, y: 0 });
      return;
    }

    if (selector === "[data-reveal]") playRevealSingle(target);
    else if (selector === "[data-reveal-each]") playRevealEach(target);
    else if (selector === "[data-reveal-once]") playRevealOnce(target);
    else if (selector === "[data-reveal-enter]") playRevealSingleEnterOnly(target);
    else if (selector === "[data-reveal-bottom]") playRevealBottom(target);
  });
}

// About セクションの画像を ScrollTrigger でフェードイン/アウトする
function placeImageInHorizontalSlot(
  layer: HTMLElement,
  el: HTMLElement,
  index: number,
  total: number,
  marginRatio = 0.08,
) {
  const w = layer.clientWidth;
  const h = layer.clientHeight;
  const ew = el.offsetWidth || 200;
  const eh = el.offsetHeight || 280;
  const padX = w * marginRatio;
  const padY = h * marginRatio;
  const innerH = h - padY * 2;
  const slotH = innerH / total;
  const slotTop = padY + index * slotH;
  const minX = padX;
  let maxX = Math.max(minX, w - ew - padX);
  if (maxX <= minX) {
    const effectiveW = Math.min(ew, w * 0.38);
    maxX = Math.max(minX, w - effectiveW - padX);
  }
  const x = maxX > minX ? minX + Math.random() * (maxX - minX) : minX;
  const minY = slotTop;
  const maxY = Math.max(minY, slotTop + slotH - eh);
  const y = minY + (maxY > minY ? Math.random() * (maxY - minY) : 0);
  gsap.set(el, {
    position: "absolute",
    left: x,
    top: y,
    margin: 0,
    opacity: 0,
    y: 12,
    scale: 0.96,
  });
}

export function initImageReveal(): void {
  const root = document.querySelector<HTMLElement>("[data-about-root]");
  if (!root) return;
  const images = root.querySelectorAll<HTMLElement>("[data-about-images]");
  if (!images.length) return;

  images.forEach((el, i) => placeImageInHorizontalSlot(root, el, i, images.length));
  images.forEach((el, i) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: i === images.length - 1 ? "center center+=250" : "center center",
          toggleActions: "play none none reverse",
        },
      })
      .to(el, { opacity: 1, y: 12, scale: 1, duration: 1, ease: "power2.out" })
      .to(el, { opacity: 0, duration: 1, ease: "power2.in" });
  });

  ScrollTrigger.refresh();
}

// ============================================================
// Pin アニメーション
// ============================================================

// 要素をスクロールに合わせて y+=100vh スライドさせる
export function scrollPinTo(pinEl: HTMLElement, endTriggerEl: HTMLElement | null): void {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  gsap.to(pinEl, {
    y: "+=100vh",
    ease: "none",
    scrollTrigger: {
      trigger: pinEl,
      start: "top top",
      endTrigger: endTriggerEl,
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
}

export function scrollPinFromTo(
  pinEl: HTMLElement,
  endTriggerEl: HTMLElement | null,
): void {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  gsap.fromTo(
    pinEl,
    { y: 0 },
    {
      y: "+=100vh",
      ease: "none",
      scrollTrigger: {
        trigger: pinEl,
        start: "top top",
        endTrigger: endTriggerEl,
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}

export function initScrollPin(): void {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const root = document.querySelector<HTMLElement>("[data-scroll-pin]");
  if (!root) return;
  const next = root.nextElementSibling as HTMLElement | null;
  if (prefersReducedMotion()) return;
  scrollPinFromTo(root, next);
  ScrollTrigger.refresh();
}

// ピン終了位置から次セクションまで y+=100vh でスライドさせる
export function scrollPinFromPin(
  wrapperEls: ReadonlyArray<HTMLElement | null | undefined>,
  endTriggerEl: HTMLElement | null,
  animationEnd: () => string | number,
): void {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const elements = wrapperEls.filter(
    (el): el is HTMLElement => el !== null && el !== undefined,
  );
  if (elements.length === 0) return;
  gsap.to(elements, {
    y: "+=100vh",
    ease: "none",
    scrollTrigger: {
      trigger: elements[0]!,
      start: animationEnd,
      endTrigger: endTriggerEl,
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
}

// ============================================================
// ヒーローアニメーション
// ============================================================

export function animationHeroIntro(): void {
  const root = document.querySelector<HTMLElement>("[data-hero-root]");
  if (!root) return;
  const videoWrap = root.querySelector<HTMLElement>("[data-hero-bg-parallax]");
  const overlay = root.querySelector<HTMLElement>("[data-hero-overlay]");
  const profileWrap = root.querySelector<HTMLElement>("[data-hero-profile-wrap]");
  const content = root.querySelector<HTMLElement>("[data-hero-profile-content]");
  const nameEl = root.querySelector<HTMLElement>("[data-hero-name]");
  const titleEl = root.querySelector<HTMLElement>("[data-hero-title]");
  const next = root.nextElementSibling as HTMLElement | null;

  if (!overlay || !profileWrap || !nameEl || !titleEl) return;

  const isTouchDevice = navigator.maxTouchPoints > 0;

  if (prefersReducedMotion()) {
    gsap.set([profileWrap, nameEl, titleEl], { opacity: 1 });
    return;
  }

  if (isTouchDevice) {
    const tl = gsap.timeline();
    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" });
    if (content) tl.fromTo(content, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<");
    tl.fromTo(profileWrap, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<");
    tl.fromTo(
      [nameEl, titleEl],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      "+=0.08",
    );
  } else {
    gsap.set([overlay, profileWrap, nameEl, titleEl], { opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(overlay, { opacity: 1, duration: 1 });
    tl.to(profileWrap, { opacity: 1, duration: 0.8 }, "-=0.5");
    tl.to([nameEl, titleEl], { opacity: 1, duration: 0.45 }, "+=0.08");

    const introSt = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "+=1000",
      pin: true,
      scrub: 1,
      animation: tl,
      invalidateOnRefresh: true,
    });

    scrollPinFromPin([videoWrap], next, () => introSt.end);
  }

  ScrollTrigger.refresh();
}

// ============================================================
// Works トップアニメーション
// ============================================================

function getMaxScrollLeft(el: HTMLElement): number {
  return Math.max(0, el.scrollWidth - el.clientWidth);
}

export function runWorksTopAnimation(): void {
  const root = document.querySelector<HTMLElement>("[data-works-top-root]");
  if (!root) return;
  const cardSlider = root.querySelector<HTMLElement>("[data-card-slider]");
  const titleBlock = root.querySelector<HTMLElement>("[data-works-top-title]");
  const hint = root.querySelector<HTMLElement>("[data-works-top-hint]");
  const cta = root.querySelector<HTMLElement>("[data-works-cta]");

  if (window.matchMedia("(pointer: coarse)").matches) {
    [titleBlock, hint, cardSlider, cta].forEach((el) => {
      if (el) playRevealSingle(el);
    });
    return;
  }

  const bgWrapper = root.querySelector<HTMLElement>("[data-background-wrapper]");
  const overlay = root.querySelector<HTMLElement>("[data-animation-overlay]");
  const next = root.nextElementSibling as HTMLElement;

  if (!cardSlider || !bgWrapper || !next) return;
  if (prefersReducedMotion()) {
    gsap.set([titleBlock, hint, cta, cardSlider].filter(Boolean), { opacity: 1 });
    return;
  }

  const scroller = cardSlider.querySelector<HTMLElement>(".works-card-slider-scroll");
  if (!scroller) return;

  gsap.set([titleBlock, overlay, hint, cardSlider, cta].filter(Boolean), { opacity: 0 });

  const headingTl = gsap.timeline({ paused: true });
  if (overlay)
    headingTl.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" },
    );
  if (titleBlock)
    headingTl.fromTo(
      titleBlock,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" },
      "<",
    );
  if (hint)
    headingTl.fromTo(
      hint,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" },
      "<",
    );

  ScrollTrigger.create({
    trigger: root,
    start: "top -2%",
    end: "+=50",
    animation: headingTl,
    scrub: true,
    toggleActions: "play none none reverse",
  });

  const cardTl = gsap.timeline({ paused: true });
  cardTl.to(cardSlider, { opacity: 1, duration: 1, ease: "power2.out" }, 0);
  cardTl.to(
    scroller,
    { scrollLeft: () => getMaxScrollLeft(scroller), duration: 7, ease: "none" },
    0,
  );
  cardTl.to(cta, { opacity: 1, duration: 1, ease: "power2.out" }, 0);
  cardTl.to({}, { duration: 2 });

  const worksSt = ScrollTrigger.create({
    trigger: root,
    start: "bottom bottom",
    end: "+=1200",
    pin: root,
    scrub: 1,
    animation: cardTl,
    invalidateOnRefresh: true,
  });

  scrollPinFromPin(
    [bgWrapper, cardSlider, titleBlock, cta, hint],
    next,
    () => worksSt.end,
  );
}

// ============================================================
// エントランス（ランダム画像配置）
// ============================================================

function attachTooltipOnHover(hoverEls: HTMLElement[], tip: HTMLElement): void {
  if (hoverEls.length === 0 || !tip) return;
  window.addEventListener("pointermove", (e) => {
    tip.style.left = `${e.clientX + 25}px`;
    tip.style.top = `${e.clientY + 25}px`;
  });
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      tip.style.opacity = "1";
    });
    el.addEventListener("mouseleave", () => {
      tip.style.opacity = "0";
    });
  });
}

function placeImageAtRandomPosition(
  layer: HTMLElement,
  el: HTMLElement,
  marginRatio = 0.05,
) {
  const w = layer.clientWidth;
  const h = layer.clientHeight;
  const ew = el.offsetWidth || 220;
  const eh = el.offsetHeight || 160;
  const padX = w * marginRatio;
  const padY = h * marginRatio;
  const x = padX + Math.random() * Math.max(0, w - ew - padX * 2);
  const y = padY + Math.random() * Math.max(0, h - eh - padY * 2);
  const rotation = (Math.random() - 0.5) * 30;
  gsap.set(el, { position: "absolute", left: x, top: y, rotation });
}

function createDraggable(draggableEls: HTMLElement[], boundsEl: HTMLElement) {
  Draggable.create(draggableEls, {
    type: "x,y",
    edgeResistance: 0.65,
    bounds: boundsEl,
    inertia: true,
  });
}

export default function randomImagesOnScreen(): void {
  const root = document.querySelector<HTMLElement>("[data-entrance-root]");
  if (!root) return;
  const films = document.querySelectorAll<HTMLElement>("[data-entrance-film]");
  const tooltip = document.querySelector<HTMLElement>("[data-entrance-tooltip]");
  const title = document.querySelector<HTMLElement>("[data-entrance-title]");
  const gridLines = {
    v1: document.querySelector<HTMLElement>("[data-entrance-grid-v1]"),
    v2: document.querySelector<HTMLElement>("[data-entrance-grid-v2]"),
    h1: document.querySelector<HTMLElement>("[data-entrance-grid-h1]"),
    h2: document.querySelector<HTMLElement>("[data-entrance-grid-h2]"),
  };

  if (films.length === 0 || !tooltip) return;

  gsap.set(Object.values(gridLines), { opacity: 1 });
  gsap.set(root, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });

  const tl = gsap.timeline();
  tl.fromTo(
    gridLines.v1,
    { clipPath: "inset(0% 0% 100% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" },
  )
    .fromTo(
      gridLines.v2,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" },
      "<",
    )
    .fromTo(
      gridLines.h1,
      { clipPath: "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" },
      "-=0.4",
    )
    .fromTo(
      gridLines.h2,
      { clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" },
      "<",
    )
    .fromTo(
      title,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    )
    .fromTo(
      films,
      { opacity: 0, filter: "grayscale(100%)" },
      { opacity: 1, filter: "grayscale(0%)", duration: 0.8, ease: "power2.inOut" },
    );

  const isTouchDevice = navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    tl.to({}, { duration: 0.2 }).to(root, {
      clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      ease: "power2.inOut",
      duration: 0.2,
      onComplete() {
        gsap.set(root, { display: "none" });
        animationHeroIntro();
      },
    });
  } else {
    gsap.fromTo(
      root,
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=300",
          scrub: true,
          invalidateOnRefresh: true,
          onLeave() {
            gsap.set(root, { display: "none" });
          },
          onEnterBack() {
            gsap.set(root, { display: "block" });
          },
        },
      },
    );
  }

  films.forEach((film) => placeImageAtRandomPosition(root, film, 0.05));
  createDraggable(Array.from(films), root);
  attachTooltipOnHover(Array.from(films), tooltip);
}

// ============================================================
// 副作用初期化（モジュール読み込み時に実行）
// ============================================================

whenDomReady(initImageReveal);
whenDomReady(initScrollPin);
whenDomReady(randomImagesOnScreen);
