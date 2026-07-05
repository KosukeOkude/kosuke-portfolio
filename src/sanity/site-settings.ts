import { sanityClient } from "@/sanity/client";
import { buildImageUrl, normalizeCategory } from "@/sanity/transform";
import { normalizeSlug } from "@/utils";
import { getYouTubeVideoId } from "@/utils/youtube";
import type { GalleryCategory } from "@/data/gallery";
import type { WorkForClient } from "@/data/works";
import type { AboutPageContent } from "@/sanity/about";
import type { NewsArchive } from "@/data/news";
import type { TopMovie } from "@/data/movie";

const siteSettingsWorksQuery = `*[_id == "siteSettings"][0] {
        topWorksItems[]->{
            "slug": slug.current,
            title,
            date,
            tags,
            category,
            description,
            "thumbnailUrl": thumbnail.asset->,
            thumbnailAlt
        }
}`;

type SiteSettingWorksDoc = {
  topWorksItems?: {
    slug: string;
    title: string;
    date: string;
    tags: string[] | null;
    thumbnailUrl: { _ref?: string; _id?: string } | null;
    thumbnailAlt: string | null;
    category: string | null;
  }[];
};

export async function displayTopWorks(): Promise<WorkForClient[]> {
  const doc = await sanityClient.fetch<SiteSettingWorksDoc | null>(
    siteSettingsWorksQuery,
  );
  const refs = doc?.topWorksItems ?? [];
  return refs.map((w) => ({
    slug: normalizeSlug(w.slug),
    title: w.title,
    date: w.date,
    tags: w.tags ?? [],
    thumbnailUrl: buildImageUrl(w.thumbnailUrl, 560, 640),
    thumbnailAlt: w.thumbnailAlt ?? "",
    category: normalizeCategory(w.category),
  }));
}

