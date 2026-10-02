import type { Metadata } from "next";
import Link from "next/link";
import { clsx } from "clsx";
import { ActionButton } from "@/app/components/admin/action-button";
import {
  BlogAgentSettingsForm,
  RefreshWhileRunning,
  WritePostNowForm,
} from "@/app/components/admin/blog-agent-forms";
import { Empty, PageHeading } from "@/app/components/admin/ui";
import { setBlogAgentEnabled } from "@/app/lib/admin/blog-agent-actions";
import { requireSuperadmin } from "@/app/lib/admin/guard";
import {
  EARLIEST_SLOT,
  LATEST_SLOT,
  STALE_AFTER_MS,
  TIME_ZONE,
  loadSettings,
  todaysSlot,
} from "@/app/lib/blog-agent/settings";
import { prisma } from "@/app/lib/db";

export const metadata: Metadata = { title: "Blog agent" };

/**
 * "Write a post now" runs the agent in `after`, which lives as long as this
 * page's function is allowed to — and a run is two minutes or so.
 */
export const maxDuration = 300;

const when = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const usd = (value: number) => `$${value.toFixed(2)}`;

type Shown = "running" | "published" | "skipped" | "failed" | "stalled";

export default async function BlogAgentPage() {
  await requireSuperadmin();

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const [settings, runs, month] = await Promise.all([
    loadSettings(),
    prisma.blogAgentRun.findMany({ orderBy: { startedAt: "desc" }, take: 30 }),
    prisma.blogAgentRun.aggregate({
      where: { startedAt: { gte: monthStart } },
      _sum: { costUsd: true },
      _count: { _all: true },
    }),
  ]);
  const publishedThisMonth = await prisma.blogAgentRun.count({
    where: { startedAt: { gte: monthStart }, status: "PUBLISHED" },
  });

  const shown = (run: (typeof runs)[number]): Shown =>
    run.status === "RUNNING"
      ? now.getTime() - run.startedAt.getTime() > STALE_AFTER_MS
        ? "stalled"
        : "running"
      : (run.status.toLowerCase() as Shown);
  const running = runs.some((run) => shown(run) === "running");

  // Today's slot until it has passed, then tomorrow's.
  const slotToday = todaysSlot(now, settings.publishTime);
  const nextPost =
    now < slotToday ? slotToday : todaysSlot(new Date(now.getTime() + 24 * 3_600_000), settings.publishTime);

  const config = [
    ["Claude API key", Boolean(process.env.ANTHROPIC_API_KEY)],
    ["Pixabay API key", Boolean(process.env.PIXABAY_API_KEY)],
    ["Cloudinary", Boolean(process.env.CLOUDINARY_CLOUD_NAME)],
    ["Cron secret", Boolean(process.env.CRON_SECRET)],
  ] as const;

  return (
    <>
      <RefreshWhileRunning running={running} />
      <PageHeading
        title="Blog agent"
        description="Writes one Knowledge Centre post a day from the week's news, with photos, and publishes it without review. Its posts are listed under Articles as “Multi Mulk Newsdesk”, where they can be edited or taken down like any other."
      />

      <section className="mb-6 grid gap-4 rounded-lg border border-ink/10 bg-white p-5 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <span
              className={clsx(
                "inline-block size-2.5 rounded-full",
                settings.enabled ? "bg-forest" : "bg-amber-500",
              )}
            />
            {settings.enabled ? "On" : "Paused"}
          </p>
          <p className="mt-1 text-[13px] text-ink/60">
            {settings.enabled
              ? `Next post: ${when.format(nextPost)} (Istanbul).`
              : "No posts are written until it is switched back on. “Write a post now” still works."}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            {config.map(([label, ok]) => (
              <li key={label} className={ok ? "text-ink/55" : "font-medium text-red-700"}>
                {ok ? "✓" : "✕"} {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          <ActionButton
            action={setBlogAgentEnabled.bind(null, !settings.enabled)}
            label={settings.enabled ? "Pause" : "Switch on"}
            busyLabel="Saving…"
            confirmLabel={settings.enabled ? "Pause daily posts" : undefined}
          />
          <WritePostNowForm disabled={running} />
        </div>
      </section>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Posts this month" value={String(publishedThisMonth)} />
        <Stat label="Spent this month" value={usd(month._sum.costUsd ?? 0)} />
        <Stat
          label="Average per post"
          value={publishedThisMonth ? usd((month._sum.costUsd ?? 0) / publishedThisMonth) : "—"}
        />
      </section>

      <section className="mb-8 rounded-lg border border-ink/10 bg-white p-5">
        <h2 className="mb-4 text-[15px] font-semibold text-ink">Settings</h2>
        <BlogAgentSettingsForm settings={settings} earliest={EARLIEST_SLOT} latest={LATEST_SLOT} />
      </section>

      <h2 className="mb-3 text-[15px] font-semibold text-ink">History</h2>
      {runs.length === 0 ? (
        <Empty>No runs yet. The first one happens at the next scheduled time, or press “Write a post now”.</Empty>
      ) : (
        <div className="grid gap-3">
          {runs.map((run) => {
            const state = shown(run);
            return (
              <article key={run.id} className="rounded-lg border border-ink/10 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-[12px] text-ink/55">
                      <RunPill state={state} />
                      {when.format(run.startedAt)} ·{" "}
                      {run.trigger === "CRON" ? "Scheduled" : "Started by hand"}
                    </p>
                    {run.title ? (
                      <h3 className="mt-1.5 text-[14px] font-semibold text-ink">{run.title}</h3>
                    ) : null}
                    {run.detail ? (
                      <p
                        className={clsx(
                          "mt-1 text-[13px]",
                          state === "failed" ? "text-red-700" : "text-ink/60",
                        )}
                      >
                        {run.detail}
                      </p>
                    ) : state === "stalled" ? (
                      <p className="mt-1 text-[13px] text-red-700">
                        Stopped without finishing — most likely cut off at the five-minute limit. Nothing was published.
                      </p>
                    ) : null}
                    {run.publishAt && state === "published" ? (
                      <p className="mt-1 text-[12px] text-ink/55">
                        {run.publishAt > now ? "Goes live" : "Went live"} {when.format(run.publishAt)}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[12px]">
                    {run.costUsd != null ? (
                      <span className="text-ink/55">
                        {usd(run.costUsd)} · {run.searches ?? 0} searches · {run.fetches ?? 0} pages
                      </span>
                    ) : null}
                    {run.slug ? (
                      <Link
                        href={`/en/knowledge/${run.slug}`}
                        target="_blank"
                        className="text-forest underline underline-offset-2"
                      >
                        View
                      </Link>
                    ) : null}
                    {run.articleId ? (
                      <Link
                        href={`/admin/articles/${run.articleId}`}
                        className="text-forest underline underline-offset-2"
                      >
                        Edit
                      </Link>
                    ) : null}
                  </div>
                </div>

                {run.log.length ? (
                  <details className="mt-3" open={state === "running"}>
                    <summary className="cursor-pointer text-[12px] text-ink/55 hover:text-ink">
                      What it did ({run.log.length} steps)
                    </summary>
                    <pre className="mt-2 max-h-[260px] overflow-auto rounded-md bg-ink/[0.03] p-3 text-[11px] leading-[18px] whitespace-pre-wrap text-ink/70">
                      {run.log.join("\n")}
                    </pre>
                  </details>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4">
      <p className="text-[12px] text-ink/55">{label}</p>
      <p className="mt-1 text-[20px] font-semibold text-ink">{value}</p>
    </div>
  );
}

function RunPill({ state }: { state: Shown }) {
  const label = {
    running: "Writing…",
    published: "Published",
    skipped: "Skipped",
    failed: "Failed",
    stalled: "Timed out",
  }[state];
  return (
    <span
      className={clsx(
        "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium tracking-[0.04em] uppercase",
        state === "running" && "bg-sky-100 text-sky-800",
        state === "published" && "bg-forest/10 text-forest",
        state === "skipped" && "bg-ink/8 text-ink/60",
        (state === "failed" || state === "stalled") && "bg-red-100 text-red-800",
      )}
    >
      {label}
    </span>
  );
}
