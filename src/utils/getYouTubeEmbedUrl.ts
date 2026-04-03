/**
 * YouTube の入力URLから "embed用URL" 埋め込みに変換します。
 *
 * 目的:
 * - `https://www.youtube.com/watch?v=VIDEO_ID` のようなURLを
 *   `https://www.youtube-nocookie.com/embed/VIDEO_ID` に変換する
 *
 * 戻り値のルール:
 * - `VIDEO_ID` を抽出できた場合: embed URL を返す
 * - 抽出できない / URLとして解釈できない場合: `inputUrl` をそのまま返す
 *
 * 注意:
 * - 返した `inputUrl` がそもそもembed用ではないケースもあり得るため、
 *   呼び出し側では `iframe src` にそのまま入れる前提になっている点に注意してください。
 */
export function getYouTubeEmbedUrl(inputUrl: string) {
  try {
    const url = new URL(inputUrl);

    // `www.` は無視してホスト名だけ比較できるようにする
    const host = url.hostname.replace(/^www\./, "");

    // まずは `?v=VIDEO_ID` 形式を最優先で取得する
    let videoId: string | null = url.searchParams.get("v");

    // 対応(現状の実装):
    // - youtube.com/embed/<id> 形式
    // - それ以外は "v パラメータ" が取れた場合のみ embed 化
    //
    // なお、下の "youtube/<id>" 分岐は host が "youtube" の場合にのみ成立します。
    // 一般的な `www.youtube.com` だと host は通常 "youtube.com" になるため、
    // この分岐が効く入力は限定的です（必要ならここは拡張できます）。

    // youtu.be/<id> の想定（例: https://youtu.be/VIDEO_ID）
    if (!videoId && host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    // youtube.com/embed/<id> 形式
    if (!videoId && url.pathname.startsWith("/embed/")) {
      // `/embed/<id>` の `<id>` 部分だけ切り出す
      videoId = url.pathname.split("/embed/")[1]?.split("/")[0] ?? null;
    }

    // VIDEO_ID が取れない場合はフォールバックとして入力URLを返す
    if (!videoId) return inputUrl;

    // `youtube.com` よりプライバシー寄りの nocookie を推奨
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    // `new URL(inputUrl)` が失敗した場合もフォールバック
    return inputUrl;
  }
}
