import type { Work, WorkForClient } from "@/data/works";
import { sanityClient } from "@/sanity/client";
import { normalizeSlug } from "@/utils";
import { buildImageUrl, normalizeCategory, buildSubImages, filterYoutubeVideos } from "@/sanity/transform";
//一覧用ワーク全フィールド
export const worksListQuery = `*[_type == "work"] | order(date desc) {
    _id,
    "slug": slug.current,
    title,
    date,
    tags,
    category,
    description,
    "thumbnailUrl": thumbnail.asset->,
    thumbnailAlt
  }`;

//詳細スラッグ1件分

export const workBySlugQuery = `*[_type == "work" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    title,
    date,
    tags,
    category,
    description,
    concept,
    process,
    role,
    notes,
    credits,
    "thumbnailUrl": thumbnail.asset->,
    thumbnailAlt,
    videos[] {
      type,
      youtubeUrl
    },
    "subImages": subImages[] {
      "asset": asset->,
      alt
    },
    links
  }`;

export async function getAllWorks(): Promise<WorkForClient[]> {
  const list = await sanityClient.fetch<
    {
      slug: string;
      title: string;
      date: string;
      tags: string[] | null;
      category: string | null;
      description: string | null;
      thumbnailUrl: { _ref: string } | null;
      thumbnailAlt: string | null;
    }[]
  >(worksListQuery);
  // auto('format') を使う AVIF → WebP → PNG/JPEG
  return list.map((item) => ({
    slug: normalizeSlug(item.slug),
    title: item.title,
    date: item.date,
    tags: item.tags ?? [],
    thumbnailUrl: buildImageUrl(item.thumbnailUrl, 560),
    thumbnailAlt: item.thumbnailAlt ?? item.title,
    category: normalizeCategory(item.category),
  } satisfies WorkForClient));
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const doc = await sanityClient.fetch<{
    slug: string;
    title: string;
    date: string;
    tags: string[] | null;
    category: string | null;
    description: string | null;
    concept: string | null;
    process: string | null;
    role: string[] | null;
    notes: string | null;
    credits: { label: string; value: string }[] | null;
    thumbnailUrl: { _ref: string } | null;
    thumbnailAlt: string | null;
    videos: { type: string; youtubeUrl: string }[] | null;
    subImages: { asset: { _ref: string } | null; alt: string | null }[] | null;
    links: { label: string; url: string }[] | null;
  } | null>(workBySlugQuery, { slug });

  if (!doc) return null;

  const thumbnailUrl = buildImageUrl(doc.thumbnailUrl, 1200);
  const thumbnailLightboxUrl = buildImageUrl(doc.thumbnailUrl, 2000);
  const subImage = buildSubImages(doc.subImages, doc.title);
  const videos = filterYoutubeVideos(doc.videos);

  return {
    slug: normalizeSlug(doc.slug),
    title: doc.title,
    date: doc.date,
    tags: doc.tags ?? [],
    thumbnailUrl,
    thumbnailLightboxUrl,
    thumbnailAlt: doc.thumbnailAlt ?? doc.title,
    videos: videos.length > 0 ? videos : undefined,
    description: doc.description ?? "",
    category: doc.category ?? "",
    concept: doc.concept ?? undefined,
    process: doc.process ?? undefined,
    role: doc.role ?? undefined,
    notes: doc.notes ?? undefined,
    credits: doc.credits ?? undefined,
    subImage: subImage.length > 0 ? subImage : undefined,
    links: doc.links ?? undefined,
  } satisfies Work;
}
