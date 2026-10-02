/**
 * Stock photography for the blog agent, from Pixabay.
 *
 * A stock library rather than an image search engine because its licence is
 * the one that fits a daily automated post: free for commercial use, no
 * attribution required, and downloading to our own host expected — Pixabay's
 * API terms forbid permanent hotlinking, and the article body only renders
 * figures from Cloudinary anyway (see `isFigureSource`). A photo lifted from
 * a news site would be somebody else's copyright on our page.
 *
 * Credit is not required, but every figure the agent places names the
 * photographer and Pixabay in its caption all the same.
 */

const key = process.env.PIXABAY_API_KEY;

export type Photo = {
  id: number;
  width: number;
  height: number;
  /** Pixabay's tags — there is no description — as a fallback alt text. */
  alt: string;
  photographer: string;
  photographerUrl: string;
  /** 340px wide: enough for the model to judge, cheap to send. */
  preview: string;
  /**
   * 1280px wide: what is copied to Cloudinary. A signed link that Pixabay
   * expires after a day, which is fine — it is used minutes after the search.
   */
  full: string;
};

type PixabayResponse = {
  hits: {
    id: number;
    imageWidth: number;
    imageHeight: number;
    tags: string;
    user: string;
    user_id: number;
    webformatURL: string;
    largeImageURL: string;
  }[];
};

export async function searchPhotos(query: string, count = 6): Promise<Photo[]> {
  if (!key) throw new Error("PIXABAY_API_KEY is not set.");

  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", key);
  url.searchParams.set("q", query.slice(0, 100));
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("orientation", "horizontal");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("min_width", "1280");
  url.searchParams.set("per_page", String(Math.max(3, count)));

  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Pixabay search failed: ${response.status} ${await response.text()}`);

  const { hits } = (await response.json()) as PixabayResponse;
  return hits.slice(0, count).map((hit) => ({
    id: hit.id,
    width: hit.imageWidth,
    height: hit.imageHeight,
    alt: hit.tags,
    photographer: hit.user,
    photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
    // Pixabay serves the same image at 180, 340, 640 and 960 by suffix.
    preview: hit.webformatURL.replace("_640.", "_340."),
    full: hit.largeImageURL,
  }));
}

/** The preview as base64, so the model sees it without fetching it itself. */
export async function previewData(
  photo: Photo,
): Promise<{ data: string; mediaType: "image/jpeg" | "image/png" | "image/webp" } | null> {
  try {
    const response = await fetch(photo.preview);
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    const mediaType = type.includes("png")
      ? "image/png"
      : type.includes("webp")
        ? "image/webp"
        : "image/jpeg";
    return {
      data: Buffer.from(await response.arrayBuffer()).toString("base64"),
      mediaType,
    };
  } catch {
    return null;
  }
}
