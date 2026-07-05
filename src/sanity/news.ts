import { sanityClient } from "@/sanity/client";
import type { NewsArchive, NewsPage } from "@/data/news";
import { normalizeSlug } from "@/utils";
import { buildImageUrl, normalizeCategory, buildSubImages, filterYoutubeVideos } from "@/sanity/transform";

export const newsListQuery = `*[_type == "news"] | order(date desc) {
  _id,
  date,
  title,
  summary,
  "thumbnailUrl": thumbnail.asset->,
  thumbnailAlt,
  "slug": slug.current,
  tags,
  category
}`;

export const newsBySlugQuery = `*[_type == "news" && slug.current == $slug][0] {
  _id,
  date,
  title,
  summary,
  "thumbnailUrl": thumbnail.asset->,
  thumbnailAlt,
  videos[] {
  type,
  youtubeUrl
  },
  "slug": slug.current,
  tags,
  category,
  description,
  body,
  details,
  venue,
  eventDate,
  relatedLinks,
  "subImage":subImages[] {
    "asset": image.asset->,
    alt
  }
}`;

export async function getAllNews(): Promise<NewsArchive[]> {
  //クエリを投げる側
  const list = await sanityClient.fetch<
    {
      _id: string;
      date: string;
      title: string;
      summary: string;
      thumbnailUrl: { _ref?: string } | null;
      thumbnailAlt: string;
      slug: string;
      tags: string[] | null;
      category: string;
    }[]
  >(newsListQuery);

  //返却側
  return list.map((item) => ({
    id: item._id,
    date: item.date,
    title: item.title,
    summary: item.summary,
    thumbnailUrl: buildImageUrl(item.thumbnailUrl, 560),
    thumbnailAlt: item.thumbnailAlt ?? item.title,
    slug: normalizeSlug(item.slug),
    tags: item.tags ?? [],
    category: normalizeCategory(item.category),
  } satisfies NewsArchive));
}

export async function getNewsBySlug(slug: string): Promise<NewsPage> {
  const doc = await sanityClient.fetch<{
    _id: string;
    date: string;
    title: string;
    summary: string;
    thumbnailUrl: { _ref?: string; _id?: string } | null;
    thumbnailAlt: string | null;
    videos: { type: string; youtubeUrl: string }[] | null;
    slug: string;
    tags: string[] | null;
    category: string;
    description: string;
    body: string | null; // 本文（Works の concept 相当）
    details: string | null; // 詳細・補足
    venue: string | null; // 会場
    eventDate: string | null; // イベント日時
    relatedLinks: { label: string; url: string }[] | null; // 関連リンク（credits の代わり）
    subImage:
      | { asset: { _ref?: string; _id?: string } | null; alt: string | null }[]
      | null;
  }>(newsBySlugQuery, { slug });

  //返却側
  const thumbnailUrl = buildImageUrl(doc.thumbnailUrl, 1200);
  const thumbnailLightboxUrl = buildImageUrl(doc.thumbnailUrl, 2000);
  const normalizedSlug = normalizeSlug(doc.slug);
  const normalizedCategory = normalizeCategory(doc.category);
  const subImage = buildSubImages(doc.subImage, doc.title);
  const videos = filterYoutubeVideos(doc.videos);

  return {
    id: doc._id,
    date: doc.date,
    title: doc.title,
    summary: doc.summary,
    thumbnailUrl,
    thumbnailLightboxUrl,
    thumbnailAlt: doc.thumbnailAlt ?? doc.title,
    videos: videos.length > 0 ? videos : undefined,
    slug: normalizedSlug,
    tags: doc.tags ?? [],
    category: normalizedCategory,
    description: doc.description,
    body: doc.body ?? undefined, // 本文（Works の concept 相当）
    details: doc.details ?? undefined, // 詳細・補足
    venue: doc.venue ?? undefined, // 会場
    eventDate: doc.eventDate ?? undefined, // イベント日時
    relatedLinks: doc.relatedLinks ?? undefined, // 関連リンク（credits の代わり）
    subImage,
  };
}
