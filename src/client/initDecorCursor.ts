/**
 * フォロワー型のカスタムカーソル（リング＋ドット）。
 * `<html data-decor-cursor="orbit|bloom|...">` でプリセット切替。`off` または属性なしで無効。
 */

// ---------------------------------------------------------------------------
// プリセット名（CSS の #decor-cursor-root[data-preset="…"] と対応）
// ---------------------------------------------------------------------------

const PRESETS = ["orbit", "bloom", "gem", "bubble", "nova"] as const;
export type DecorCursorPreset = (typeof PRESETS)[number];

/** data-decor-cursor が未知の値のときに使う見た目 */
const DEFAULT_PRESET: DecorCursorPreset = "orbit";

/**
 * ポインタ直下が「インタラクティブ」とみなす要素。
 * elementFromPoint の結果に対して matches / closest で使う（カンマ区切り1本のセレクタ文字列）。
 */
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  '[role="button"]',
  'input[type="submit"]',
  'input[type="button"]',
  "label[for]",
  "select",
  "textarea",
  "[data-cursor-hover]",
].join(", ");

// ---------------------------------------------------------------------------
// 起動条件（init 前のガード）
// ---------------------------------------------------------------------------

/** `<html data-decor-cursor>` が付いていて、かつ "off" でないときだけ true */
function isDecorCursorEnabled(): boolean {
  const v = document.documentElement.getAttribute("data-decor-cursor");
  if (v == null || v === "off") return false;
  return true;
}

/** 属性値が PRESETS に含まれる名前ならそれを返し、それ以外なら DEFAULT_PRESET */
function resolvePreset(): DecorCursorPreset {
  const raw = document.documentElement.getAttribute("data-decor-cursor");
  if (raw && PRESETS.includes(raw as DecorCursorPreset)) {
    return raw as DecorCursorPreset;
  }
  return DEFAULT_PRESET;
}

/** OS の「動きを減らす」が有効ならカーソル演出は使わない */
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** マウス等の fine ポインタのみ（タッチ主体端末では初期化しない） */
function isFinePointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

// ---------------------------------------------------------------------------
// 公開 API
// ---------------------------------------------------------------------------

/**
 * カーソル用 DOM を body に追加し、ポインタ追従とヒット判定のリスナーを登録する。
 * 複数回呼ばない想定（二重初期化はガードなし）。
 */
