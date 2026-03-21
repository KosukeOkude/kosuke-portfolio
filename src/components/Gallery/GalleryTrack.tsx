import { useRef, useEffect, type FC } from 'react';
import type { GalleryLinearSliderItem } from '@/data/gallery';

interface GalleryTrackProps {
  items: GalleryLinearSliderItem[];
  resetKey: string;
}

const SIZE_CLASS: Record<GalleryLinearSliderItem['size'], string> = {
  sm: 'h-40',
  md: 'h-52',
  xl: 'h-64',
  '2xl': 'h-76',
  '3xl': 'h-88',
};

export const GalleryTrack: FC<GalleryTrackProps> = ({ items, resetKey }) => {
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth'});
    },[resetKey]);

  return (
    <div className="relative w-full mt-10 h-[70vh]">
      <div ref={scrollerRef} className="h-full flex items-center gap-10 px-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-proximity">
        <div className="h-full flex items-center gap-10 px-6 w-max">
          {items.map((item) => (
            <article className="shrink-0 snap-center" key={item.id}>
              <img src={item.imageUrl} alt={item.imageAlt} className={`${SIZE_CLASS[item.size]} w-auto rounded-md object-cover shadow-xl`} />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
