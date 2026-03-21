import worksBackgroundImage from '@/assets/images/works-background-img.jpg';

export const worksPageConfig = {
  backgroundImage: worksBackgroundImage,
  backgroundAlt: 'カフェで抹茶のお菓子とティーセット'
}

export interface Work {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
  thumbnailAlt: string;
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
  resetKey:string;
}

// 作品データをすべて取得（アーカイブページなど一覧用）
export { getAllWorks, getWorkBySlug } from '@/lib/sanity/works'