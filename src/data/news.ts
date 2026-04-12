import type { YoutubeVideo } from "@/type/youtubeVideo";
import newsBackgroundImage from "@/assets/images/news-background.jpg";

export const newsPageConfig = {
  backgroundImage: newsBackgroundImage,
  backgroundAlt: "News background",
};

// src/data/news.ts
export interface NewsArchive {
  id: string;
  date: string; // "2026.02.25"
  title: string; // "二人の窓の外"
  summary: string;
  thumbnailUrl: string;
  thumbnailLightboxUrl: string;
  thumbnailAlt: string;
  videos?: YoutubeVideo[];
  slug: string;
  tags: string[];
  category: string;
}

export interface NewsPage extends NewsArchive {
  description: string;
  body?: string; // 本文（Works の concept 相当）
  details?: string; // 詳細・補足
  venue?: string; // 会場
  eventDate?: string; // イベント日時
  relatedLinks?: { label: string; url: string }[]; // 関連リンク（credits の代わり）
  subImage?: { src: string; lightboxSrc: string; alt: string }[];
}

export { getAllNews, getNewsBySlug } from "@/sanity/news";
