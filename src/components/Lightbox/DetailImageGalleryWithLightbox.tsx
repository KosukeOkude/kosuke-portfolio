import { useMemo, useState } from "react";
import ImageLightBoxModal from "@/components/Lightbox/ImageLightboxModal";
import { mapDetailImagesToLightboxItems } from "@/components/Lightbox/utils/mapDetailImagesToLightboxItems";
import type { DetailImageGalleryWithLightboxProps } from "@/type/detailImageSource";
import { DetailSubImageGrid } from "@/components/Lightbox/parts/DetailGallerySubImageGrid";
import { DetailGalleryMainImage } from "@/components/Lightbox/parts/DetailGalleryMainImage";
import { useRevealDispatch } from "@/gsap/core/useRevealDispatch";

export default function DetailImageGalleryWithLightbox({
  mainImageUrl,
  mainImageAlt,
  subImages = [],
  children,
}: DetailImageGalleryWithLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  //ライトボックスを開いたときに最初に表示するスライドのインデックス
  const [initialIndex, setInitialIndex] = useState(0);

  const LightboxItems = useMemo(
    () =>
      mapDetailImagesToLightboxItems({
        mainImageUrl,
        mainImageAlt,
        subImages,
      }),
    [mainImageUrl, mainImageAlt, subImages],
  );

  const openAt = (index: number) => {
    setInitialIndex(index);
    setIsOpen(true);
  };

  useRevealDispatch();

  return (
    <section className="flex flex-col gap-8 md:gap-12 mb-10">
      <div data-reveal>
        <DetailGalleryMainImage
          mainImage={mainImageUrl}
          mainImageAlt={mainImageAlt}
          onOpen={() => openAt(0)}
        />
      </div>

      {children}
      <div data-reveal>
        <DetailSubImageGrid
          subImages={subImages}
          openAt={(subIndex) => openAt(subIndex + 1)}
        />
      </div>

      <ImageLightBoxModal
        items={LightboxItems}
        initialIndex={initialIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </section>
  );
}
