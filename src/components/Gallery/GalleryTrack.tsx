import { type RefObject } from "react";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import { useGalleryTrackScrollToItem } from "@/hooks/gallery/useGalleryTrackScrollToItem";
import ScrollLineVertical from "@/components/UI/ScrollLineVertical";

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

const SIZE_CLASS: Record<GalleryLinearSliderItem["size"], string> = {
  sm: "h-40",
  md: "h-52",
  xl: "h-64",
  "2xl": "h-76",
  "3xl": "h-88",
};

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
    <div className="relative w-full mt-10 h-[65vh]">
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
                  alt={item.imageAlt}
                  className={`${SIZE_CLASS[item.size]} w-auto rounded-md object-cover shadow-xl`}
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
      <ScrollLineVertical/>
    </div>
  );
};
