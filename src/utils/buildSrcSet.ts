/**
 * Sanity CDN の画像 URL に対して srcset 文字列を生成するユーティリティ。
 * データ層が付与した ?w= と ?h= を上書きし、指定幅のリストで srcset を返す。
 *
 * @param url    - Sanity の urlFor(asset).width(n).auto("format").url() の戻り値
 * @param widths - srcset に含める幅のリスト（例: [400, 800, 1200]）
 */
export function buildSrcSet(url: string, widths: number[]): string {
  if (!url) return "";
  return widths
    .map((w) => {
      const u = new URL(url);
      u.searchParams.set("w", String(w));
      u.searchParams.delete("h");
      return `${u.toString()} ${w}w`;
    })
    .join(", ");
}
