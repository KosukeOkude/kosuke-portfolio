import { useRef, useEffect } from "react";
import type { GalleryLinearSliderItem } from "@/data/gallery";
import { useGalleryTrackScrollToItem } from "@/hooks/gallery/useGalleryTrackScrollToItem";

interface GalleryTrackProps {
  items: GalleryLinearSliderItem[];
  resetKey: string;
  onOpenImage: (index: number) => void;
  scrollToId: string | null;
  scrollToken: number; // 閉じた瞬間ごとにトリガーするため
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
  resetKey,
  onOpenImage,
  scrollToId,
  scrollToken,
}: GalleryTrackProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // resetKey（カテゴリ/並び替え）変更時は先頭に戻す
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [resetKey]);

  // 指定IDの要素を「可能な範囲で中央」へスクロール
  useGalleryTrackScrollToItem({ scrollerRef, scrollToId, scrollToken });

  return (
    <div
      id="#archive-main"
      className="relative w-full mt-10 h-[70vh]"
      data-reveal
    >
      <div
        ref={scrollerRef}
        className="h-full flex items-center gap-10 px-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-proximity"
      >
        <div className="h-full flex items-center gap-10 px-6 w-max">
          {items.map((item, index) => (
            <article
              className="shrink-0 snap-center"
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
        </div>
      </div>
    </div>
  );
};