const siteSettingsGalleryQuery = `*[_id == "siteSettings"][0] {
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

export async function displayTopGalleryCategories(): Promise<GalleryCategory[]> {
  const doc = await sanityClient.fetch<SiteSettingsDoc | null>(siteSettingsGalleryQuery);
  const refs = doc?.topGalleryCategories ?? [];

  return refs.map((g) => ({
    slug: normalizeSlug(g.slug),
    title: g.title,
    imageUrl: buildImageUrl(g.coverImage, 1200),
    imageAlt: g.imageAlt ?? "",
  }));
}

const siteSettingsMovieQuery = `*[_id == "siteSettings"][0]{
    topMovie{
      title,
      youtubeUrl
    }
}`;

type SiteSettingsMovieDoc = {
  topMovie?: {
    title: string | null;
    youtubeUrl: string | null;
  };
};

export async function displayTopMovie(): Promise<TopMovie | null> {
  const doc = await sanityClient.fetch<SiteSettingsMovieDoc | null>(
    siteSettingsMovieQuery,
  );
  const block = doc?.topMovie;
  const videoId = block?.youtubeUrl ? getYouTubeVideoId(block.youtubeUrl) : null;

  if (!videoId) return null;

  return {
    title: block?.title ?? "",
    videoId,
  };
}

const siteSettingsAboutQuery = `*[_id == "siteSettings"][0]{
    topAbout{
      pageLabel,
      name,
      tagline,
      intro,
      encounterTitle,
      encounterBody,
      themeTitle,
      themeBody,
      achievementsTitle,
      achievementsIntro,
      achievementsList,
      contactMessage,
      contactEmail,
      contactButtonLabel
    }
}`;

type SiteSettingsAboutDoc = {
  topAbout?: {
    name: string | null;
    tagline: string | null;
    intro: string | null;
    encounterTitle: string | null;
    encounterBody: string | null;
    themeTitle: string | null;
    themeBody: string | null;
    achievementsTitle: string | null;
    achievementsIntro: string | null;
    achievementsList: string[] | null;
    contactMessage: string | null;
    contactEmail: string | null;
  };
};

export async function displayTopAbout(): Promise<AboutPageContent> {
  const doc = await sanityClient.fetch<SiteSettingsAboutDoc | null>(
    siteSettingsAboutQuery,
  );
  const block = doc?.topAbout;

  if (!block) {
    return {};
  }

  return {
    name: block.name ?? undefined,
    tagline: block.tagline ?? undefined,
    intro: block.intro ?? undefined,
    encounterTitle: block.encounterTitle ?? undefined,
    encounterBody: block.encounterBody ?? undefined,
    themeTitle: block.themeTitle ?? undefined,
    themeBody: block.themeBody ?? undefined,
    achievementsTitle: block.achievementsTitle ?? undefined,
    achievementsIntro: block.achievementsIntro ?? undefined,
    achievementsList: block.achievementsList ?? undefined,
    contactMessage: block.contactMessage ?? undefined,
    contactEmail: block.contactEmail ?? undefined,
  };
}

const siteSettingsNewsQuery = `*[_id == "siteSettings"][0]{
    topNewsItems[]->{
        _id,
        date,
        title,
        summary,
        "thumbnailUrl": thumbnail.asset->,
        thumbnailAlt,
        "slug": slug.current,
        tags,
        category,
    }
}`;

type SiteSettingNewsDoc = {
  topNewsItems: {
    _id: string;
    date: string;
    title: string;
    summary: string;
    thumbnailUrl: { _ref?: string } | null;
    thumbnailAlt: string | null;
    slug: string;
    tags: string[] | null;
    category: string;
  }[];
};

export async function displayTopNews(): Promise<NewsArchive[]> {
  const doc = await sanityClient.fetch<SiteSettingNewsDoc | null>(siteSettingsNewsQuery);
  const refs = doc?.topNewsItems ?? [];

  return refs.map((n) => ({
    id: n._id,
    date: n.date,
    title: n.title,
    summary: n.summary,
    thumbnailUrl: buildImageUrl(n.thumbnailUrl, 560, 640),
    thumbnailAlt: n.thumbnailAlt ?? "",
    slug: n.slug,
    tags: n.tags ?? [],
    category: n.category,
  }));
}

const siteSettingsAboutAnimationImagesQuery = `*[_id == "siteSettings"][0]{
  aboutAnimationImages[]{
    "asset": image.asset->,
    size
  }
}`;

type SiteSettingsAboutAnimationImagesDoc = {
  aboutAnimationImages?: {
    asset: { _ref?: string; _id?: string } | null;
    size: string | null;
  }[];
};

export async function displayAboutAnimationImages(): Promise<{ url: string; size: string }[]> {
  const doc = await sanityClient.fetch<SiteSettingsAboutAnimationImagesDoc | null>(siteSettingsAboutAnimationImagesQuery);
  return (doc?.aboutAnimationImages ?? [])
    .map((f) => ({
      url: buildImageUrl(f.asset, 1200),
      size: f.size ?? 'md',
    }))
    .filter((f) => f.url);
}

const siteSettingsHeroVideoQuery = `*[_id == "siteSettings"][0]{
  heroVideo{
    "videoUrl": video.asset->url,
    "mobileVideoUrl": mobileVideo.asset->url,
    "posterAsset": poster.asset->,
    "mobilePosterAsset": mobilePoster.asset->
  }
}`;

type SiteSettingsHeroVideoDoc = {
  heroVideo?: {
    videoUrl: string | null;
    mobileVideoUrl: string | null;
    posterAsset: { _ref?: string; _id?: string } | null;
    mobilePosterAsset: { _ref?: string; _id?: string } | null;
  };
};

export async function displayHeroVideo(): Promise<{
  videoUrl: string;
  mobileVideoUrl: string;
  posterUrl: string;
  mobilePosterUrl: string;
}> {
  const doc = await sanityClient.fetch<SiteSettingsHeroVideoDoc | null>(
    siteSettingsHeroVideoQuery,
  );
  const block = doc?.heroVideo;
  return {
    videoUrl: block?.videoUrl ?? "",
    mobileVideoUrl: block?.mobileVideoUrl ?? "",
    posterUrl: buildImageUrl(block?.posterAsset, 1920),
    mobilePosterUrl: buildImageUrl(block?.mobilePosterAsset, 1280),
  };
}

const siteSettingsEntranceFilmsQuery = `*[_id == "siteSettings"][0]{
  entranceFilms[]{
    "asset": image.asset->
  }
}`;

type SiteSettingsEntranceFilmsDoc = {
  entranceFilms?: {
    asset: { _ref?: string; _id?: string } | null;
  }[];
};

export async function displayEntranceFilms(): Promise<{ id: string; url: string }[]> {
  const doc = await sanityClient.fetch<SiteSettingsEntranceFilmsDoc | null>(
    siteSettingsEntranceFilmsQuery,
  );
  return (doc?.entranceFilms ?? [])
    .map((f) => ({
      id: f.asset?._id ?? "",
      url: buildImageUrl(f.asset, 400),
    }))
    .filter((f) => f.url);
}
