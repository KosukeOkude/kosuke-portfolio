import { type RefObject, useState, useEffect, useCallback } from "react";
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
                    className="h-[250px] min-[390px]:h-[320px] md:h-[min(600px,55vh)] w-auto rounded-md object-cover shadow-xl"
                  />
                </button>
              </article>
            ))}
            <div className="shrink-0 w-6" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* カスタムスクロールバー */}
      <div className="mt-4 relative h-[2px] rounded-full bg-white/15">
        <div
          className="absolute top-0 h-full rounded-full bg-white"
          style={thumbStyle}
        />
      </div>
    </>
  );
};
