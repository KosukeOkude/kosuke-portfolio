import { urlFor, sanityClient } from "@/sanity/client";
import { normalizeSlug } from "@/utils";
import type { GalleryCategory } from "@/data/gallery";
import type { WorkForClient } from "@/data/works";
import type { AboutPageContent } from "@/sanity/about";
import type { NewsArchive } from "@/data/news";

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
    thumbnailUrl:
      urlFor(w.thumbnailUrl ?? undefined)
        ?.width(560)
        .height(640)
        .auto("format")
        .url() ?? "",
    thumbnailAlt: w.thumbnailAlt ?? "",
    category: (w.category ?? "").toLocaleLowerCase(),
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
    imageUrl:
      urlFor(g.coverImage ?? undefined)
        ?.width(1200)
        .auto("format")
        .url() ?? "",
    imageAlt: g.imageAlt ?? "",
  }));
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
    thumbnailUrl:
      urlFor(n.thumbnailUrl ?? undefined)
        ?.width(560)
        .height(640)
        .auto("format")
        .url() ?? "",
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
      url: urlFor(f.asset ?? undefined)?.width(1200).auto('format').url() ?? '',
      size: f.size ?? 'md',
    }))
    .filter((f) => f.url);
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
      url:
        urlFor(f.asset ?? undefined)
          ?.width(400)
          .auto("format")
          .url() ?? "",
    }))
    .filter((f) => f.url);
}
