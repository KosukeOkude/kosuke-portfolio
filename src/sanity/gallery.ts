import type { GalleryCategory, GalleryLinearSliderItem } from "@/data/gallery";
import { sanityClient, urlFor } from "@/sanity/client";
import { normalizeSlug } from "@/utils";

export const galleryQuery = `*[_type == "gallery"] | order(title asc) {
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->,
    imageAlt,
    images[]{
        "asset": asset->
    }
}`;

type GalleryDoc = {
  slug: string;
  title: string;
  coverImage: { _ref?: string; _id?: string } | null;
  imageAlt: string | null;
  images?: {
    asset?: { _ref?: string; _id?: string } | null;
  }[];
};

async function fetchGalleryData() {
  const galleries = await sanityClient.fetch<GalleryDoc[]>(galleryQuery);

  const categories: GalleryCategory[] = galleries.map((g) => ({
    slug: normalizeSlug(g.slug),
    title: g.title,
    imageUrl:
      urlFor(g.coverImage ?? undefined)
        ?.width(800)
        .auto("format")
        .url() ?? "",
    imageAlt: g.imageAlt ?? g.title,
  }));

  const sliderItems: GalleryLinearSliderItem[] = [];
  for (const gallery of galleries) {
    for (let i = 0; i < (gallery.images ?? []).length; i++) {
      const img = gallery.images![i]!;
      sliderItems.push({
        id: img.asset?._id ?? `${gallery.slug}-${i}`,
        categorySlug: normalizeSlug(gallery.slug),
        imageUrl:
          urlFor(img.asset ?? undefined)
            ?.width(800)
            .auto("format")
            .url() ?? "",
        lightboxImageUrl:
          urlFor(img.asset ?? undefined)
            ?.width(1700)
            .auto("format")
            .url() ?? "",
        imageAlt: `${gallery.title} - ${i + 1}`,
      });
    }
  }

  return { categories, sliderItems };
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  const { categories } = await fetchGalleryData();
  return categories;
}

export async function getLinearSliderItems(): Promise<
  GalleryLinearSliderItem[]
> {
  const { sliderItems } = await fetchGalleryData();
  return sliderItems;
}

export async function getGalleryCategoryBySlug(
  slug: string,
): Promise<GalleryCategory | null> {
  const { categories } = await fetchGalleryData();
  return (
    categories.find(
      (c) => c.slug.trim().toLowerCase() === slug.trim().toLowerCase(),
    ) ?? null
  );
}
