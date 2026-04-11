import worksBackgroundImage from "@/assets/images/works-image-3.jpg";
import worksMobileBackgroundImage from "@/assets/images/about-background-image.jpg";
import type { YoutubeVideo } from "@/type/youtubeVideo";

export const worksPageConfig = {
  backgroundImage: worksBackgroundImage,
  backgroundAlt: "カフェで抹茶のお菓子とティーセット",
  mobileImage: worksMobileBackgroundImage,
};

export interface Work {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
  thumbnailAlt: string;
  videos?: YoutubeVideo[];
  description: string;
  category: string;
  concept?: string;
  process?: string;
  role?: string[];
  notes?: string;
  credits?: { label: string; value: string }[];
  subImage?: { src: string; alt: string }[];
}

export interface WorkForClient {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thumbnailUrl: string;
  thumbnailAlt: string;
  category: string;
}

// 作品データをすべて取得（アーカイブページなど一覧用）
export { getAllWorks, getWorkBySlug } from "@/sanity/works";
