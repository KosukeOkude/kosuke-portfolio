import { useMemo, useState, type ReactNode } from "react";
import ImageLightBoxModal from "@/components/Lightbox/ImageLightboxModal";
import { mapDetailImagesToLightboxItems } from "@/components/Lightbox/mapDetailImagesToLightboxItems";
import type { DetailImageSource } from "@/types";

import { DetailSubImageGrid } from "@/components/Lightbox/DetailGallerySubImageGrid";
import { DetailGalleryMainImage } from "@/components/Lightbox/DetailGalleryMainImage";
import { useRevealDispatch } from "@/gsap/core";

export type DetailImageGalleryWithLightboxProps = DetailImageSource & {
  children?: ReactNode;
};

export default function DetailImageGalleryWithLightbox({
  mainImageUrl,
  mainImageLightboxUrl,
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
        mainImageLightboxUrl,
        mainImageAlt,
        subImages,
      }),
    [mainImageUrl, mainImageLightboxUrl, mainImageAlt, subImages],
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
