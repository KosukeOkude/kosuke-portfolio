import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ScrollTrigger } from "@/gsap/core";
import gsap from "gsap";

// --- ビデオ背景 ---

const videos = Array.from(
  document.querySelectorAll<HTMLVideoElement>("video[data-video-bg]"),
);
const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
// Microsoft Edge を UA で判定（Edg/ は Edge 固有のトークン）
const isEdge = /Edg\//.test(navigator.userAgent);

// モーション設定・Edge 判定に応じてビデオの再生/停止を切り替える
function applyVideoState(): void {
  for (const v of videos) {
    if (!v) continue;
    if (mq.matches || isEdge) {
      try {
        v.pause();
      } catch {
        /* ignore */
      }
      if (isEdge) {
        v.style.display = "none";
        const poster = v.getAttribute("poster");
        if (poster) {
          let posterEl = v.parentElement?.querySelector<HTMLDivElement>(
            "[data-video-poster-fallback]",
          );
          if (!posterEl) {
            posterEl = document.createElement("div");
            posterEl.setAttribute("data-video-poster-fallback", "");
            posterEl.style.cssText =
              "position:absolute;inset:0;background-size:cover;background-position:center;";
            v.parentElement?.appendChild(posterEl);
          }
          posterEl.style.backgroundImage = `url(${poster})`;
        }
      }
    } else {
      try {
        v.play();
      } catch {
        /* autoplay blocked は無視 */
      }
    }
  }
}

// --- スクロール ---

// ScrollTrigger の次の refresh 完了後にコールバックを実行する
export function waitForScrollTriggerRefresh(callback: () => void): void {
  ScrollTrigger.addEventListener("refresh", function onRefresh() {
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    callback();
  });
}

// ページロード時に URL ハッシュが存在する場合、ST refresh 後に lenis でスクロールする
export function scrollToHashOnLoad(): void {
  const hash = window.location.hash;
  if (!hash) return;
  const lenisInstance = lenis;
  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement) || !lenisInstance) return;

  waitForScrollTriggerRefresh(() => {
    lenisInstance.scrollTo(target);
  });
}

// アンカークリック時に lenis でスムーズスクロールする
export function initHashScroll(): void {
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    const anchor = e.target.closest<HTMLAnchorElement>("a[href*='#']");
    if (!anchor) return;

    const url = new URL(anchor.href);

    if (url.pathname !== window.location.pathname) return;
    const target = document.querySelector(url.hash);
    if (!(target instanceof HTMLElement) || !lenis) return;
    e.preventDefault();
    lenis.scrollTo(target);
  });
}

// --- Lenis ---

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// タッチデバイス（モバイル）かどうかを判定する
function isTouchDevice(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

// デスクトップのみ Lenis を初期化し ScrollTrigger と連携する
export let lenis: Lenis | null = null;
export function initLenisWithScrollTrigger(): void {
  if (prefersReducedMotion()) return;
  if (isTouchDevice()) {
    return;
  }
  lenis = new Lenis({
    autoRaf: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    if (!lenis) return;
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// --- ヘッダー ---

// スクロール方向に応じてヘッダーの表示・非表示を切り替える
export function initHeaderScrollHide(): void {
  const header = document.getElementById("header");
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const DIRECTION_THRESHOLD_PX = 3;
  const ALWAYS_SHOW_BELOW_SCROLL_Y = 8;

  function onScroll(): void {
    if (!header) return;
    const menuOpen = document
      .getElementById("hamburger-wrapper")
      ?.classList.contains("isOpen");
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

// --- ハンバーガーメニュー ---

// ハンバーガーメニューの開閉・ARIA・スクロールロックを初期化する
export function initHamburgerMenu(): void {
  const wrapper = document.getElementById("hamburger-wrapper");
  const btn = document.getElementById("hamburger-button");
  const panel = document.getElementById("hamburger-panel");
  const backdrop = document.getElementById("hamburger-backdrop");
  const openIcon = document.getElementById("hamburger-icon-open");
  const closeIcon = document.getElementById("hamburger-icon-close");

  const setOpen = (open: boolean) => {
    if (!wrapper || !btn || !panel) return;

    wrapper.classList.toggle("isOpen", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");

    if (!open) {
      btn.focus();
    }

    panel.setAttribute("aria-hidden", open ? "false" : "true");

    if (openIcon && closeIcon) {
      openIcon.classList.toggle("!hidden", open);
      closeIcon.classList.toggle("!hidden", !open);
    }

    document.body.style.overflow = open ? "hidden" : "";
  };

  btn?.addEventListener("click", () => {
    const next = !wrapper?.classList.contains("isOpen");
    setOpen(next);
  });

  backdrop?.addEventListener("click", () => {
    setOpen(false);
  });

  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Escape" && wrapper?.classList.contains("isOpen")) {
      setOpen(false);
    }
  });

  panel?.querySelectorAll(".hamburger-menu__link").forEach((linkEl) => {
    linkEl.addEventListener("click", () => {
      setOpen(false);
    });
  });
}

// --- 初期化 ---

// 画像の右クリックを無効化
document.addEventListener("contextmenu", (e) => {
  if (e.target instanceof HTMLImageElement) e.preventDefault();
});
mq.addEventListener("change", applyVideoState);
applyVideoState();
scrollToHashOnLoad();
initLenisWithScrollTrigger();
initHeaderScrollHide();
initHamburgerMenu();
initHashScroll();
