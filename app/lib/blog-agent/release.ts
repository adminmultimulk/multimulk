import { revalidatePath, revalidateTag } from "next/cache";
import { ARTICLES_TAG } from "@/app/lib/cms/tags";
import type { DailyPostResult } from "./run";

/**
 * Pushes a post that went up immediately out to the Knowledge Centre, as the
 * dashboard does on publish. One scheduled for later needs nothing: the
 * five-minute revalidation the site already runs on releases it at its time.
 */
export function release(result: DailyPostResult) {
  if (result.status !== "published" || result.publishAt.getTime() > Date.now()) return;
  revalidateTag(ARTICLES_TAG, "max");
  revalidatePath("/[lang]/knowledge", "page");
  revalidatePath("/[lang]", "page");
}
