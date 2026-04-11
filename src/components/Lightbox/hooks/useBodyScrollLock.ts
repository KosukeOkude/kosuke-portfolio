import { useEffect } from "react";

/**
 * モーダル表示中はスクロールを止め、閉じたら元に戻す。
 *
 * body.style.overflow = 'hidden' だけだと lenis の内部 Y 座標が
 * pin 開始位置へリセットされる場合がある。
 * lenis.stop() / lenis.start() を併用することで lenis の
 * 内部状態（スクロール位置）を維持したままスクロールを停止する。
 */
export function useBodyScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    import("@/client/initLenis").then(({ lenis }) => lenis?.stop());
    document.body.style.overflow = "hidden";
    return () => {
      import("@/client/initLenis").then(({ lenis }) => lenis?.start());
      document.body.style.overflow = "";
    };
  }, [lock]);
}
