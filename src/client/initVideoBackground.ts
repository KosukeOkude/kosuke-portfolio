const videos = Array.from(
  document.querySelectorAll<HTMLVideoElement>("video[data-video-bg]"),
);
const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

// Microsoft Edge を UA で判定（Edg/ は Edge 固有のトークン）
const isEdge = /Edg\//.test(navigator.userAgent);

function applyVideoState(): void {
  for (const v of videos) {
    if (!v) continue;
    if (mq.matches || isEdge) {
      try { v.pause(); } catch (_) { /* ignore */ }
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
      try { v.play(); } catch (_) { /* autoplay blocked は無視 */ }
    }
  }
}

mq.addEventListener("change", applyVideoState);
applyVideoState();
