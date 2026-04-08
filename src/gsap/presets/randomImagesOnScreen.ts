import { whenDomReady } from "@/gsap/core/whenDomReady";
import { gsap, Draggable } from "@/gsap/core/setup";

/**
 * 指定したlayer（親要素）の中で、画像要素(el)をスロット制約なしに
 * 画面全体のランダムな位置へ配置します。
 * marginRatio分の余白を除いた範囲内で、X・Y ともに独立してランダム決定します。
 *
 * @param layer 画像を配置する親要素
 * @param el 対象となる画像要素
 * @param marginRatio 親要素に対する余白の割合（デフォルト0.05）
 */

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

  // 余白(px)を計算
  const padX = w * marginRatio;
  const padY = h * marginRatio;

  // 要素の左上(x, y)が padX, padY 以上となり、右下が親要素からはみ出さない最大値までの範囲内でランダム配置する

  const x = padX + Math.random() * Math.max(0, w - ew - padX * 2);
  const y = padY + Math.random() * Math.max(0, h - eh - padY * 2);

  const rotation = (Math.random() - 0.5) * 30;

  gsap.set(el, {
    position: "absolute",
    left: x,
    top: y,
    rotation,
  });
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
  const tooltip = document.querySelector<HTMLElement>(
    "[data-entrance-tooltip]",
  );
  const title = document.querySelector<HTMLElement>("[data-entrance-title]");

  const gridLines = {
    v1: document.querySelector<HTMLElement>("[data-entrance-grid-v1]"),
    v2: document.querySelector<HTMLElement>("[data-entrance-grid-v2]"),
    h1: document.querySelector<HTMLElement>("[data-entrance-grid-h1]"),
    h2: document.querySelector<HTMLElement>("[data-entrance-grid-h2]"),
  };

  if (films.length === 0 || !tooltip) return;

  gsap.set(Object.values(gridLines), {
    opacity: 1,
  });

  const tl = gsap.timeline();

  tl.fromTo(
    gridLines.v1,
    { clipPath: "inset(0% 0% 100% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" },
  )
    .fromTo(
      gridLines.v2,
      { clipPath: "inset(100% 0% 0% 0%)" }, // 下から上へ
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" },
      "<", // v1と同時
    )
    .fromTo(
      gridLines.h1,
      { clipPath: "inset(0% 100% 0% 0%)" }, // 左から右へ
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" },
      "-=0.4",
    )
    .fromTo(
      gridLines.h2,
      { clipPath: "inset(0% 0% 0% 100%)" }, // 右から左へ
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" },
      "<", // h1と同時
    )
    .fromTo(
      title,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    )
    .fromTo(
      films,
      { opacity: 0, filter: "grayscale(100%)" },
      {
        opacity: 1,
        filter: "grayscale(0%)",
        duration: 0.8,
        ease: "power2.inOut",
      },
    );

  gsap.fromTo(
    root,
    { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
    {
      clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "+=600",
        scrub: true,
      },
    },
  );

  films.forEach((film) => {
    placeImageAtRandomPosition(root, film, 0.05);
  });
  createDraggable(Array.from(films), root);
  attachTooltipOnHover(Array.from(films), tooltip);
}

whenDomReady(randomImagesOnScreen);
