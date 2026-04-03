import type { DetailImageSource } from "@/type/detailImageSource";
import type { LightboxItem } from "@/type/lightbox";



export function mapDetailImagesToLightboxItems(
  source: DetailImageSource,
): LightboxItem[] {
  const primaryImage: LightboxItem = {
    src: source.mainImageUrl,
    alt: source.mainImageAlt ?? "",
  };

  const secondaryImages: LightboxItem[] = (
    source.subImages ?? []
  ).map((subImage) => ({
    src: subImage.src,
    alt: subImage.alt ?? "",
  }));

  return [primaryImage, ...secondaryImages];
}
