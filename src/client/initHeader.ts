export function initHeaderScrollHide(): void {
  const header = document.getElementById("header");
  if (!header) return;

  let lastScrollY = window.scrollY;
  //後述の ticking フラグ用。スクロールイベントを毎回処理しすぎないためのスイッチ
  let ticking = false;

  //直前の位置との差が 6px より大きいと、「下にスクロールした」「上にスクロールした」とみなします。
  const DIRECTION_THRESHOLD_PX = 3;
  //window.scrollY が 32px 未満のときは、向きに関係なく ヘッダーを常に表示（隠さない）想定の値です。
  const ALWAYS_SHOW_BELOW_SCROLL_Y = 8;

  function onScroll(): void {
    if (!header) return;
    const menuOpen = document
      .getElementById("hamburger-wrapper")
      ?.classList.contains("isOpen");
    //
    if (menuOpen) {
      header.classList.remove("header-is-hidden");
      lastScrollY = window.scrollY;
      ticking = false;
      return;
    }

    const y = window.scrollY;
    const delta = y - lastScrollY;

    if (y < ALWAYS_SHOW_BELOW_SCROLL_Y) {
      header.classList.remove("header-is-hidden");
    } else if (delta > DIRECTION_THRESHOLD_PX) {
      header.classList.add("header-is-hidden");
    } else if (delta < -DIRECTION_THRESHOLD_PX) {
      header.classList.remove("header-is-hidden");
    }

    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
}

initHeaderScrollHide();