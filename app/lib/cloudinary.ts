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
 * next to whatever else it is used for.
 */
const FOLDER = process.env.CLOUDINARY_FOLDER || "multimulk/properties";

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
export function signUpload(resourceType: ResourceType): UploadTicket {
  if (!cloudinaryConfigured) {
    throw new CloudinaryError(
      "Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder: FOLDER, timestamp: String(timestamp) };
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return {
    endpoint: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    apiKey: apiKey!,
    timestamp,
    signature: createHash("sha1").update(payload + apiSecret).digest("hex"),
    folder: FOLDER,
  };
}
