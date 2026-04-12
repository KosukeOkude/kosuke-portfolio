import "@/client/initLenis";
import "@/client/initVideoBackground";
// import "@/client/initDecorCursor";
import "@/client/initHeader";
import "@/client/initHamburgerMenu";
import "@/client/initScrollToHashOnLoad";

// 画像の右クリックを無効化
document.addEventListener("contextmenu", (e) => {
  if (e.target instanceof HTMLImageElement) e.preventDefault();
});
