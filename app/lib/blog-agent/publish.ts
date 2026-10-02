/**
 * Turns an accepted draft into a published row.
 *
 * The photography is copied to Cloudinary first — the body only renders
 * figures from there — and the row is written last, so a failed upload leaves
 * nothing half-published on the site.
 */

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/db";
import { transformed, uploadFromUrl } from "@/app/lib/cloudinary";
import { PHOTO_FIGURE, type Draft } from "./agent";

/** The account the agent's pieces are filed under. */
export const AGENT_USERNAME = (process.env.BLOG_AGENT_USERNAME || "newsdesk").toLowerCase();
const DISPLAY_NAME = process.env.BLOG_AGENT_AUTHOR_NAME || "Multi Mulk Newsdesk";

/**
 * Finds or creates the agent's byline.
 *
 * Every article needs an author row, and the agent's writing should not wear a
 * real person's name. The account is created disabled with a password nobody
 * knows, so it can sign nothing in — it exists to be a byline. The name is
 * read from BLOG_AGENT_AUTHOR_NAME when the account is first created.
 */
export async function agentAuthor(): Promise<{ id: string }> {
  const existing = await prisma.user.findUnique({ where: { username: AGENT_USERNAME }, select: { id: true } });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      username: AGENT_USERNAME,
      name: DISPLAY_NAME,
      role: "EDITOR",
      active: false,
      passwordHash: await bcrypt.hash(randomBytes(32).toString("hex"), 10),
    },
    select: { id: true },
  });
}

/** Alt text and captions sit inside `![…](… "…")`, so neither may close it. */
const clean = (value: string) => value.replace(/[[\]]/g, "").replace(/"/g, "”").trim();

export async function publishDraft(
  draft: Draft,
  publishAt: Date,
): Promise<{ id: string; slug: string }> {
  const author = await agentAuthor();

  const coverUrl = await uploadFromUrl(draft.cover.photo.full, `${draft.slug}-cover`);

  let index = 0;
  const body: string[] = [];
  for (const block of draft.body) {
    const figure = PHOTO_FIGURE.exec(block.split("\n")[0]);
    if (!figure) {
      body.push(block);
      continue;
    }
    const photo = draft.photos.get(Number(figure[2]))!;
    const url = await uploadFromUrl(photo.full, `${draft.slug}-${++index}`);
    const alt = clean(figure[1] || photo.alt);
    const caption = clean(
      [figure[3]?.trim(), `Photo: ${photo.photographer} / Pixabay`].filter(Boolean).join(" · "),
    );
    body.push(`![${alt}](${transformed(url, "c_limit,w_1600")} "${caption}")`);
  }

  // Sources and the cover credit are written here rather than by the model,
  // so they are always present and always in the same shape.
  body.push(
    "## Sources",
    draft.sources.map((source) => `- [${source.title.replace(/[[\]]/g, "")}](${source.url})`).join("\n"),
    `*Cover photo: [${draft.cover.photo.photographer}](${draft.cover.photo.photographerUrl}) on [Pixabay](https://pixabay.com).*`,
  );

  const row = await prisma.article.create({
    data: {
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt,
      body,
      topics: draft.topics,
      category: draft.category,
      // Card ~3:2 and banner ~8:3, both cropped from the one upload around
      // whatever Cloudinary judges the subject to be.
      image: transformed(coverUrl, "c_fill,g_auto,ar_3:2,w_1200"),
      hero: transformed(coverUrl, "c_fill,g_auto,ar_8:3,w_2400"),
      seoTitle: draft.seoTitle,
      seoDescription: draft.seoDescription,
      status: "PUBLISHED",
      // In the future, normally: the site withholds a piece until its
      // publication time (see `cmsArticles`), which is what makes it appear
      // at nine o'clock rather than whenever the run happened to finish.
      publishedAt: publishAt,
      authorId: author.id,
    },
    select: { id: true, slug: true },
  });
  return row;
}
