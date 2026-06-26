export function getYouTubeVideoId(inputUrl: string): string | null {
  try {
    const url = new URL(inputUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    const watchId = url.searchParams.get("v");
    if (watchId) return watchId;

    const pathMatch = url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
    if (pathMatch) return pathMatch[1];

    return null;
  } catch {
    return null;
  }
}
