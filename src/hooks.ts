import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type DependencyList,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { gsap, ScrollTrigger, REVEAL_REFRESH_EVENT } from "@/gsap/core";
import { ARCHIVE_MAIN_ANCHOR_ID, normalizeSlug } from "@/utils";

// --- アーカイブ ---

// アイテムからカテゴリ一覧を生成し、先頭に "All" を追加する
export function useAllCategories<T>(
  items: T[],
  getCategory: (item: T) => string,
): string[] {
  return useMemo(() => {
    const catSet = new Set<string>();
    for (const item of items) {
      catSet.add(getCategory(item));
    }
    return ["All", ...catSet];
  }, [items, getCategory]);
}

// URL の ?category= クエリ値を正規化して返す（なければ null）
export function parseCategoryQueryParam(raw: string | null): "All" | string | null {
  if (!raw) return null;
  const normalized = normalizeSlug(raw);
  if (normalized === "all") return "All";
  return normalized;
}

// マウント時に ?category= を読み、selectedCategory に反映する（1回だけ）
export function useArchiveCategoryFromQuery(
  setSelectedCategory: Dispatch<SetStateAction<"All" | string>>,
): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = parseCategoryQueryParam(
      new URLSearchParams(window.location.search).get("category"),
    );
    if (parsed !== null) {
      setSelectedCategory(parsed);
    }
  }, [setSelectedCategory]);
}

// #archive-main 付きで遷移してきたとき、島の描画後にスクロールする（1回だけ）
export function useArchiveMoreInCategoryLanding(): void {
  const didScrollRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const archiveMainHash = `#${ARCHIVE_MAIN_ANCHOR_ID}`;
    if (window.location.hash !== archiveMainHash) return;

    const scrollArchiveMainIntoView = (): void => {
      if (didScrollRef.current) return;
      const el = document.getElementById(ARCHIVE_MAIN_ANCHOR_ID);
      if (!el) return;
      didScrollRef.current = true;
      el.scrollIntoView({ behavior: "auto", block: "start" });
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(scrollArchiveMainIntoView);
    });
    const timeoutId = window.setTimeout(scrollArchiveMainIntoView, 120);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, []);
}

// フィルタ変更後に #archive-main へスクロールする（初回マウントはスキップ）
export function useScrollArchiveMainOnFilterChange(deps: DependencyList): void {
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      return;
    }

    const scrollToMainIntoView = (): void => {
      const el = document.getElementById(ARCHIVE_MAIN_ANCHOR_ID);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToMainIntoView);
    });
    const timeoutId = window.setTimeout(scrollToMainIntoView, 120);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, deps);
}

// --- スクロール ---

