"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { ARTICLES_TAG } from "@/app/lib/cms/tags";
import { toBlocks } from "@/app/lib/rich-text";
import { requireArticleAccess, type ActionState } from "./guard";
import {
  checkbox,
  checkBody,
  checkImage,
  checkSlug,
  checkTopics,
  field,
  reservedArticleSlugs,
  slugify,
  when,
} from "./validate";

/**
 * Everything a published article change has to reach.
 *
 * The tag covers the merged reader in `app/lib/cms/articles.ts`; the two paths
 * cover the full-route cache, which the tag does not touch — the Knowledge
 * Centre index and every article page are prerendered, and without this a
 * published piece would sit in the database with nothing rendering it.
 */
function publishedArticlesChanged() {
  updateTag(ARTICLES_TAG);
  revalidatePath("/[lang]/knowledge", "page");
  revalidatePath("/[lang]/knowledge/[slug]", "page");
  revalidatePath("/[lang]", "page");
}

/**
 * Creates or updates one article.
 *
 * Any editor may edit any article rather than only their own: this is a small
 * editorial team working on a shared queue, and a piece that cannot be
 * finished because the person who started it is away is a worse failure than
 * an unwanted edit, which the database keeps the author of either way.
 */
export async function saveArticle(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireArticleAccess();

  const id = field(form, "id") || null;
  const title = field(form, "title");
  const slug = field(form, "slug") || slugify(title);
  const excerpt = field(form, "excerpt");
  const body = toBlocks(field(form, "body"));
  const topics = form.getAll("topics").map(String);
  const category = field(form, "category") === "Press Media" ? "Press Media" : "Blog";
  const source = field(form, "source");
  const image = field(form, "image");
  const hero = field(form, "hero");
  const readMore = field(form, "readMore");
  const seoTitle = field(form, "seoTitle");
  const seoDescription = field(form, "seoDescription");
  const canonicalUrl = field(form, "canonicalUrl");
  const noindex = checkbox(form, "noindex");
  const filedAt = when(field(form, "date"));
  const publish = field(form, "intent") === "publish";

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "A headline is required.";
  if (title.length > 200) fieldErrors.title = "Keep the headline under 200 characters.";

  const slugError = checkSlug(slug);
  if (slugError) fieldErrors.slug = slugError;
  else if (reservedArticleSlugs.has(slug))
    fieldErrors.slug = "The site already publishes an article at this slug.";

  if (!excerpt) fieldErrors.excerpt = "A standfirst is required — it is the card copy and the meta description.";

  const bodyError = checkBody(body);
  if (bodyError) fieldErrors.body = bodyError;

  const topicError = checkTopics(topics);
  if (topicError) fieldErrors.topics = topicError;

  const imageError = checkImage(image, "The card image");
  if (imageError) fieldErrors.image = imageError;
  const heroError = checkImage(hero, "The banner image");
  if (heroError) fieldErrors.hero = heroError;

  if (readMore && !/^https?:\/\//.test(readMore) && !readMore.startsWith("/"))
    fieldErrors.readMore = 'Use a full https:// URL, or a path starting with "/".';

  if (seoTitle.length > 120)
    fieldErrors.seoTitle = "Keep the title tag under 120 characters.";
  if (seoDescription.length > 320)
    fieldErrors.seoDescription = "Keep the meta description under 320 characters.";

  // A canonical is a claim about which URL is the real one, so a relative path
  // cannot express it — a crawler on another host would resolve it to theirs.
  if (canonicalUrl && !/^https?:\/\//.test(canonicalUrl))
    fieldErrors.canonicalUrl = "A canonical must be a full https:// URL.";

  if (filedAt === "invalid") fieldErrors.date = "That is not a date.";

  // Publishing is the point at which the piece becomes a page, so the things a
  // page needs are only required here. A draft may be half-written.
  if (publish && !image)
    fieldErrors.image = "A published article needs a card image.";

  if (Object.keys(fieldErrors).length)
    return { fieldErrors, error: "Nothing was saved — see the fields marked below." };

  const existing = id
    ? await prisma.article.findUnique({ where: { id }, select: { publishedAt: true } })
    : null;
  if (id && !existing) return { error: "That article no longer exists." };

  const data = {
    slug,
    title,
    excerpt,
    body,
    topics,
    category,
    source: source || null,
    image: image || null,
    hero: hero || null,
    readMore: readMore || null,
    seoTitle: seoTitle || null,
    seoDescription: seoDescription || null,
    canonicalUrl: canonicalUrl || null,
    noindex,
    status: publish ? ("PUBLISHED" as const) : ("DRAFT" as const),
    // An explicit date wins, so a piece can be filed on the day it ran rather
    // than the day it was typed in — and so a future one schedules it, which
    // `cmsArticles` enforces by withholding anything not yet due. Otherwise:
    // the moment it first went live.
    publishedAt: filedAt instanceof Date
      ? filedAt
      : publish
        ? (existing?.publishedAt ?? new Date())
        : (existing?.publishedAt ?? null),
  };

  try {
    if (id) await prisma.article.update({ where: { id }, data });
    else await prisma.article.create({ data: { ...data, authorId: user.id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return { fieldErrors: { slug: "Another article already uses this slug." } };
    console.error("Could not save article:", error);
    return { error: "The database refused the change. Nothing was saved." };
  }

  publishedArticlesChanged();
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

/** Takes a published piece back to draft, which removes it from the site. */
export async function unpublishArticle(id: string): Promise<void> {
  await requireArticleAccess();
  await prisma.article.update({ where: { id }, data: { status: "DRAFT" } });
  publishedArticlesChanged();
  revalidatePath("/admin/articles");
}

/**
 * Deletes an article.
 *
 * Narrower than editing on purpose: an unwanted edit is visible in the piece
 * and can be typed back, and a deletion cannot. The author and a superadmin
 * are the two people who should be able to do it.
 */
export async function deleteArticle(id: string): Promise<void> {
  const user = await requireArticleAccess();
  const article = await prisma.article.findUnique({
    where: { id },
    select: { authorId: true },
  });
  if (!article) return;
  if (article.authorId !== user.id && user.role !== "SUPERADMIN")
    throw new Error("Only the author or a superadmin can delete this article.");

  await prisma.article.delete({ where: { id } });
  publishedArticlesChanged();
  revalidatePath("/admin/articles");
}
