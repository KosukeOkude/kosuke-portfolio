import {
  gsap,
  ScrollTrigger,
  Draggable,
  prefersReducedMotion,
  whenDomReady,
  skipInsideAstroIslands,
} from "@/gsap/core";
import { showHScrollHint } from "@/gsap/hscrollHint";
import type { RunGlobalRevealOptions } from "@/types";

// ============================================================
// Reveal アニメーション
// ============================================================

// 子要素を順番にフェードインする
const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;
const revealStart = () => (isTouchDevice() ? "top 75%" : "top 90%");

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
        start: revealStart(),
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
      start: revealStart(),
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
  const layer = root.querySelector<HTMLElement>("main") ?? root;
  const images = root.querySelectorAll<HTMLElement>("[data-about-images]");
  if (!images.length) return;

  images.forEach((el, i) => placeImageInHorizontalSlot(layer, el, i, images.length));
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
  const profileWrap = root.querySelector<HTMLElement>("[data-hero-profile-wrap]");
  const content = root.querySelector<HTMLElement>("[data-hero-profile-content]");
  const nameEl = root.querySelector<HTMLElement>("[data-hero-name]");
  const titleEl = root.querySelector<HTMLElement>("[data-hero-title]");
  const next = root.nextElementSibling as HTMLElement | null;

  if (!profileWrap || !nameEl || !titleEl) return;

  if (prefersReducedMotion()) {
    gsap.set([profileWrap, nameEl, titleEl], { opacity: 1 });
    return;
  }

  const tl = gsap.timeline();
  if (content) tl.fromTo(content, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
  tl.fromTo(profileWrap, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<");
  tl.fromTo(
    [nameEl, titleEl],
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
    "+=0.08",
  );
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

  // ScrollTrigger が存在する間は手動横スクロールをブロックし、縦スクロールを促す
  scroller.style.overflowX = "hidden";
  scroller.addEventListener(
    "wheel",
    (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > 10) {
        e.preventDefault();
        showHScrollHint();
      }
    },
    { passive: false },
  );

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

// タイトル（中央）の周り固定6ポジション（xRatio/yRatio はコンテナに対する割合）
const FIXED_FILM_POSITIONS: Array<{ xRatio: number; yRatio: number; rotation: number }> = [
  { xRatio: 0.07, yRatio: 0.09, rotation: -12 }, // 左上
  { xRatio: 0.63, yRatio: 0.06, rotation:   8 }, // 右上
  { xRatio: 0.03, yRatio: 0.46, rotation:  15 }, // 左中
  { xRatio: 0.80, yRatio: 0.42, rotation: -10 }, // 右中
  { xRatio: 0.14, yRatio: 0.68, rotation:  -7 }, // 左下
  { xRatio: 0.63, yRatio: 0.67, rotation:  11 }, // 右下
];

// スマホ用（左中を上・右中を下に広げる）
const FIXED_FILM_POSITIONS_SP: Array<{ xRatio: number; yRatio: number; rotation: number }> = [
  { xRatio: 0.07, yRatio: 0.09, rotation: -12 }, // 左上
  { xRatio: 0.63, yRatio: 0.06, rotation:   8 }, // 右上
  { xRatio: 0.03, yRatio: 0.30, rotation:  15 }, // 左中（上へ）
  { xRatio: 0.80, yRatio: 0.50, rotation: -10 }, // 右中（下へ）
  { xRatio: 0.14, yRatio: 0.68, rotation:  -7 }, // 左下
  { xRatio: 0.63, yRatio: 0.67, rotation:  11 }, // 右下
];

function placeImageAtFixedPosition(
  layer: HTMLElement,
  el: HTMLElement,
  index: number,
) {
  const positions = window.innerWidth < 768 ? FIXED_FILM_POSITIONS_SP : FIXED_FILM_POSITIONS;
  const pos = positions[index % positions.length];
  const x = layer.clientWidth  * pos.xRatio;
  const y = layer.clientHeight * pos.yRatio;
  gsap.set(el, { position: "absolute", left: x, top: y, rotation: pos.rotation });
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

  const STORAGE_KEY = "entrance_last_shown";
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const lastShown = localStorage.getItem(STORAGE_KEY);
  if (lastShown === today) {
    gsap.set(root, { display: "none" });
    animationHeroIntro();
    return;
  }

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

  localStorage.setItem(STORAGE_KEY, today);
  tl.to({}, { duration: 1.5 }).to(root, {
    clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    ease: "power2.inOut",
    duration: 0.2,
    onComplete() {
      gsap.set(root, { display: "none" });
      animationHeroIntro();
    },
  });

  films.forEach((film, i) => placeImageAtFixedPosition(root, film, i));
  createDraggable(Array.from(films), root);
  attachTooltipOnHover(Array.from(films), tooltip);
}

// ============================================================
// 副作用初期化（モジュール読み込み時に実行）
// ============================================================

whenDomReady(initImageReveal);
whenDomReady(initScrollPin);
whenDomReady(randomImagesOnScreen);
