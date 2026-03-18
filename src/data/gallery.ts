import galleryBackgroundImage from '@/assets/images/gallery-background-image.jpg';
import galleryCategoryImage_1 from '@/assets/images/gallery-category-image-1.jpg';
import galleryCategoryImage_2 from '@/assets/images/gallery-category-image-2.jpg';
import galleryCategoryImage_3 from '@/assets/images/gallery-category-image-3.jpg';
import galleryCategoryImage_4 from '@/assets/images/gallery-category-image-4.jpg';
import galleryCategoryImage_5 from '@/assets/images/gallery-category-image-5.jpg';
import galleryCategoryImage_6 from '@/assets/images/gallery-category-image-6.jpg';



export const galleryPageConfig = {
    backgroundImage: galleryBackgroundImage,
    backgroundAlt: '木陰でピース'
}

export interface GalleryCategory {
    slug: string;
    title: string;
    imageUrl: string;
    imageAlt: string;
}

export const galleryCategories:GalleryCategory[] = [
    {
        slug: 'portrait',
        title: 'Portrait',
        imageUrl: galleryCategoryImage_1.src ?? galleryCategoryImage_1,
        imageAlt: 'Portrait gallery cover image'
    },
    {
        slug: 'countryside',
        title: 'Countryside',
        imageUrl: galleryCategoryImage_2.src ?? galleryCategoryImage_2,
        imageAlt: 'Countryside gallery cover image'
    },
    {
        slug: 'lifestyle',
        title: 'Lifestyle',
        imageUrl: galleryCategoryImage_3.src ?? galleryCategoryImage_3,
        imageAlt: 'Lifestyle gallery cover image',
    },
    {
    slug: 'architecture',
    title: 'Architecture',
    imageUrl: galleryCategoryImage_4.src ?? galleryCategoryImage_4,
    imageAlt: 'Architecture gallery cover image',
    },
    {
    slug: 'food',
    title: 'Food',
    imageUrl: galleryCategoryImage_5.src ?? galleryCategoryImage_5,
    imageAlt: 'Food gallery cover image',
    },
    {
    slug: 'city',
    title: 'City',
    imageUrl: galleryCategoryImage_6.src ?? galleryCategoryImage_6,
    imageAlt: 'City gallery cover image',
    },
]

export function  getGalleryCategories(): GalleryCategory[] {
    return galleryCategories;
}

export function getGalleryCategoryBySlug(slug: string): GalleryCategory | null {
  return galleryCategories.find((category) => category.slug === slug) ?? null;
}