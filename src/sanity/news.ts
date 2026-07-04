import { sanityClient, urlFor } from "@/sanity/client";
import type { NewsArchive, NewsPage } from "@/data/news";
import { normalizeSlug } from "@/utils";

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
  return list.map((item) => {
    const thumbnailUrl =
      urlFor(item.thumbnailUrl ?? undefined)
        ?.width(560)
        .auto("format")
        .url() ?? "";

    const normalizedSlug = normalizeSlug(item.slug);
    const normalizedCategory = (item.category ?? "").toLocaleLowerCase();
    return {
      id: item._id,
      date: item.date,
      title: item.title,
      summary: item.summary,
      thumbnailUrl,
      thumbnailAlt: item.thumbnailAlt ?? item.title,
      slug: normalizedSlug,
      tags: item.tags ?? [],
      category: normalizedCategory,
    } satisfies NewsArchive;
  });
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
  const thumbnailUrl =
    urlFor(doc.thumbnailUrl ?? undefined)
      ?.width(1200)
      .auto("format")
      .url() ?? "";

  const thumbnailLightboxUrl =
    urlFor(doc.thumbnailUrl ?? undefined)
      ?.width(2000)
      .auto("format")
      .url() ?? "";

  const normalizedSlug = normalizeSlug(doc.slug);
  const normalizeCategory = (doc.category ?? "").toLocaleLowerCase();

  const subImage: { src: string; lightboxSrc: string; alt: string }[] = (
    doc.subImage ?? []
  )
    .filter(
      (s): s is { asset: { _ref?: string; _id?: string }; alt: string | null } =>
        !!s.asset,
    )
    .map((s, i) => ({
      src: urlFor(s.asset)?.width(1200).auto("format").url() ?? "",
      lightboxSrc: urlFor(s.asset)?.width(2000).auto("format").url() ?? "",
      alt: s.alt ?? `${doc.title}-${1 + i}`,
    }));

  // 追加：YouTubeだけ拾って WorkVideo に寄せる
  const videos = (doc.videos ?? [])
    .filter(
      (v): v is { type: "youtube"; youtubeUrl: string } =>
        v.type === "youtube" &&
        typeof v.youtubeUrl === "string" &&
        v.youtubeUrl.length > 0,
    )
    .map((v) => ({ type: v.type, youtubeUrl: v.youtubeUrl }));

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
    category: normalizeCategory,
    description: doc.description,
    body: doc.body ?? undefined, // 本文（Works の concept 相当）
    details: doc.details ?? undefined, // 詳細・補足
    venue: doc.venue ?? undefined, // 会場
    eventDate: doc.eventDate ?? undefined, // イベント日時
    relatedLinks: doc.relatedLinks ?? undefined, // 関連リンク（credits の代わり）
    subImage,
  };
}