// ST の PIN 開始位置へ瞬時スクロールする（フィルタ変更時。初回マウントはスキップ）
export function useScrollToPinStart(
  pinSt: RefObject<ScrollTrigger | null>,
  deps: DependencyList,
  fallbackSelector: string,
): void {
  const isFirstRunRef = useRef(true);
  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      return;
    }

    const rafId = requestAnimationFrame(async () => {
      const { lenis } = await import("@/client");
      const st = pinSt.current;

      const targetY = st
        ? st.start
        : (() => {
            const el = document.querySelector(fallbackSelector);
            return el ? el.getBoundingClientRect().top + window.scrollY : 0;
          })();

      if (lenis) {
        lenis.scrollTo(targetY, { duration: 0 });
      } else {
        window.scrollTo({ top: targetY, behavior: "instant" });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, deps);
}

// 横スクロールコンテナを GSAP ScrollTrigger の scrub アニメーションに接続するフック
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

    if (window.matchMedia("(pointer: coarse)").matches) return;

    stRef.current?.kill();
    stRef.current = null;
    scroller.scrollLeft = 0;

    const buildST = (): boolean => {
      const currentMax = scroller.scrollWidth - scroller.clientWidth;
      if (currentMax <= 0) return false;

      stRef.current?.kill();
      maxScrollLeftRef.current = currentMax;

      const tl = gsap.timeline();
      // fromTo でスタートを 0 に固定（to() だと invalidateOnRefresh 後に start=max になるバグを防ぐ）
      tl.fromTo(
        scroller,
        { scrollLeft: 0 },
        {
          scrollLeft: () => scroller.scrollWidth - scroller.clientWidth,
          ease: "none",
          duration: 1,
        },
      );

      const triggerEl = document.querySelector<HTMLElement>(triggerSelector) ?? root;

      stRef.current = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top+=80",
        end: () => `+=${scroller.scrollWidth - scroller.clientWidth}`,
        pin: root,
        scrub: true,
        animation: tl,
        invalidateOnRefresh: true,
        onRefresh() {
          maxScrollLeftRef.current = scroller.scrollWidth - scroller.clientWidth;
        },
      });

      ScrollTrigger.refresh();
      return true;
    };

    const observeTarget = scroller.firstElementChild ?? scroller;

    const setUpImageLoadRefresh = () => {
      const imgs = Array.from(scroller.querySelectorAll<HTMLImageElement>("img"));
      const unloaded = imgs.filter((img) => !img.complete);
      if (unloaded.length === 0) return () => {};

      const handleLoad = () => ScrollTrigger.refresh();
      unloaded.forEach((img) => img.addEventListener("load", handleLoad, { once: true }));

      return () => {
        unloaded.forEach((img) => img.removeEventListener("load", handleLoad));
      };
    };

    if (!buildST()) {
      let cleanUpImageLoad = () => {};
      const retryObserver = new ResizeObserver(() => {
        if (buildST()) {
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

    const cleanUpImageLoad = setUpImageLoadRefresh();

    return () => {
      cleanUpImageLoad();
      stRef.current?.kill();
      stRef.current = null;
    };
  }, [resetKey]);

  return { maxScrollLeft: maxScrollLeftRef, pinSt: stRef };
}

// --- GSAP Reveal ---

// deps が変わるたびに reveal:refresh を発火し、GSAP reveal を再スキャンさせる
export function useRevealRefreshOnChange(deps: DependencyList): void {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(REVEAL_REFRESH_EVENT));
  }, deps);
}

// --- ギャラリー ---

type UseGalleryTrackScrollToItemOptions = {
  scrollerRef: RefObject<HTMLDivElement | null>;
  scrollToId: string | null;
  scrollToken: number;
  maxScrollLeft: RefObject<number | null>;
  pinSt: RefObject<ScrollTrigger | null>;
};

// Lightbox を閉じたとき、元の画像が中央に来る縦座標へ lenis でスクロールする
export function useGalleryTrackScrollToItem({
  scrollerRef,
  scrollToId,
  scrollToken,
  maxScrollLeft,
  pinSt,
}: UseGalleryTrackScrollToItemOptions) {
  useEffect(() => {
    if (!scrollToId) return;

    function computeScrollLeftToCenterChild(
      scroller: HTMLElement,
      child: HTMLElement,
    ): number {
      const scrollerRect = scroller.getBoundingClientRect();
      const childRect = child.getBoundingClientRect();
      const rawTargetLeft =
        scroller.scrollLeft +
        (childRect.left - scrollerRect.left) -
        (scroller.clientWidth / 2 - child.clientWidth / 2);
      return Math.max(0, rawTargetLeft);
    }

    let innerFrameId: number | null = null;
    const frameId = requestAnimationFrame(async () => {
      const { lenis } = await import("@/client");

      const scrollerElement = scrollerRef.current;
      if (!scrollerElement) return;

      const targetElement = document.getElementById(scrollToId);
      if (!targetElement) return;

      const targetLeft = computeScrollLeftToCenterChild(scrollerElement, targetElement);

      const st = pinSt.current;
      const max = maxScrollLeft.current;

      if (!st || !max || max <= 0 || !lenis) return;

      const ratio = Math.min(targetLeft / max, 1);
      const targetScrollY = st.start + ratio * (st.end - st.start);

      innerFrameId = requestAnimationFrame(() => {
        lenis.scrollTo(targetScrollY);
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (innerFrameId !== null) cancelAnimationFrame(innerFrameId);
    };
  }, [scrollToId, scrollToken, scrollerRef, maxScrollLeft, pinSt]);
}
