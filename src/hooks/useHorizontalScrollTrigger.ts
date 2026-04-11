import { type RefObject, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/gsap/core/setup";

/**
 * 横スクロールコンテナを GSAP ScrollTrigger の scrub アニメーションに接続するフック。
 *
 * ## 全体の仕組み
 * `scrollerRef` が指す div の `scrollLeft` を、縦スクロール量に連動させる。
 * ユーザーが縦にスクロールするほど画像が横に流れ、ページ自体は pin されて動かない。
 *
 * ## resetKey
 * カテゴリー／ソート変更時に `resetKey` が変わり、この useLayoutEffect が再実行される。
 * 古い ScrollTrigger を kill して新しい枚数に合わせた ST を再生成する。
 *
 * ## fromTo が必要な理由（to ではダメな理由）
 * `tl.to()` だと `invalidateOnRefresh` が走ったとき「現在の scrollLeft」をスタート値として
 * 再記録する。モーダルを閉じると body.overflow が戻ってスクロールバーが復活し、
 * viewport 幅が変わるため GSAP が内部で refresh を呼ぶ。
 * このとき scrollLeft が maxScrollLeft のままだと start=max, end=max になり
 * スクラブが一切効かなくなる（画像が最後の1枚しか表示されない）。
 * `fromTo` でスタートを 0 に固定することでこの問題を防いでいる。
 *
 * ## end / scrollLeft を関数にする理由
 * 文字列・数値で渡すと ST 生成時点の値で固定される。
 * 関数にすることで `invalidateOnRefresh` や `ScrollTrigger.refresh()` のたびに
 * 最新の scrollWidth を使って再計算される。
 *
 * ## 画像ロード後の ST 更新（setUpImageLoadRefresh）
 * `w-auto` の画像は HTTP レスポンスが来るまで幅が 0 のため、
 * useLayoutEffect 実行時点では scrollWidth が小さい。
 * そのまま ST を生成すると end が短すぎてスクロール量が少なくなる。
 * 各 <img> の `load` イベントを拾って毎回 `ScrollTrigger.refresh()` を呼び、
 * end / maxScrollLeft を正しい値に更新する。
 * `{ once: true }` なのでリスナーは1枚につき1回しか発火しない。
 *
 * ResizeObserver ではなく load イベントにしている理由:
 * ResizeObserver はブラウザ実装によって `w-auto` 画像のロードを検知しない場合があり、
 * またモーダル開閉時の body.overflow 変化（~15px の clientWidth 変動）にも反応してしまい
 * lenis の座標と ST の座標がズレる副作用があった。
 *
 * ## retryObserver が必要な理由
 * 0枚カテゴリー（例: 「ブラック&ホワイト」）から「All」に切り替えると、
 * 切り替え直後は DOM がまだ空で scrollWidth <= clientWidth のため buildST() が false を返す。
 * その場合、コンテンツ div を ResizeObserver で監視して「幅が出てきたら buildST() を再試行」する。
 * 成功した時点で retryObserver を disconnect し、以降は setUpImageLoadRefresh に引き渡す。
 */
export function useHorizontalScrollTrigger(
  scrollerRef: RefObject<HTMLDivElement | null>,
  resetKey: string,
  triggerSelector: string,
  pinSelector: string,
) {
  const stRef = useRef<ScrollTrigger>(null);
  const maxScrollLeftRef = useRef(0);

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(pinSelector);
    const scroller = scrollerRef.current;

    if (!root || !scroller) return;

    // モバイル（タッチデバイス）では横スクロールピンを使わない
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // resetKey 変更時: 既存 ST を破棄してスクロール位置を先頭に戻す
    stRef.current?.kill();
    stRef.current = null;
    scroller.scrollLeft = 0;

    /**
     * ScrollTrigger を生成する。
     * scrollWidth が clientWidth 以下（スクロール不要）の場合は false を返す。
     */
    const buildST = (): boolean => {
      const currentMax = scroller.scrollWidth - scroller.clientWidth;
      if (currentMax <= 0) return false;

      stRef.current?.kill();
      maxScrollLeftRef.current = currentMax;

      const tl = gsap.timeline();
      // fromTo でスタートを 0 に固定する（to() を使ってはいけない理由は上のコメント参照）
      tl.fromTo(
        scroller,
        { scrollLeft: 0 },
        {
          scrollLeft: () => scroller.scrollWidth - scroller.clientWidth,
          ease: "none",
          duration: 1,
        },
      );

      stRef.current = ScrollTrigger.create({
        trigger: root,
        start: "bottom bottom",
        // 関数にすることで refresh のたびに最新の scrollWidth で end を再計算する
        end: () => `+=${scroller.scrollWidth - scroller.clientWidth}`,
        pin: root,
        scrub: true,
        animation: tl,
        invalidateOnRefresh: true,
        onRefresh() {
          // refresh 後に maxScrollLeft を最新値へ同期する。
          // Lightbox の closeAt で lenis.scrollTo の計算に使うため常に最新を保つ必要がある。
          maxScrollLeftRef.current = scroller.scrollWidth - scroller.clientWidth;
        },
      });

      ScrollTrigger.refresh();
      return true;
    };

    // retryObserver / setUpImageLoadRefresh どちらも firstElementChild（画像が並ぶ div）を対象にする
    const observeTarget = scroller.firstElementChild ?? scroller;

    /**
     * ST 生成後に残っている未ロード画像を監視し、
     * 1枚ロードされるたびに ScrollTrigger.refresh() を呼んで end / maxScrollLeft を更新する。
     * 全画像ロード済みなら何もしない（early return で空のクリーンアップを返す）。
     */
    const setUpImageLoadRefresh = () => {
      const imgs = Array.from(scroller.querySelectorAll<HTMLImageElement>("img"));
      const unloaded = imgs.filter((img) => !img.complete);
      if (unloaded.length === 0) return () => {};

      // 1枚ロードされるごとに refresh → end が正しい値に更新される
      const handleLoad = () => ScrollTrigger.refresh();
      unloaded.forEach((img) => img.addEventListener("load", handleLoad, { once: true }));

      // クリーンアップ: resetKey 変更時にリスナーを外す（二重発火を防ぐ）
      return () => {
        unloaded.forEach((img) => img.removeEventListener("load", handleLoad));
      };
    };

    if (!buildST()) {
      // DOM がまだ空（0枚カテゴリーからの切り替え直後など）で scrollWidth が足りない場合。
      // コンテンツ div の幅変化を ResizeObserver で監視し、増えたタイミングで buildST() を再試行する。
      let cleanUpImageLoad = () => {};
      const retryObserver = new ResizeObserver(() => {
        if (buildST()) {
          // ST 生成成功 → retryObserver は不要になるので disconnect し、
          // 以降は画像ロードイベントで ST を refresh し続ける
          retryObserver.disconnect();
          cleanUpImageLoad = setUpImageLoadRefresh();
        }
      });
      retryObserver.observe(observeTarget);

      return () => {
        retryObserver.disconnect();
        cleanUpImageLoad();
        stRef.current?.kill();
        stRef.current = null;
      };
    }

    // buildST() が初回成功した場合も画像ロードで refresh が必要
    const cleanUpImageLoad = setUpImageLoadRefresh();

    return () => {
      cleanUpImageLoad();
      stRef.current?.kill();
      stRef.current = null;
    };
  }, [resetKey]);

  return { maxScrollLeft: maxScrollLeftRef, pinSt: stRef };
}
