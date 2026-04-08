import { gsap, ScrollTrigger } from "@/gsap/core/setup";
import { whenDomReady } from "@/gsap/core/whenDomReady";

/**
 * 指定したlayer（親要素）の中で、画像要素(el)を
 * 横幅のマージン（marginRatio分）を空けた上で水平帯状（スロット）にランダム配置します。
 * スロットはtotalで均等に分割され、index番目のスロット内に
 * 画像の位置（left, top）を決定し、初期のアニメーション状態をセットします。
 *
 * @param layer 画像を配置する親要素
 * @param el 対象となる画像要素
 * @param index 配置するスロットのインデックス（0始まり）
 * @param total 分割するスロット数（画像の合計枚数）
 * @param marginRatio 親要素に対する余白の割合（デフォルト0.08）
 */
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

  // 横は帯いっぱいの中でランダム、または中央寄せ
  const minX = padX;
  let maxX = Math.max(minX, w - ew - padX);
  if (maxX <= minX) {
    const effectiveW = Math.min(ew, w * 0.38);
    maxX = Math.max(minX, w - effectiveW - padX);
  }
  const x = maxX > minX ? minX + Math.random() * (maxX - minX) : minX;

  // 縦は「このスロットの中」だけ
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

/**
 * 画像のリビールアニメーションを設定する関数。
 *
 * [data-about-root]で示された要素内の[data-about-images]を全て取得し、
 * 各画像を水平方向にスロット分割して位置調整し、
 * スクロールトリガーによるフェードイン・フェードアウトアニメーションを適用する。
 *
 * ScrollTrigger.refresh()でアニメーション設定後にレイアウト検出を更新する。
 */
export function initImageReveal(): void {
  const root = document.querySelector<HTMLElement>("[data-about-root]");
  if (!root) return;
  const images = root.querySelectorAll<HTMLElement>("[data-about-images]");
  if (!images.length) return;

  images.forEach((el, i) => {
    placeImageInHorizontalSlot(root, el, i, images.length);
  });

  images.forEach((el, i) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start:
            i === images.length - 1 ? "center center+=250" : "center center",
          toggleActions: "play none none reverse",
        },
      })
      .to(el, {
        opacity: 1,
        y: 12,
        scale: 1,
        duration: 1,
        ease: "power2.out",
      })
      .to(el, {
        opacity: 0,
        duration: 1,
        ease: "power2.in",
      });
  });

  ScrollTrigger.refresh();
}

whenDomReady(initImageReveal);
