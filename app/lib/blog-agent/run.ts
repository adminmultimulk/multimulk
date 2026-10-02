/**
 * One day's post, start to finish: the guard against a second one, the brief,
 * the agent, and the publish.
 *
 * Shared by the three ways in: the daily Vercel Cron at /api/cron/blog-agent,
 * the "Write a post now" button at /admin/blog-agent, and `npm run blog:agent`
 * by hand. The slot is kept by the site, not by the cron: the article is saved
 * as published with a future `publishedAt`, and `cmsArticles` withholds it
 * until then — so it does not matter where in its hour Vercel's scheduler
 * fires, only that it fires before the slot.
 *
 * Every real run leaves a `BlogAgentRun` row — published, skipped or failed —
 * which is what the history at /admin/blog-agent lists. A dry run leaves
 * nothing, because it changes nothing.
 */

import type { BlogAgentTrigger, Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { allArticles } from "@/app/lib/knowledge";
import { allRoutePaths } from "@/app/lib/routes";
import { runBlogAgent, type Draft, type RunStats } from "./agent";
import { AGENT_USERNAME, publishDraft } from "./publish";
import type { RecentPiece } from "./prompt";
import { loadSettings, todaysSlot } from "./settings";

export type DailyPostResult =
  | { status: "skipped"; reason: string }
  | { status: "dry-run"; draft: Draft; stats: RunStats; publishAt: Date }
  | {
      status: "published";
      articleId: string;
      slug: string;
      title: string;
      stats: RunStats;
      publishAt: Date;
    };

type Options = {
  /** The cron respects the pause switch; a person pressing the button does not. */
  trigger: BlogAgentTrigger;
  /** A run row created by the caller, so it is listed before the agent starts. */
  runId?: string;
  startedById?: string;
  /** Publish the moment it is written rather than at the slot. */
  now?: boolean;
  /** Write another even if today already has one. */
  force?: boolean;
  /** Write it and return it; upload and save nothing. */
  dryRun?: boolean;
  /** Epoch ms by which the agent must be finished; see `runBlogAgent`. */
  deadline?: number;
  log?: (line: string) => void;
};

export async function runDailyPost(options: Options): Promise<DailyPostResult> {
  const { trigger, startedById, dryRun, log: print = console.log } = options;
  const id = dryRun
    ? null
    : (options.runId ??
      (await prisma.blogAgentRun.create({ data: { trigger, startedById }, select: { id: true } })).id);

  // Each line is printed and appended to the run's log as it happens, so the
  // admin page can show a run in progress. Chained so the lines stay in order,
  // and a failed write loses a log line rather than the run.
  let saving = Promise.resolve();
  const log = (line: string) => {
    print(line);
    if (id)
      saving = saving
        .then(() => prisma.blogAgentRun.update({ where: { id }, data: { log: { push: line.trim() } } }))
        .then(
          () => undefined,
          () => undefined,
        );
  };
  const finish = async (data: Prisma.BlogAgentRunUpdateInput) => {
    await saving;
    if (id) await prisma.blogAgentRun.update({ where: { id }, data: { ...data, finishedAt: new Date() } });
  };

  try {
    const result = await writePost({ ...options, log });
    if (result.status === "skipped") await finish({ status: "SKIPPED", detail: result.reason });
    if (result.status === "published")
      await finish({
        status: "PUBLISHED",
        articleId: result.articleId,
        slug: result.slug,
        title: result.title,
        publishAt: result.publishAt,
        costUsd: result.stats.estimatedUsd,
        searches: result.stats.webSearches,
        fetches: result.stats.webFetches,
      });
    return result;
  } catch (error) {
    await finish({ status: "FAILED", detail: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}

async function writePost({
  trigger,
  now: publishNow = false,
  force = false,
  dryRun = false,
  deadline,
  log,
}: Options & { log: (line: string) => void }): Promise<DailyPostResult> {
  const settings = await loadSettings();
  if (trigger === "CRON" && !settings.enabled) {
    log("Paused in the dashboard; nothing written.");
    return { status: "skipped", reason: "Paused" };
  }

  const now = new Date();
  const slot = todaysSlot(now, settings.publishTime);
  // Missed the slot (a late run, the button): publish on completion.
  const publishAt = publishNow || slot <= now ? now : slot;
  log(`Publishing at ${publishAt.toISOString()}${dryRun ? " (dry run)" : ""}`);

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
      return { status: "skipped", reason: `Today's post already exists: /knowledge/${already.slug}` };
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

  const { draft, stats } = await runBlogAgent({
    publishAt,
    recent,
    internalPaths,
    linkable,
    budgetUsd: settings.budgetUsd,
    focus: settings.focus,
    deadline,
    log,
  });
  log(
    `${stats.turns} turns · ${stats.webSearches} searches · ${stats.webFetches} fetches · ` +
      `${stats.inputTokens + stats.cacheWriteTokens + stats.cacheReadTokens} input / ${stats.outputTokens} output tokens · ~$${stats.estimatedUsd.toFixed(2)}`,
  );

  if (dryRun) return { status: "dry-run", draft, stats, publishAt };

  const article = await publishDraft(draft, publishAt);
  log(`Published "${draft.title}" → /knowledge/${article.slug}`);
  return {
    status: "published",
    articleId: article.id,
    slug: article.slug,
    title: draft.title,
    stats,
    publishAt,
  };
}
