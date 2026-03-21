import type { GalleryCategory } from '@/data/gallery';
import { urlFor, sanityClient } from '@/lib/sanity/client';
import { normalizeSlug } from '@/lib/sanity/normalizeSlug';

const siteSettingsQuery = `*[_id == "siteSettings"][0] {
        topGalleryCategories[]->{
        "slug": slug.current,
        title,
        "coverImage": coverImage.asset->,
        imageAlt
    }
}`;

type SiteSettingsDoc = {
  topGalleryCategories?: {
    slug: string;
    title: string;
    coverImage: { _ref?: string; _id?: string } | null;
    imageAlt: string | null;
  }[];
};

export async function getTopGalleryCategories(): Promise<GalleryCategory[]> {
  const doc = await sanityClient.fetch<SiteSettingsDoc | null>(siteSettingsQuery);
  const refs = doc?.topGalleryCategories ?? [];

  return refs.map((g) => ({
    slug: normalizeSlug(g.slug),
    title: g.title,
    imageUrl:
      urlFor(g.coverImage ?? undefined)
        ?.width(1200)
        .auto('format')
        .url() ?? '',
    imageAlt: g.imageAlt ?? '',
  }));
}
