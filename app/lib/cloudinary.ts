/**
 * Cloudinary: where the dashboard's photography and brochures are kept.
 *
 * The site's own imagery ships in `public/`, which is right for content that
 * belongs to the repository. A lister adding a unit at eleven at night cannot
 * commit a file, so anything uploaded through the dashboard goes here instead.
 *
 * Uploads are **signed and direct**. The browser asks this server for a
 * signature, then posts the file straight to Cloudinary: the API secret never
 * leaves the server, and a 40MB brochure never travels through a Server
 * Action. What comes back is a URL, and a URL is all the database stores.
 *
 * Unconfigured, `cloudinaryConfigured` is false and the dashboard says so
 * rather than offering a file picker that cannot work — the fields still take
 * a path under `/public`, which is how the inventory that ships with the site
 * is written.
 */

import "server-only";
import { createHash } from "node:crypto";

export const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const cloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

/**
 * Cloudinary sorts everything under one prefix, so the account stays legible
 * next to whatever else it is used for — and a prefix per kind, so the
 * photography of a hundred units is not shuffled in with article artwork.
 */
export type UploadKind = "property" | "article";

const folders: Record<UploadKind, string> = {
  property: process.env.CLOUDINARY_FOLDER || "multimulk/properties",
  article: process.env.CLOUDINARY_ARTICLE_FOLDER || "multimulk/articles",
};

/**
 * `image` handles the photography and gives us Cloudinary's transformations.
 * A brochure goes up as `raw`, which delivers the bytes as they were uploaded
 * rather than putting a PDF through the image pipeline.
 *
 * `raw` does *not* exempt a brochure from the account's restricted media
 * types: with PDF restricted — the default on a new product environment — a
 * `raw/upload/….pdf` is served as `401 … x-cld-error: deny or ACL failure`
 * while a `.txt` beside it is served as 200. Nothing here can work around
 * that; it is unchecked once, per environment, under Settings → Security.
 */
export type ResourceType = "image" | "raw";

/** Everything the browser needs to upload one file, and nothing more. */
export type UploadTicket = {
  endpoint: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
};

export class CloudinaryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryError";
  }
}

/**
 * Signs one upload.
 *
 * Cloudinary's scheme: sort the parameters being signed by name, join them as
 * a query string, append the API secret, and SHA-1 the result. `file`,
 * `api_key` and `resource_type` are excluded by the API's own rules —
 * `resource_type` travels in the URL path rather than the body.
 *
 * The signature is worth minting per upload rather than handing the browser a
 * long-lived unsigned preset: an unsigned preset is a public write endpoint
 * for as long as it exists, and this one is only good for an hour and only
 * into this folder.
 */
export function signUpload(
  resourceType: ResourceType,
  kind: UploadKind = "property",
): UploadTicket {
  if (!cloudinaryConfigured) {
    throw new CloudinaryError(
      "Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    );
  }

  const folder = folders[kind];
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, timestamp: String(timestamp) };
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return {
    endpoint: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    apiKey: apiKey!,
    timestamp,
    signature: createHash("sha1").update(payload + apiSecret).digest("hex"),
    folder,
  };
}

/**
 * Copies an image Cloudinary can fetch for itself into the article folder.
 *
 * The server-side counterpart of `signUpload`, for the one caller with no
 * browser in the loop: the blog agent, which picks stock photography by URL.
 * Cloudinary pulls the file from `source` directly, so the bytes never pass
 * through this process either. Same signing scheme as above, with `public_id`
 * among the signed parameters so a re-run of the same day lands on the same
 * asset instead of a second copy.
 */
export async function uploadFromUrl(
  source: string,
  publicId: string,
  kind: UploadKind = "article",
): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new CloudinaryError(
      "Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    );
  }

  const params = {
    folder: folders[kind],
    overwrite: "true",
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const form = new FormData();
  for (const [key, value] of Object.entries(params)) form.set(key, value);
  form.set("file", source);
  form.set("api_key", apiKey!);
  form.set("signature", createHash("sha1").update(payload + apiSecret).digest("hex"));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  const result = (await response.json()) as {
    secure_url?: string;
    error?: { message: string };
  };
  if (!response.ok || !result.secure_url) {
    throw new CloudinaryError(
      `Cloudinary refused ${source}: ${result.error?.message ?? response.status}`,
    );
  }
  return result.secure_url;
}

/**
 * A delivery URL with a transformation applied, e.g. `c_fill,ar_3:2,w_1200`.
 * Cloudinary derives it on first request; nothing is stored twice.
 */
export function transformed(url: string, transformation: string): string {
  return url.replace("/image/upload/", `/image/upload/${transformation}/`);
}
