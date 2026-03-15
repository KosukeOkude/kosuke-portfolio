import type { ImageMetadata } from 'astro';
import astaliftThumb from '@/assets/images/works-default-image.jpg';
import subImageBg from '@/assets/images/works-background-img.jpg';

export interface Work {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: ImageMetadata;
  thumbnailAlt: string;
  description: string;
  category: string;
  concept?: string;
  process?: string;
  role?: string[];
  notes?: string;
  credits?: { label: string; value: string }[];
  subImage?: { src: ImageMetadata; alt: string }[];
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

const works: Work[] = [
  {
    slug: 'astalift',
    title: 'Astalift Monom',
    date: '2024-01',
    tags: ['Landscape', 'Product Photo'],
    thumbnail: astaliftThumb,
    thumbnailAlt: 'Astalift Monom のキービジュアル',
    description: 'Astalift Monom のキャンペーン用に撮影したビジュアルです。',
    category: 'Snap',
    concept: '商品の世界観や撮影コンセプトなど、このビジュアルを通じて伝えたいストーリーを記載します。',
    process: 'ロケーションリサーチからライティング設計、カラーグレーディングまでのプロセスを簡潔にまとめます。',
    role: ['Photography', 'Retouch', 'Direction'],
    notes: '撮影当日のコンディションや、印象的だったポイントなどを自由にメモできます。',
    credits: [
      { label: 'クライアント', value: 'Fujifilm ' },
      { label: '企画・制作進行', value: '-' },
      { label: 'ロケーション', value: '-' },
    ],
    subImage: [
      { src: subImageBg, alt: '田舎の風景' },
      { src: subImageBg, alt: '田舎の風景' },
    ],
  },
  {
    slug: 'astalift2',
    title: 'Astalift Monom',
    date: '2024-01',
    tags: ['Interior', 'Portrait'],
    thumbnail: subImageBg,
    thumbnailAlt: 'Astalift Monom のキービジュアル',
    description: 'Astalift Monom のキャンペーン用に撮影したビジュアルです。',
    category: 'editorial',
    concept: '商品の世界観や撮影コンセプトなど、このビジュアルを通じて伝えたいストーリーを記載します。',
    process: 'ロケーションリサーチからライティング設計、カラーグレーディングまでのプロセスを簡潔にまとめます。',
    role: ['Photography', 'Retouch', 'Direction'],
    notes: '撮影当日のコンディションや、印象的だったポイントなどを自由にメモできます。',
    credits: [
      { label: 'クライアント', value: 'Fujifilm ' },
      { label: '企画・制作進行', value: '-' },
      { label: 'ロケーション', value: '-' },
    ],
    subImage: [
      { src: subImageBg, alt: '田舎の風景' },
      { src: subImageBg, alt: '田舎の風景' },
    ],
  },
];

// 作品データをすべて取得（アーカイブページなど一覧用）
export function getAllWorks(): Work[] {
  return works;
}

// slug（URL）から 1 件の作品データを取得（シングルページ用）
export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}
