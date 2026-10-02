/**
 * One day's post, start to finish: the guard against a second one, the brief,
 * the agent, and the publish.
 *
 * Shared by the two ways in: the daily Vercel Cron at /api/cron/blog-agent,
 * and `npm run blog:agent` for a run by hand. The slot is kept by the site,
 * not by the cron: the article is saved as published with a future
 * `publishedAt`, and `cmsArticles` withholds it until then — so it does not
 * matter where in its hour Vercel's scheduler fires, only that it fires before
 * the slot.
 */

import { prisma } from "@/app/lib/db";
import { allArticles } from "@/app/lib/knowledge";
import { allRoutePaths } from "@/app/lib/routes";
import { runBlogAgent, type Draft, type RunStats } from "./agent";
import { AGENT_USERNAME, publishDraft } from "./publish";
import type { RecentPiece } from "./prompt";

/** "09:00" in the site's home time zone. */
const SLOT = process.env.BLOG_AGENT_PUBLISH_TIME || "09:00";
const TIME_ZONE = process.env.BLOG_AGENT_TIMEZONE || "Europe/Istanbul";

/** Minutes `zone` is ahead of UTC at `at`. */
function offsetMinutes(at: Date, zone: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(at)
      .map((part) => [part.type, part.value]),
  );
  const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return Math.round((local - at.getTime()) / 60_000);
}

/** Today's slot in `TIME_ZONE`, as an instant. */
function todaysSlot(now: Date): Date {
  const [hour, minute] = SLOT.split(":").map(Number);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now); // YYYY-MM-DD
  const [y, m, d] = day.split("-").map(Number);
  const naive = Date.UTC(y, m - 1, d, hour, minute);
  return new Date(naive - offsetMinutes(new Date(naive), TIME_ZONE) * 60_000);
}

export type DailyPostResult =
  | { status: "skipped"; slug: string }
  | { status: "dry-run"; draft: Draft; stats: RunStats; publishAt: Date }
  | { status: "published"; slug: string; title: string; stats: RunStats; publishAt: Date };

export async function runDailyPost({
  now: publishNow = false,
  force = false,
  dryRun = false,
  deadline,
  log = console.log,
}: {
  /** Publish the moment it is written rather than at the slot. */
  now?: boolean;
  /** Write another even if today already has one. */
  force?: boolean;
  /** Write it and return it; upload and save nothing. */
  dryRun?: boolean;
  /** Epoch ms by which the agent must be finished; see `runBlogAgent`. */
  deadline?: number;
  log?: (line: string) => void;
} = {}): Promise<DailyPostResult> {
  const now = new Date();
  const slot = todaysSlot(now);
  // Missed the slot (a late run, a manual re-run): publish on completion.
  const publishAt = publishNow || slot <= now ? now : slot;
  log(`Blog agent — publishing at ${publishAt.toISOString()}${dryRun ? " (dry run)" : ""}`);

  // One a day. A cron that fires twice must not put two posts up.
  if (!force) {
    const author = await prisma.user.findUnique({
      where: { username: AGENT_USERNAME },
      select: { id: true },
    });
    const dayStart = new Date(slot.getTime() - 12 * 3_600_000);
    const already = author
      ? await prisma.article.findFirst({
          where: { authorId: author.id, publishedAt: { gte: dayStart, lt: new Date(dayStart.getTime() + 24 * 3_600_000) } },
          select: { slug: true },
        })
      : null;
    if (already) {
      log(`Today's post already exists (/knowledge/${already.slug}).`);
      return { status: "skipped", slug: already.slug };
    }
  }

  const fromDb = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 25,
    select: { title: true, slug: true, publishedAt: true },
  });
  const recent: RecentPiece[] = [
    ...fromDb.map((row) => ({
      title: row.title,
      date: (row.publishedAt ?? now).toISOString().slice(0, 10),
      path: `/knowledge/${row.slug}`,
    })),
    ...allArticles.map((article) => ({ title: article.title, date: article.date, path: `/knowledge/${article.slug}` })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  // Offered to the model: the site's landing pages, without the archive's
  // hundred article URLs, the property listings or the legal small print.
  // Accepted from it: any path on the site, so a link to a recent piece or a
  // listing it found on its own is not refused.
  const routes = allRoutePaths().filter((route) => !route.path.includes(":"));
  const internalPaths = routes
    .filter((route) => !["article", "development", "legal", "author", "documents", "partners"].includes(route.id))
    .map((route) => route.path);
  const linkable = new Set([
    ...routes.map((route) => route.path),
    ...fromDb.map((row) => `/knowledge/${row.slug}`),
  ]);

  const { draft, stats } = await runBlogAgent({ publishAt, recent, internalPaths, linkable, deadline, log });
  log(
    `${stats.turns} turns · ${stats.webSearches} searches · ${stats.webFetches} fetches · ` +
      `${stats.inputTokens + stats.cacheWriteTokens + stats.cacheReadTokens} input / ${stats.outputTokens} output tokens · ~$${stats.estimatedUsd.toFixed(2)}`,
  );

  if (dryRun) return { status: "dry-run", draft, stats, publishAt };

  const article = await publishDraft(draft, publishAt);
  log(`Published "${draft.title}" → /knowledge/${article.slug} at ${publishAt.toISOString()}`);
  return { status: "published", slug: article.slug, title: draft.title, stats, publishAt };
}
