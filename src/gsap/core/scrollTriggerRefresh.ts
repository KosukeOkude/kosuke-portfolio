import { ScrollTrigger } from "@/gsap/core/setup";

let registered = false;

/**
 * ウィンドウのリサイズ／向き変更時に ScrollTrigger の計算を更新する。
 * resize は連続で大量に飛ぶため debouncedRefresh で間引き、
 * orientationchange は回転直後にレイアウトが一気に変わるため即時 refresh する。
 */

export function registerScrollTriggerRefreshOnResize(): void {
  if (registered) return;
  registered = true;

  let timeoutId: ReturnType<typeof setTimeout>;
  let lastWidth = window.innerWidth;

  /**
   * Debounced refresh:
   * resize のたびに即 ScrollTrigger.refresh() せず、呼び出しが止まってから 120ms 後に 1 回だけ実行する。
   * 前回の予約は clearTimeout でキャンセルし、常に「最後の発火から 120ms 後」に寄せる。
   *
   * 幅が変わっていない resize はモバイルのアドレスバー表示/非表示によるものなのでスキップする。
   * アドレスバーの出入りで ScrollTrigger.refresh() が走るとピン位置が再計算されてガクガクする。
   */
  const debouncedRefresh = (): void => {
    const currentWidth = window.innerWidth;
    if (currentWidth === lastWidth) return;
    lastWidth = currentWidth;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  };

  window.addEventListener("resize", debouncedRefresh, {
    passive: true,
  });
  window.addEventListener("orientationchange", () => {
    ScrollTrigger.refresh();
  });
}