export function initDecorCursor(): void {
  if (!isDecorCursorEnabled()) return;
  if (prefersReducedMotion()) return;
  if (!isFinePointer()) return;

  const preset = resolvePreset();

  // --- ルート: 装飾全体のラッパー（CSS / is-hidden / is-interactive の付け先） ---
  const root = document.createElement("div");
  root.id = "decor-cursor-root";
  root.setAttribute("aria-hidden", "true");
  root.dataset.preset = preset;

  /**
   * trackLag（ラグ側トラック）: 外側リング用。
   * transform で位置を動かす「入れ物」。中身の .decor-cursor__ring が見た目。
   * LAG 係数でポインタより遅く追従させる。
   */
  const trackLag = document.createElement("div");
  trackLag.className = "decor-cursor__track decor-cursor__track--lag";
  const ring = document.createElement("div");
  ring.className = "decor-cursor__ring";
  trackLag.appendChild(ring);

  /**
   * trackFast（高速側トラック）: 中心ドット用。
   * FAST 係数でポインタに素早く寄せる。リングより手前に動くフォロワー表現。
   */
  const trackFast = document.createElement("div");
  trackFast.className = "decor-cursor__track decor-cursor__track--fast";
  const dot = document.createElement("div");
  dot.className = "decor-cursor__dot";
  trackFast.appendChild(dot);

  root.appendChild(trackLag);
  root.appendChild(trackFast);
  document.body.appendChild(root);

  // mx,my: 実ポインタ座標（pointermove で更新）
  // lx,ly: リングの表示座標（毎フレーム mx,my に LAG で近づける）
  // fx,fy: ドットの表示座標（FAST で近づける）
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let lx = mx;
  let ly = my;
  let fx = mx;
  let fy = my;

  /** リングの追従の強さ（小さいほどヌルッと遅い） */
  const LAG = 0.14;
  /** ドットの追従の強さ（大きいほどポインタに張り付きやすい） */
  const FAST = 0.38;

  /** リンク上等のとき root に is-interactive を付け、CSS でリング形状を変える */
  function setInteractive(on: boolean): void {
    root.classList.toggle("is-interactive", on);
  }

  /**
   * (clientX, clientY) に最前面にある要素が INTERACTIVE_SELECTOR に合うか。
   * 一瞬 root を visibility:hidden にして elementFromPoint が装飾レイヤーを拾わないようにする。
   */
  function hitTest(clientX: number, clientY: number): boolean {
    const prev = root.style.visibility;
    root.style.visibility = "hidden";
    const el = document.elementFromPoint(clientX, clientY);
    root.style.visibility = prev;
    if (!el || root.contains(el)) return false;
    return (
      el.matches(INTERACTIVE_SELECTOR) || !!el.closest(INTERACTIVE_SELECTOR)
    );
  }

  /** イージングで遅れた lx,ly / fx,fy を mx,my に即一致させ、transform も同期 */
  function snapTracksToPointer(): void {
    lx = mx;
    ly = my;
    fx = mx;
    fy = my;
    trackLag.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
    trackFast.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
  }

  /** 非表示を解き、位置をスナップし、インタラクティブ状態を再計算（タブ復帰等） */
  function revealAfterReturn(): void {
    root.classList.remove("is-hidden");
    snapTracksToPointer();
    setInteractive(hitTest(mx, my));
  }

  /** mouseout/over の relatedTarget がまだこの document 内か（外へ出た／外から入った判定用） */
  function isNodeInsideDocument(node: EventTarget | null): node is Node {
    return node instanceof Node && document.documentElement.contains(node);
  }

  let raf = 0;

  /** requestAnimationFrame: 毎フレーム lx,ly と fx,fy を mx,my に近づけて transform 更新 */
  function loop(): void {
    lx += (mx - lx) * LAG;
    ly += (my - ly) * LAG;
    fx += (mx - fx) * FAST;
    fy += (my - fy) * FAST;

    trackLag.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
    trackFast.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;

    raf = requestAnimationFrame(loop);
  }

  //最後のスクロールから 150ms 何もなかったら属性を外す
  const html = document.documentElement;
  let scrollerEndTimer = 0;

  window.addEventListener("scroll", () => {
    if (!html.hasAttribute("data-decor-cursor-scrolling")) {
      html.setAttribute("data-decor-cursor-scrolling", "");
    }
    window.clearTimeout(scrollerEndTimer);
    scrollerEndTimer = window.setTimeout(() => {
      html.removeAttribute("data-decor-cursor-scrolling");
    }, 150);
  });

  window.addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      root.classList.remove("is-hidden");
      setInteractive(hitTest(mx, my));
    },
    { passive: true },
  );

  // ポインタがドキュメント外へ（アドレスバー等）: 装飾を隠す
  document.addEventListener(
    "mouseout",
    (e) => {
      if (isNodeInsideDocument(e.relatedTarget)) return;
      root.classList.add("is-hidden");
    },
    { passive: true },
  );

  // 外からドキュメントへ入った直後: 表示と位置を立て直す
  document.addEventListener(
    "mouseover",
    (e) => {
      if (isNodeInsideDocument(e.relatedTarget)) return;
      revealAfterReturn();
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerleave",
    () => {
      root.classList.add("is-hidden");
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerenter",
    () => {
      revealAfterReturn();
    },
    { passive: true },
  );

  window.addEventListener(
    "focus",
    () => {
      revealAfterReturn();
    },
    { passive: true },
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "visible") revealAfterReturn();
    },
    { passive: true },
  );

  window.addEventListener(
    "pageshow",
    (e: PageTransitionEvent) => {
      if (e.persisted) revealAfterReturn();
    },
    { passive: true },
  );

  window.addEventListener(
    "scroll",
    () => {
      root.classList.remove("is-hidden");
    },
    { passive: true, capture: true },
  );

  raf = requestAnimationFrame(loop);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(raf);
  });
}

initDecorCursor();
