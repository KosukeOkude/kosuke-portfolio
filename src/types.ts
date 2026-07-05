export type DateSortOrder = "date-desc" | "date-asc";

const DATE_SORT_ORDERS = ["date-desc", "date-asc"] as const;
export function isDateSortOrder(value: string): value is DateSortOrder {
  return (DATE_SORT_ORDERS as readonly string[]).includes(value);
}

export type LightboxItem = {
  src: string;
  alt?: string;
  hiSrc?: string;
};

export type RunGlobalRevealOptions = {
  /** true のとき、client:* 島（astro-island）内の [data-reveal] をこの回では対象外にする */
  skipInsideAstroIslands?: boolean;
};

export type YoutubeVideo = {
  type: "youtube";
  youtubeUrl: string;
};

export type DetailSubImage = {
  src: string;
  lightboxSrc: string;
  alt?: string;
};

export type DetailImageSource = {
  mainImageUrl: string;
  mainImageLightboxUrl: string;
  mainImageAlt?: string;
  subImages?: DetailSubImage[];
};
