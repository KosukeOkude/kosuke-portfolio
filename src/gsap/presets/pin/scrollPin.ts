import { gsap, ScrollTrigger, prefersReducedMotion } from "@/gsap/core/setup";
import { whenDomReady } from "@/gsap/core/whenDomReady";

/**
 * scrollPin関数は、指定した[data-scroll-pin]属性を持つ要素を
 * スクロールに合わせて「ピン止め（固定）」しながらゆっくり下にスライドさせる
 * アニメーションを設定します。
 *
 * 実装のポイント:
 * - `root`は[data-scroll-pin]の要素を取得
 * - `next`はrootの直後の兄弟要素（終了トリガーとして使用）
 * - prefers-reduced-motionが有効な場合は何もしない
 * - gsap.fromToでスクロールに応じてy方向(縦)に100vh分動かす
 * - ScrollTriggerのスクラブ効果により滑らかに追従
 */

export function scrollPinTo(
  pinEl: HTMLElement,
  endTriggerEl: HTMLElement | null,
): void {
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
  const root = document.querySelector<HTMLElement>("[data-scroll-pin]");
  if (!root) return;
  const next = root.nextElementSibling as HTMLElement | null;

  // OSの設定で「モーション軽減」が有効な場合はアニメーション無効
  if (prefersReducedMotion()) return;

  scrollPinFromTo(root, next);

  // ScrollTriggerでレイアウトを再計算
  ScrollTrigger.refresh();
}

// DOMが準備できたタイミングでscrollPin()を実行
whenDomReady(initScrollPin);
