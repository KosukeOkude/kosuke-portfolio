import { type RefObject } from "react";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import { useGalleryTrackScrollToItem } from "@/hooks";
import { buildSrcSet } from "@/utils";

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
  // 指定IDの要素を「可能な範囲で中央」へスクロール
  useGalleryTrackScrollToItem({
    scrollerRef,
    scrollToId,
    scrollToken,
    maxScrollLeft,
    pinSt,
  });

  return (
    <>
      <div className="relative w-full mt-10 h-[60vh]">
        <div
          ref={scrollerRef}
          data-gallery-scroller
          className="h-full flex items-center gap-10 pl-6 overflow-x-auto overflow-y-hidden"
        >
          <div className="h-full flex items-center gap-10 pl-6 w-max">
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
                    srcSet={buildSrcSet(item.imageUrl, [600, 1200])}
                    alt={item.imageAlt}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="h-[250px] sm:h-[min(600px,55vh)] w-auto rounded-md object-cover shadow-xl"
                  />
                </button>
              </article>
            ))}
            <div
              className="shrink-0 w-6"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="hidden md:flex justify-center py-4 pointer-events-none">
        <span className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white font-bold">
          ↑ Scroll ↓
        </span>
      </div>
    </>
  );
};
