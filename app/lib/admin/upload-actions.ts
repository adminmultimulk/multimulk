"use server";

/**
 * The one thing an upload needs from the server: permission and a signature.
 *
 * The file itself never comes here. The browser asks for a ticket, posts the
 * bytes straight to Cloudinary, and sends back only the URL as an ordinary
 * form field — so a brochure the size of a brochure is not something this
 * application has to carry.
 */

import { requirePropertyAccess } from "./guard";
import {
  cloudinaryConfigured,
  signUpload,
  type ResourceType,
  type UploadTicket,
} from "@/app/lib/cloudinary";

export type UploadTicketResult =
  | { ok: true; ticket: UploadTicket }
  | { ok: false; error: string };

export async function requestUploadTicket(
  resourceType: ResourceType,
): Promise<UploadTicketResult> {
  // Same gate as saving a listing: signing an upload is a write, and an
  // unauthenticated one would be an open door into the media library.
  await requirePropertyAccess();

  if (!cloudinaryConfigured) {
    return {
      ok: false,
      error:
        "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, or paste a path under /public instead.",
    };
  }

  // A signature is minted per file rather than per form: the browser may sit
  // on a half-filled listing for an hour, and Cloudinary rejects a stale one.
  return { ok: true, ticket: signUpload(resourceType) };
}
