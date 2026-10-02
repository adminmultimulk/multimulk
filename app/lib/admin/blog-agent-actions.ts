"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { prisma } from "@/app/lib/db";
import { release } from "@/app/lib/blog-agent/release";
import { runDailyPost } from "@/app/lib/blog-agent/run";
import {
  EARLIEST_SLOT,
  LATEST_SLOT,
  MAX_BUDGET,
  MIN_BUDGET,
  SETTINGS_KEY,
  STALE_AFTER_MS,
  defaults,
} from "@/app/lib/blog-agent/settings";
import { requireSuperadmin, type ActionState } from "./guard";
import { field } from "./validate";

/**
 * The blog agent's controls. Superadmin only, all of them: the agent
 * publishes to the live site without a human reading it first, and spends
 * money doing so, so the switch, the budget and the button sit with the one
 * account that also holds the keys to everybody else's.
 */

const PAGE = "/admin/blog-agent";

export async function saveBlogAgentSettings(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await requireSuperadmin();

  const publishTime = field(form, "publishTime");
  const budgetUsd = Number(field(form, "budgetUsd"));
  const focus = field(form, "focus");

  const fieldErrors: Record<string, string> = {};
  // "HH:MM" compares correctly as a string, which is why it is stored as one.
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(publishTime))
    fieldErrors.publishTime = "Use a time like 09:00.";
  else if (publishTime < EARLIEST_SLOT || publishTime > LATEST_SLOT)
    fieldErrors.publishTime = `Pick a time between ${EARLIEST_SLOT} and ${LATEST_SLOT}. The agent writes between 07:00 and 08:00, so an earlier slot could arrive before the post.`;
  if (!Number.isFinite(budgetUsd) || budgetUsd < MIN_BUDGET || budgetUsd > MAX_BUDGET)
    fieldErrors.budgetUsd = `Between $${MIN_BUDGET.toFixed(2)} and $${MAX_BUDGET.toFixed(2)}.`;
  if (focus.length > 600) fieldErrors.focus = "Keep it under 600 characters.";

  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const data = { publishTime, budgetUsd, focus: focus || null, updatedById: admin.id };
  await prisma.blogAgentSettings.upsert({
    where: { key: SETTINGS_KEY },
    create: { key: SETTINGS_KEY, enabled: defaults.enabled, ...data },
    update: data,
  });

  revalidatePath(PAGE);
  return { success: "Saved. The next run uses these settings." };
}

export async function setBlogAgentEnabled(enabled: boolean): Promise<void> {
  const admin = await requireSuperadmin();
  await prisma.blogAgentSettings.upsert({
    where: { key: SETTINGS_KEY },
    create: {
      key: SETTINGS_KEY,
      enabled,
      publishTime: defaults.publishTime,
      budgetUsd: defaults.budgetUsd,
      updatedById: admin.id,
    },
    update: { enabled, updatedById: admin.id },
  });
  revalidatePath(PAGE);
}

/**
 * Writes and publishes a post now, whatever the switch and whatever was
 * already published today.
 *
 * The run takes two minutes or so, which is too long to hold a button down
 * for, so the action answers at once and the agent carries on in `after`,
 * inside the page's five-minute `maxDuration`. The row is created here rather
 * than by the run, so it is on the page the moment the button returns.
 */
export async function writePostNow(): Promise<ActionState> {
  const admin = await requireSuperadmin();

  const missing = [
    ["ANTHROPIC_API_KEY", process.env.ANTHROPIC_API_KEY],
    ["PIXABAY_API_KEY", process.env.PIXABAY_API_KEY],
    ["CLOUDINARY_CLOUD_NAME", process.env.CLOUDINARY_CLOUD_NAME],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  if (missing.length) return { error: `Not configured on this deployment: ${missing.join(", ")}.` };

  const running = await prisma.blogAgentRun.findFirst({
    where: { status: "RUNNING", startedAt: { gt: new Date(Date.now() - STALE_AFTER_MS) } },
    select: { id: true },
  });
  if (running) return { error: "A run is already in progress. Wait for it to finish." };

  const run = await prisma.blogAgentRun.create({
    data: { trigger: "MANUAL", startedById: admin.id },
    select: { id: true },
  });
  const deadline = Date.now() + 250_000;

  after(async () => {
    try {
      const result = await runDailyPost({
        trigger: "MANUAL",
        runId: run.id,
        startedById: admin.id,
        now: true,
        force: true,
        deadline,
      });
      release(result);
    } catch (error) {
      // Already on the run's row; this is for the runtime logs.
      console.error("[blog-agent] manual run failed:", error);
    }
  });

  revalidatePath(PAGE);
  return { success: "Started. It takes two or three minutes, and the history below updates as it goes." };
}
