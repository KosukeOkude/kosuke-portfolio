import lightboxImageIntro from "@/components/Lightbox/lightboxImageIntro";
import { type RefObject, useLayoutEffect, useRef } from "react";

type useLightboxImageIntroAnimationProps = {
  isOpen: boolean;
  hasContent: boolean;
  /** 開いているあいだに変わると、次／前と同じ入りアニメを掛け直す（例: activeIndex や画像 src） */
  contentKey: string | number;
};

/**
 * ライトボックス内「画像を載せる DOM」（contentRef）に、入りのフェード＋わずかな移動・拡大を付与する。
 *
 * トリガーは次の2つ:
 * - 閉じていた → 開いた（初回表示）
 * - 開いたまま contentKey が変わった（次／前で別スライド）
 *
 * 呼び出し側は ImageLightboxModal のように、Hooks を return null より上で常に実行すること。
 * グローバルな [data-reveal] / runGlobalRevealAnimation とは別系統。
 *
 * @param contentRef アニメ対象の要素（通常は画像を包む div）
 * @param isOpen モーダルが開いているか
 * @param hasContent 表示するアイテムがあるか（false のときは何もしない）
 * @param contentKey スライドの識別子。変わるたびに「入り」を掛け直す（例: activeIndex や画像 URL）
 */
export function useLightboxImageIntroAnimation(
  contentRef: RefObject<HTMLElement | null>,
  { isOpen, hasContent, contentKey }: useLightboxImageIntroAnimationProps,
): void {
  /** 直前のレンダーまで「開いていた」か。閉→開の1回だけ justOpened を true にするための履歴。 */
  const wasOpenRef = useRef(false);
  /** 直前にアニメ対象とみなした contentKey。undefined のあいだは「まだ前スライドを記録していない」状態。 */
  const prevContentKeyRef = useRef<string | number | undefined>(undefined);
  /** 今回のセッション中に何回「入りアニメ」を実行したか。preset 側へ渡す循環カウンタ。 */
  const cycleRef = useRef(0);

  useLayoutEffect(() => {
    // 閉じている／中身がない: 履歴をリセットし、次に開いたときをまた「初回」として扱えるようにする。
    if (!isOpen || !hasContent) {
      wasOpenRef.current = false;
      prevContentKeyRef.current = undefined;
      return;
    }

    const el = contentRef.current;
    if (!el) return;

    // justOpened: この effect 実行の直前まで wasOpenRef が false → いま開いた直後のフレーム。
    // slideChanged: すでに開いていて、前回記録したキーと今回の contentKey が違う → 次／前など。
    const justOpened = !wasOpenRef.current;
    const previousKey = prevContentKeyRef.current;

    const slideChanged =
      previousKey !== undefined && previousKey !== contentKey;

    const shouldAnimate = justOpened || slideChanged;

    wasOpenRef.current = true;
    // 次の effect / レンダーで slideChanged を判定するため、いまのキーを保存する。
    prevContentKeyRef.current = contentKey;

    if (!shouldAnimate) return;

    // 再生のたびに循環数を進める（例: 1回目だけ少し長く、2回目以降は短くする等に使える）。
    cycleRef.current += 1;
    // GSAP 詳細は preset 関数へ委譲し、このフックは「いつ再生するか」の判定に専念する。
    const handle = lightboxImageIntro({
      el,
      cycle: cycleRef.current,
    });
    // effect の再実行・unmount 時に現在 tween を破棄し、重複再生を防ぐ。
    return () => handle.kill();
  }, [isOpen, hasContent, contentKey, contentRef]);
}
