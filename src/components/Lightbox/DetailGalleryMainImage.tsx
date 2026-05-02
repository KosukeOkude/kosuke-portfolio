import { buildSrcSet } from "@/utils";

interface DetailGalleryMainImageProps {
  mainImage: string;
  mainImageAlt?: string;
  onOpen: () => void;
}

export function DetailGalleryMainImage({
  mainImage,
  mainImageAlt,
  onOpen,
}: DetailGalleryMainImageProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open main image in lightbox"
      className="block w-full text-left cursor-pointer"
    >
      <div className="overflow-hidden rounded-lg border border-white/15 bg-white/5 h-[360px] md:h-[560px]">
        <img
          src={mainImage}
          srcSet={mainImage ? buildSrcSet(mainImage, [400, 800, 1200]) : undefined}
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={mainImageAlt ?? ""}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </button>
  );
}
