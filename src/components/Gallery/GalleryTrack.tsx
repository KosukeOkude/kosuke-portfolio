import { type RefObject, useState, useEffect, useRef, useCallback } from "react";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import { useGalleryTrackScrollToItem } from "@/hooks";
import type { ScrollTrigger } from "@/gsap/core";

interface GalleryTrackProps {
  items: GalleryLinearSliderItem[];
  resetKey: string;
  onOpenImage: (index: number) => void;
  scrollToId: string | null;
  scrollToken: number; // 閉じた瞬間ごとにトリガーするため
  scrollerRef: RefObject<HTMLDivElement | null>;
  maxScrollLeft: RefObject<number | null>;
  pinSt: RefObject<ScrollTrigger | null>;
}



export const GalleryTrack = ({
  items,
  onOpenImage,
  scrollToId,
  scrollToken,
  scrollerRef,
  maxScrollLeft,
  pinSt,
}: GalleryTrackProps) => {
  useGalleryTrackScrollToItem({
    scrollerRef,
    scrollToId,
    scrollToken,
    maxScrollLeft,
    pinSt,
  });

  const [thumbStyle, setThumbStyle] = useState<{ left: string; width: string }>({
    left: "0%",
    width: "20%",
  });

  const trackRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    import("@/client").then(({ lenis }) => {
      lenisRef.current = lenis;
    });
  }, []);

  const syncThumb = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setThumbStyle({ left: "0%", width: "100%" });
      return;
    }
    const widthPct = (clientWidth / scrollWidth) * 100;
    const leftPct = (scrollLeft / maxScroll) * (100 - widthPct);
    setThumbStyle({
      left: `${leftPct.toFixed(2)}%`,
      width: `${widthPct.toFixed(2)}%`,
    });
  }, [scrollerRef]);

  // スクロール比率 (0–1) に対応する位置へジャンプ
  const scrollToRatio = useCallback(
    (ratio: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const clamped = Math.max(0, Math.min(1, ratio));

      const st = pinSt.current;
      const max = maxScrollLeft.current;

      if (st && max && max > 0) {
        // デスクトップ: GSAP が縦スクロールで横スクロールを制御しているため、縦方向へ飛ぶ
        const targetY = st.start + clamped * (st.end - st.start);
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(targetY, { duration: 0 });
        } else {
          window.scrollTo({ top: targetY, behavior: "instant" });
        }
      } else {
        // モバイル: 直接 scrollLeft を操作
        scroller.scrollLeft = clamped * (scroller.scrollWidth - scroller.clientWidth);
      }
    },
    [scrollerRef, pinSt, maxScrollLeft],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.addEventListener("scroll", syncThumb, { passive: true });

    const ro = new ResizeObserver(syncThumb);
    ro.observe(scroller);
    const inner = scroller.firstElementChild as HTMLElement | null;
    if (inner) ro.observe(inner);

    syncThumb();

    return () => {
      scroller.removeEventListener("scroll", syncThumb);
      ro.disconnect();
    };
  }, [scrollerRef, syncThumb]);

  // スクロールバーのドラッグ操作
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onPointerDown = (e: PointerEvent) => {
      const thumb = track.querySelector<HTMLElement>("[data-scrollbar-thumb]");
      const isOnThumb = !!thumb && (e.target === thumb || thumb.contains(e.target as Node));
      const trackRect = track.getBoundingClientRect();

      if (!isOnThumb) {
        // トラック上のクリック → その位置へジャンプ
        scrollToRatio((e.clientX - trackRect.left) / trackRect.width);
        return;
      }

      // サム上のポインターダウン → ドラッグ開始
      e.preventDefault();
      track.setPointerCapture(e.pointerId);

      const scroller = scrollerRef.current;
      if (!scroller) return;

      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const startRatio = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0;
      const startX = e.clientX;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const currentRect = track.getBoundingClientRect();
        const ratioChange = (moveEvent.clientX - startX) / currentRect.width;
        scrollToRatio(startRatio + ratioChange);
      };

      const onPointerUp = () => {
        track.removeEventListener("pointermove", onPointerMove);
        track.removeEventListener("pointerup", onPointerUp);
        track.removeEventListener("pointercancel", onPointerUp);
      };

      track.addEventListener("pointermove", onPointerMove);
      track.addEventListener("pointerup", onPointerUp);
      track.addEventListener("pointercancel", onPointerUp);
    };

    track.addEventListener("pointerdown", onPointerDown, { passive: false });
    return () => track.removeEventListener("pointerdown", onPointerDown);
  }, [scrollToRatio, scrollerRef]);

  return (
    <>
      <div className="relative w-full mt-5 md:mt-10 h-[290px] min-[390px]:h-[360px] md:h-[60vh]">
        <div
          ref={scrollerRef}
          data-gallery-scroller
          className="h-full flex items-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="h-full flex items-center gap-10 w-max">
            {items.map((item, index) => (
              <article
                className="shrink-0"
                key={item.id}
              >
                <button
                  id={`gallery-open-${item.id}`}
                  type="button"
                  className="block p-0 border-0 bg-transparent cursor-pointer"
                  onClick={() => onOpenImage(index)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    loading={index < 3 ? "eager" : "lazy"}
                    width={item.imageWidth ?? undefined}
                    height={item.imageHeight ?? undefined}
                    style={
                      {
                        "--img-ratio": String(
                          item.imageWidth && item.imageHeight
                            ? item.imageWidth / item.imageHeight
                            : 4 / 3,
                        ),
                      } as React.CSSProperties
                    }
                    className="h-[250px] min-[390px]:h-[320px] md:h-[min(600px,55vh)] w-auto rounded-md object-cover shadow-xl"
                  />
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* カスタムスクロールバー（ドラッグ・クリックで操作可能） */}
      <div
        ref={trackRef}
        className="mt-4 py-2 relative cursor-pointer select-none"
        style={{ touchAction: "none" }}
      >
        <div className="relative h-[2px] rounded-full bg-white/15">
          <div
            data-scrollbar-thumb
            className="absolute top-0 h-full rounded-full bg-white cursor-grab active:cursor-grabbing"
            style={thumbStyle}
          />
        </div>
      </div>
    </>
  );
};
