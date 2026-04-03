import galleryBackgroundImage from "@/assets/images/gallery-background-image.jpg";

export const galleryPageConfig = {
  backgroundImage: galleryBackgroundImage,
  backgroundAlt: "木陰でピース",
};

export interface GalleryCategory {
  slug: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
}

type GalleryCategorySlug = GalleryCategory["slug"];

export interface GalleryLinearSliderItem {
  id: string;
  categorySlug: GalleryCategorySlug;
  imageUrl: string;
  lightboxImageUrl: string;
  imageAlt: string;
  size: "sm" | "md" | "xl" | "2xl" | "3xl";
  createdAt: string;
}

export {
  getGalleryCategories,
  getLinearSliderItems,
  getGalleryCategoryBySlug,
} from "@/sanity/gallery";
