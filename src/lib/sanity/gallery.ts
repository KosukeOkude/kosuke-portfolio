import type { GalleryCategory, GalleryLinearSliderItem } from '@/data/gallery';
import { sanityClient, urlFor } from '@/lib/sanity/client';
import { normalizeSlug } from "@/lib/sanity/normalizeSlug";

export const galleryQuery = `*[_type == "gallery"] | order(title asc) {
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->,
    imageAlt,
    blocks[]{
        images[]{
            "asset": image.asset->,
            alt,
            size,
            createdAt
        }
    }
}`;

type GalleryDoc = {
  slug: string;
  title: string;
  coverImage: { _ref?: string; _id?: string } | null;
  imageAlt: string | null;
  blocks?: {
    images?: {
      asset?: { _ref?: string; _id?: string } | null;
      alt?: string | null;
      size?: string | null;
      createdAt?: string | null;
    }[];
  }[];
};

async function fetchGalleryData() {
  // 1. 全 Gallery を取得
  const galleries = await sanityClient.fetch<GalleryDoc[]>(galleryQuery);
  // 2. GalleryCategory に変換
  const categories: GalleryCategory[] = galleries.map((g) => ({
    slug: normalizeSlug(g.slug),
    title: g.title,
    imageUrl:
      urlFor(g.coverImage ?? undefined)
        ?.width(800)
        .auto('format')
        .url() ?? '',
    imageAlt: g.imageAlt ?? '',
  }));
  // 3. GalleryLinearSliderItem に変換（フラット化）
  const sliderItems: GalleryLinearSliderItem[] = [];
  for (const gallery of galleries) {
    for (const block of gallery.blocks ?? []) {
      for (let i = 0; i < (block.images ?? []).length; i++) {
        const img = block.images![i]!;
        sliderItems.push({
          id: img.asset?._id ?? `${gallery.slug}-${i}`,
          categorySlug: normalizeSlug(gallery.slug),
          imageUrl: urlFor(img.asset ?? undefined)?.width(2400).auto('format').url() ?? '',
          imageAlt: img.alt ?? '',
          size: (img.size ?? 'md') as 'sm' | 'md' | 'xl' | '2xl' | '3xl',
          createdAt: img.createdAt ?? ''
        });
      }
    }
  }
  return { categories, sliderItems }
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
    const { categories }= await fetchGalleryData();
    return categories;
}

export async function getLinearSliderItems(): Promise<GalleryLinearSliderItem[]> {
    const { sliderItems } = await fetchGalleryData();
    return sliderItems;
}

export async function getGalleryCategoryBySlug(slug: string): Promise<GalleryCategory | null> {
    const { categories } = await fetchGalleryData();
    return categories.find((c) => c.slug.trim().toLowerCase() === slug.trim().toLowerCase()) ?? null;
}
