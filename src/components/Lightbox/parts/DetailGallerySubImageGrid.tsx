import type { DetailSubImage } from "@/type/detailImageSource";
import { buildSrcSet } from "@/utils/buildSrcSet";

interface DetailSubImageGridProps {
  subImages: DetailSubImage[];
  openAt: (subIndex: number) => void;
}

export function DetailSubImageGrid({
  subImages,
  openAt,
}: DetailSubImageGridProps) {
  if (subImages.length === 0) return null;

  return (
    <div
      className="grid grid-col-1 md:grid-cols-2 gap-4"
    >
      {subImages.map((image, subIndex) => (
        <button
          key={`${image.src}-${subIndex}`}
          type="button"
          onClick={() => openAt(subIndex)}
          aria-label={`Open sub image ${subIndex} in lightbox`}
          className="block w-full text-left cursor-pointer"
        >
          <div className="aspect-video rounded-md overflow-hidden border border-white/15 bg-white/5">
            <img
              src={image.src}
              srcSet={image.src ? buildSrcSet(image.src, [400, 800, 1200]) : undefined}
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={image.alt ?? ""}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
