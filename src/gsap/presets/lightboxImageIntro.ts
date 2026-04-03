import { gsap, prefersReducedMotion } from "@/gsap/core/setup";

export type lightboxIntroParams = {
  el: HTMLElement;
  cycle: number; // 何回目の表示か（1,2,3...）
};

export type lightboxIntroHandle = {
  /** 呼び出し元（hook）から tween を明示停止するためのハンドル。 */
  kill: () => void;
};

/**
 * Lightbox 画像エリア専用の「入り」アニメ preset。
 * DOM と cycle だけ受け取り、React 状態には依存しない純関数として切り出す。
 */
export default function lightboxImageIntro({
  el,
  cycle,
}: lightboxIntroParams): lightboxIntroHandle {
  // 常に前回の同要素 tween を止める
  gsap.killTweensOf(el);

  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    return { kill: () => gsap.killTweensOf(el) };
  }

  // cycle を使って、初回と2回目以降でテンポを変えられるようにしている。
  const duration = cycle === 1 ? 0.42 : 0.34;

  gsap.fromTo(
    el,
    { opacity: 0, y: 12, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      ease: "power2.out",
    },
  );

  // 呼び出し元から同一要素 tween を止められるように kill ハンドルを返す。
  return { kill: () => gsap.killTweensOf(el) };
}
