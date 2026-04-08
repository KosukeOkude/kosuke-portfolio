/** モバイル用ハンバーガーメニュー（開閉・ARIA・スクロールロック）を初期化する */
export function initHamburgerMenu(): void {
  const wrapper = document.getElementById("hamburger-wrapper");
  const btn = document.getElementById("hamburger-button");
  const panel = document.getElementById("hamburger-panel");
  const backdrop = document.getElementById("hamburger-backdrop");
  const openIcon = document.getElementById("hamburger-icon-open");
  const closeIcon = document.getElementById("hamburger-icon-close");

  const setOpen = (open: boolean) => {
    if (!wrapper || !btn || !panel) return;

    // 見た目（CSS の .isOpen と連動）
    wrapper.classList.toggle("isOpen", open);

    // 開閉ボタンの状態を支援技術向けに同期
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      open ? "メニューを閉じる" : "メニューを開く",
    );

    // 閉じるときはフォーカスをパネル外へ先に移す。
    // aria-hidden=true の祖先の内側にフォーカスが残るとブラウザが警告し、ARIA 仕様にも反する。
    if (!open) {
      btn.focus();
    }

    panel.setAttribute("aria-hidden", open ? "false" : "true");

    if (openIcon && closeIcon) {
      openIcon.classList.toggle("!hidden", open);
      closeIcon.classList.toggle("!hidden", !open);
    }

    // メニュー表示中は背面のスクロールを止める
    document.body.style.overflow = open ? "hidden" : "";
  };

  // トリガーで開閉トグル
  btn?.addEventListener("click", () => {
    const next = !wrapper?.classList.contains("isOpen");
    setOpen(next);
  });

  // オーバーレイクリックで閉じる（setOpen 内でフォーカスをボタンへ戻す）
  backdrop?.addEventListener("click", () => {
    setOpen(false);
  });

  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Escape" && wrapper?.classList.contains("isOpen")) {
      setOpen(false);
    }
  });

  // ナビリンク遷移前に閉じる（同一ページ内アンカーでもメニューを畳む）
  panel?.querySelectorAll(".hamburger-menu__link").forEach((linkEl) => {
    linkEl.addEventListener("click", () => {
      setOpen(false);
    });
  });
}

initHamburgerMenu();