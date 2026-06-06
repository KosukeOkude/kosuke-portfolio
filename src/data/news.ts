import type { YoutubeVideo } from "@/types";
import newsBackgroundImage from "@/assets/images/news-background-pc.jpg";
import newsMobileBackgroundImage from "@/assets/images/news-mobile-image.jpg";

export const newsPageConfig = {
  backgroundImage: newsBackgroundImage,
  backgroundAlt: "News background",
  mobileBackgroundImage: newsMobileBackgroundImage,
};

export interface NewsArchive {
  id: string;
  date: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  slug: string;
  tags: string[];
  category: string;
}

export interface NewsPage extends NewsArchive {
  thumbnailLightboxUrl: string;
  videos?: YoutubeVideo[];
  description: string;
  body?: string;
  details?: string;
  venue?: string;
  eventDate?: string;
  relatedLinks?: { label: string; url: string }[];
  subImage?: { src: string; lightboxSrc: string; alt: string }[];
}

export { getAllNews, getNewsBySlug } from "@/sanity/news";
