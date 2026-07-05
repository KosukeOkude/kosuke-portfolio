import { urlFor } from "@/sanity/client";

type SanityAssetRef = { _ref?: string; _id?: string } | null | undefined;

/** Sanity 画像アセットから指定サイズの URL を生成する */
export function buildImageUrl(
  asset: SanityAssetRef,
  width: number,
  height?: number,
): string {
  const builder = urlFor(asset ?? undefined)?.width(width).auto("format");
  return (height !== undefined ? builder?.height(height) : builder)?.url() ?? "";
}

/** カテゴリ文字列を小文字・トリムで正規化する */
export function normalizeCategory(category: string | null | undefined): string {
  return (category ?? "").toLocaleLowerCase();
}

/** サブ画像配列をアーカイブ表示用に変換する */
export function buildSubImages(
  rawItems: { asset: SanityAssetRef; alt: string | null }[] | null | undefined,
  titleFallback: string,
): { src: string; lightboxSrc: string; alt: string }[] {
  return (rawItems ?? [])
    .filter(
      (s): s is { asset: NonNullable<SanityAssetRef>; alt: string | null } => !!s.asset,
    )
    .map((s, i) => ({
      src: buildImageUrl(s.asset, 1200),
      lightboxSrc: buildImageUrl(s.asset, 2000),
      alt: s.alt ?? `${titleFallback}-${i + 1}`,
    }));
}

/** YouTube 動画だけフィルタして返す */
export function filterYoutubeVideos(
  videos: { type: string; youtubeUrl: string }[] | null | undefined,
): { type: "youtube"; youtubeUrl: string }[] {
  return (videos ?? []).filter(
    (v): v is { type: "youtube"; youtubeUrl: string } =>
      v.type === "youtube" &&
      typeof v.youtubeUrl === "string" &&
      v.youtubeUrl.length > 0,
  );
}
