import { gsap } from "@/gsap/core/setup";

/**
 * 指定した要素群(wrapperEls)に対して、ピン固定が終わった直後から「Y方向に+100vh」移動させるGSAPアニメーションを設定するユーティリティ関数。
 *
 * - 先にピン留め（ScrollTriggerで要素を固定）が終わった「終了位置（animationEnd）」から、
 * - endTriggerEl（例:次のセクションなど）の"top top"までのスクロール範囲で
 * - 指定要素群にトランスフォーム(y: +100vh)アニメーションをかける。
 * - scrub:true なのでスクロール連動で滑らかに動く。
 *
 * @param wrapperEls      アニメーション・トランスフォーム対象となる要素配列
 * @param endTriggerEl    アニメーション終了となるトリガー要素（例:次セクションのルート要素）
 * @param animationEnd    ScrollTrigger.start の位置（通常、直前のピン終了位置。関数で指定することで可変対応）
 */
export function scrollPinFromPin(
  wrapperEls: ReadonlyArray<HTMLElement | null | undefined>,
  endTriggerEl: HTMLElement | null,
  animationEnd: () => string | number,
): void {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  // null/undefinedを除外して有効なHTMLElementだけ抽出
  const elements = wrapperEls.filter(
    (el): el is HTMLElement => el !== null && el !== undefined,
  );

  if (elements.length === 0) return; // 対象がなければ何もしない

  gsap.to(elements, {
    y: "+=100vh", // ＋100vhぶんY方向に移動
    ease: "none",
    scrollTrigger: {
      trigger: elements[0]!, // 1つめの要素をトリガーにする
      start: animationEnd, // ピン終了位置から
      endTrigger: endTriggerEl, // 次のセクション等を終了トリガーに
      end: "top top", // 終了位置: endTriggerElのtopがviewportトップに来るまで
      scrub: true, // スクロール連動
      invalidateOnRefresh: true,
    },
  });
}
