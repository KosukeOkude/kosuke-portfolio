import { getImage } from "astro:assets";
import type { Work, WorkForClient } from '@/data/works';

export async function toWorkForClient(work:Work):Promise<WorkForClient> {
    const { src } = await getImage({
        src: work.thumbnail,
        width: 560,
        height: 640,
        format:'avif'
    });
  return {
    slug: work.slug,
    title: work.title,
    date: work.date,
    tags: work.tags,
    thumbnailUrl: src,
    thumbnailAlt: work.thumbnailAlt,
    category: work.category,
  }
}