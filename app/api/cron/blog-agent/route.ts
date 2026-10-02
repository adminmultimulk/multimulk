import { release } from "@/app/lib/blog-agent/release";
import { runDailyPost } from "@/app/lib/blog-agent/run";

/**
 * The daily blog post, called by Vercel Cron (see `vercel.json`).
 *
 * Scheduled for 04:00 UTC — 07:00 in Istanbul — and Hobby's scheduler fires
 * somewhere in that hour, so the post is written well before its 09:00 slot
 * and saved as scheduled. The site releases it at nine; see `run.ts`.
 *
 * A run is two minutes or so of research and writing, against the five a
 * Hobby function is allowed. The agent is handed a deadline inside that, and
 * submits with what it has rather than being cut off with nothing saved.
 *
 * Vercel Cron does not retry. A failed day is listed with its error at
 * /admin/blog-agent, where "Write a post now" makes it up. Paused there, the
 * run is recorded as skipped and writes nothing.
 */

export const maxDuration = 300;
export const dynamic = "force-dynamic";

/** Vercel Cron sends this as a bearer token; anyone else gets a 401. */
const secret = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // Refused when unset rather than run openly: an open endpoint is a button
  // anybody can press to spend money and publish an article.
  if (!secret) {
    return Response.json(
      { ok: false, error: "CRON_SECRET is not set; the scheduled run is disabled." },
      { status: 503 },
    );
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const started = Date.now();
  try {
    const result = await runDailyPost({ trigger: "CRON", deadline: started + 250_000 });

    if (result.status === "skipped") return Response.json({ ok: true, skipped: result.reason });
    if (result.status !== "published") return Response.json({ ok: false }, { status: 500 });
    release(result);

    return Response.json({
      ok: true,
      slug: result.slug,
      title: result.title,
      publishAt: result.publishAt.toISOString(),
      costUsd: Number(result.stats.estimatedUsd.toFixed(2)),
      seconds: Math.round((Date.now() - started) / 1000),
    });
  } catch (error) {
    console.error("[blog-agent] run failed:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
