import { after } from "next/server";
import { sendDueEmailReminders } from "@/app/lib/events/send";

/**
 * The hourly run that sends whatever is due.
 *
 * Hourly rather than to-the-minute because the reminder is scheduled twenty
 * hours ahead of a slot: being an hour early or late is invisible to the
 * person receiving it, and an hourly cron is one that can be reasoned about
 * when something goes wrong at eleven at night during a trade show.
 *
 * The endpoint is idempotent by construction — `dueForEmail` only returns
 * visitors with nothing sent, and the send itself carries an idempotency key —
 * so a retry, a double-fire or a curl by hand cannot email anybody twice.
 */

/** Vercel Cron sends this; without it the endpoint is a public send button. */
const secret = process.env.CRON_SECRET;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  /*
   * Refusing when the secret is unset, rather than running openly, is the
   * safer default of the two: a missed reminder is recoverable from the
   * dashboard in one click, and an open endpoint that emails fifty clients is
   * recoverable from nowhere.
   */
  if (!secret) {
    return Response.json(
      { ok: false, error: "CRON_SECRET is not set; the scheduled run is disabled." },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const outcomes = await sendDueEmailReminders(null, { automatic: true });
  const failed = outcomes.filter((outcome) => !outcome.ok);

  // Every failure is already an `EventReminder` row and shows on the report;
  // this puts it in the runtime logs too, which is where somebody looks first
  // when the question is "did the cron run at all".
  after(() => {
    for (const outcome of failed) {
      console.error(`[events] reminder to ${outcome.name} failed: ${outcome.reason}`);
    }
  });

  return Response.json({
    ok: true,
    attempted: outcomes.length,
    sent: outcomes.length - failed.length,
    failed: failed.length,
  });
}
