// Preferences: Open Keyboard Shortcuts




import { type RefObject, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/gsap/core/setup";

/**
 * 横スクロールコンテナを GSAP ScrollTrigger の scrub アニメーションに接続するフック。
 *
 * - `scrollerRef` が attach された div の `scrollLeft` を、縦スクロール量に連動させる。
 * - `triggerSelector` の要素が画面中央に来たタイミングで pin が始まり、
 *   `maxScrollLeft` px 分だけ縦にスクロールしながら横スクロールが進む。
 * - `resetKey` が変わるたびに ST を破棄・再生成する（カテゴリー／ソート変更後の
 *   アイテム数変化に対応するため）。
 * - `pinSt` は lenis.scrollTo でカテゴリー変更後に pin 先頭へ戻す際に使用。
 * - `maxScrollLeft` は Lightbox を閉じた位置へ水平スクロールを復元する際に使用。
 */
export function useHorizontalScrollTrigger(
  scrollerRef: RefObject<HTMLDivElement | null>,
  resetKey: string,
  triggerSelector: string,
  pinSelector: string,
) {
  // 生成した ScrollTrigger インスタンスを保持（lenis.scrollTo の基準座標に使う）
  const stRef = useRef<ScrollTrigger>(null);

  // 横スクロール可能な最大幅を保持（Lightbox 閉じ後の位置復元に使う）
  const maxScrollLeftRef = useRef(0);

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(pinSelector);
    const cardSlider = document.querySelector<HTMLElement>(triggerSelector);
    const scroller = scrollerRef.current;

    if (!root || !scroller) return;

    // resetKey が変わったら古い ST を破棄してスクロール位置をリセット
    stRef.current?.kill();
    stRef.current = null;
    scroller.scrollLeft = 0;

    const buildST = () => {
      // スクロール可能幅を計算（0 以下 = アイテムが少なく横スクロール不要）
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      if (maxScrollLeft <= 0) return false;

      stRef.current?.kill();
      maxScrollLeftRef.current = maxScrollLeft;

      // 縦スクロール量を scrollLeft に変換するアニメーション
      const tl = gsap.timeline();
      tl.to(scroller, {
        // 関数にすることでリサイズ時に最新値を再計算する
        scrollLeft: () => scroller.scrollWidth - scroller.clientWidth,
        ease: "none",
        duration: 1,
      });

      stRef.current = ScrollTrigger.create({
        trigger: cardSlider,
        start: "bottom bottom-=50",   // トリガー要素が画面中央に来たら PIN 開始
        end: () => `+=${scroller.scrollWidth - scroller.clientWidth}`,  // maxScrollLeft 分だけ縦にスクロール
        pin: root,                // PIN する要素（ページ全体のラッパー）
        scrub: true,              // 縦スクロールに滑らかに追従
        animation: tl,
        invalidateOnRefresh: true,
        onRefresh() {
          // リサイズ後に maxScrollLeftRef を最新値へ更新
          maxScrollLeftRef.current = scroller.scrollWidth - scroller.clientWidth;
        },
      });

      ScrollTrigger.refresh();
      return true;
    };

    // 初回試行：画像ロード済みなら即 ST 生成
    if (!buildST()) {
      // scrollWidth がまだ確定していない場合（画像未ロード）は
      // ResizeObserver で幅が増えたタイミングに再試行する
      const resizeObserver = new ResizeObserver(() => {
        // ST 生成成功したら監視を止める（以後のリサイズは ST 内部で処理）
        if (buildST()) resizeObserver.disconnect();
      });
      const contentDiv = scroller.firstElementChild;
      resizeObserver.observe(contentDiv ?? scroller);

      return () => {
        resizeObserver.disconnect();
        stRef.current?.kill();
        stRef.current = null;
      };
    }

    return () => {
      stRef.current?.kill();
      stRef.current = null;
    };
  }, [resetKey]);

  return { maxScrollLeft: maxScrollLeftRef, pinSt: stRef };
}
