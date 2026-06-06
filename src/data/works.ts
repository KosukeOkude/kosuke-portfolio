import worksBackgroundImage from "@/assets/images/works-backrgound-image-pc.jpg";
import worksMobileBackgroundImage from "@/assets/images/works-mobile-image.jpg";
import type { YoutubeVideo } from "@/types";

export const worksPageConfig = {
  backgroundImage: worksBackgroundImage,
  backgroundAlt: "",
  mobileImage: worksMobileBackgroundImage,
};

export interface Work {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thumbnailUrl: string;
  thumbnailLightboxUrl: string;
  thumbnailAlt: string;
  videos?: YoutubeVideo[];
  description: string;
  category: string;
  concept?: string;
  process?: string;
  role?: string[];
  notes?: string;
  credits?: { label: string; value: string }[];
  subImage?: { src: string; lightboxSrc: string; alt: string }[];
  links?: { label: string; url: string }[];
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
