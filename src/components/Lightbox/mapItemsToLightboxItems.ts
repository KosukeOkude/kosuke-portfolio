import type { GalleryLinearSliderItem } from "@/data/gallery";
import type { LightboxItem } from "@/types";

// Gallery表示データを LightboxModal 用の最小データへ射影
export function mapGalleryItemsToLightboxItems(
  items: GalleryLinearSliderItem[],
): LightboxItem[] {
  return items.map((item) => ({
    src: item.lightboxImageUrl,
    alt: item.imageAlt ?? "",
  }));
}
