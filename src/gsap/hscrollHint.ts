// 横スクロールを手動で試みたときに縦スクロールを促すトーストを表示する
export function showHScrollHint(): void {
  const TOAST_ID = "hscroll-hint-toast";
  const SHOW_MS = 2000;
  const FADE_MS = 300;

  let toast = document.getElementById(TOAST_ID) as HTMLDivElement | null;

  if (toast) {
    clearTimeout(Number(toast.dataset.timerId ?? "0"));
    toast.style.opacity = "1";
  } else {
    toast = document.createElement("div");
    toast.id = TOAST_ID;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "2rem",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "rgba(0,0,0,0.78)",
      color: "white",
      padding: "0.45rem 1.4rem",
      borderRadius: "9999px",
      fontSize: "0.7rem",
      letterSpacing: "0.15em",
      zIndex: "99999",
      pointerEvents: "none",
      transition: `opacity ${FADE_MS}ms ease`,
      opacity: "1",
      whiteSpace: "nowrap",
    });
    toast.textContent = "↓ 縦スクロールで閲覧できます";
    document.body.appendChild(toast);
  }

  const timerId = window.setTimeout(() => {
    const el = document.getElementById(TOAST_ID);
    if (!el) return;
    el.style.opacity = "0";
    window.setTimeout(() => el.remove(), FADE_MS);
  }, SHOW_MS);

  toast.dataset.timerId = String(timerId);
}
