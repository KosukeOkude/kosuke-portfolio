import type { LightboxItem, DetailImageSource } from "@/types";


export function mapDetailImagesToLightboxItems(
  source: DetailImageSource,
): LightboxItem[] {
  const primaryImage: LightboxItem = {
    src: source.mainImageLightboxUrl,
    alt: source.mainImageAlt ?? "",
  };

  const secondaryImages: LightboxItem[] = (source.subImages ?? []).map((subImage) => ({
    src: subImage.lightboxSrc,
    alt: subImage.alt ?? "",
  }));

  return [primaryImage, ...secondaryImages];
}
