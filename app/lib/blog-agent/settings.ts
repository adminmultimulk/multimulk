/**
 * The blog agent's settings: the row the superadmin edits at
 * /admin/blog-agent, with the environment as the fallback for a database that
 * has never had one saved.
 */

import { prisma } from "@/app/lib/db";

export type AgentSettings = {
  enabled: boolean;
  /** "HH:MM", Istanbul time. */
  publishTime: string;
  budgetUsd: number;
  /** Replaces the weekday rotation when set. */
  focus: string | null;
};

export const SETTINGS_KEY = "default";

/** Always Istanbul: the cron in `vercel.json` is set against it. */
export const TIME_ZONE = "Europe/Istanbul";

/**
 * The publish-time window.
 *
 * The cron is scheduled for 04:00 UTC and Vercel's Hobby scheduler fires
 * anywhere in that hour — 07:00 to 07:59 in Istanbul — and a run takes a few
 * minutes. A slot before 08:30 could fall before the post exists, so it is not
 * offered.
 */
export const EARLIEST_SLOT = "08:30";
export const LATEST_SLOT = "23:30";

/** Ten cents to two dollars; a run under ten cents cannot research anything. */
export const MIN_BUDGET = 0.1;
export const MAX_BUDGET = 2;

/**
 * How long a run may say "running" before it is taken to have died. A function
 * stopped at Vercel's limit never gets to mark its row; five minutes is that
 * limit, and ten leaves no doubt.
 */
export const STALE_AFTER_MS = 10 * 60_000;

export const defaults: AgentSettings = {
  enabled: true,
  publishTime: process.env.BLOG_AGENT_PUBLISH_TIME || "09:00",
  budgetUsd: Number(process.env.BLOG_AGENT_BUDGET_USD) || 0.5,
  focus: null,
};

export async function loadSettings(): Promise<AgentSettings> {
  const row = await prisma.blogAgentSettings.findUnique({ where: { key: SETTINGS_KEY } });
  if (!row) return defaults;
  return {
    enabled: row.enabled,
    publishTime: row.publishTime,
    budgetUsd: row.budgetUsd,
    focus: row.focus?.trim() || null,
  };
}

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

/** The `slot` ("HH:MM") in `TIME_ZONE` on the day `now` falls in, as an instant. */
export function todaysSlot(now: Date, slot: string): Date {
  const [hour, minute] = slot.split(":").map(Number);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now); // YYYY-MM-DD
  const [y, m, d] = day.split("-").map(Number);
  const naive = Date.UTC(y, m - 1, d, hour, minute);
  return new Date(naive - offsetMinutes(new Date(naive), TIME_ZONE) * 60_000);
}
