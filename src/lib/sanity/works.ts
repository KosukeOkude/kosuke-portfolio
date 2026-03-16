import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Work, WorkForClient } from '@/data/works';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error('SANITY_PROJECT_ID と SANITY_DATASET を .env に設定してください');
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);
//一覧用ワーク全フィールド
export const worksListQuery = `*[_type == "work"] | order(date desc) {
    _id,
    "slug": slug.current,
    title,
    date,
    tags,
    category,
    description,
    "thumbnail": thumbnail.asset->,
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
    "thumbnail": thumbnail.asset->,
    thumbnailAlt,
    "subImages": subImages[] {
      "asset": asset->,
      alt
    }
  }`;

export function urlFor(source: { _ref?: string; _id?:string; } | undefined) {
  if (!source?._ref && !source?._id) return null;
  return builder.image(source);
}
export async function getAllWorks(): Promise<WorkForClient[]> {
  const list = await sanityClient.fetch<
    {
      slug: string;
      title: string;
      date: string;
      tags: string[] | null;
      category: string | null;
      description: string | null;
      thumbnail: { _ref: string } | null;
      thumbnailAlt: string | null;
    }[]
  >(worksListQuery);
  // auto('format') を使う AVIF → WebP → PNG/JPEG
  return list.map((item) => {
    const thumbnailUrl =
      urlFor(item.thumbnail ?? undefined)
        ?.width(560)
        .height(640)
        .auto('format')
        .url() ?? '';
    return {
      slug: item.slug,
      title: item.title,
      date: item.date,
      tags: item.tags ?? [],
      thumbnailUrl,
      thumbnailAlt: item.thumbnailAlt ?? '',
      category: item.category ?? '',
    } satisfies WorkForClient;
  });
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
    thumbnail: { _ref: string } | null;
    thumbnailAlt: string | null;
    subImages: { asset: { _ref: string } | null; alt: string | null }[] | null;
  } | null>(workBySlugQuery, { slug });

  if (!doc) return null;

  const thumbnailUrl =
    urlFor(doc.thumbnail ?? undefined)
      ?.width(1200)
      .auto('format')
      .url() ?? '';

  const subImage: { src: string; alt: string }[] = (doc.subImages ?? [])
    .filter((s): s is { asset: { _ref: string }; alt: string | null } => !!s.asset)
    .map((s) => ({
        src: urlFor(s.asset)?.width(1200).auto('format').url() ?? '',
        alt: s.alt ?? '',
    }))

    return {
        slug: doc.slug,
        title: doc.title,
        date: doc.date,
        tags: doc.tags ?? [],
        thumbnail: thumbnailUrl,
        thumbnailAlt: doc.thumbnailAlt ?? '',
        description: doc.description ?? '',
        category: doc.category ?? '',
        concept: doc.concept ?? undefined,
        process: doc.process ?? undefined,
        role: doc.role ?? undefined,
        notes: doc.notes ?? undefined,
        credits: doc.credits ?? undefined,
        subImage: subImage.length > 0 ? subImage : undefined,
    } satisfies Work

}


