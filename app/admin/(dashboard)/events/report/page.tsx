import Link from "next/link";
import type { Metadata } from "next";
import { Button, Empty, PageHeading } from "@/app/components/admin/ui";
import { requireSuperadmin } from "@/app/lib/admin/guard";
import { EVENT, SLOT_LABELS, STATUS_LABELS } from "@/app/lib/events/config";
import { buildReport } from "@/app/lib/events/report";

export const metadata: Metadata = { title: "Event report" };

function Stat({
  label,
  value,
  note,
  tone = "plain",
}: {
  label: string;
  value: number | string;
  note?: string;
  tone?: "plain" | "warn" | "good";
}) {
  return (
    <div
      className={
        "rounded-lg border px-5 py-4 " +
        (tone === "warn"
          ? "border-amber-300 bg-amber-50"
          : tone === "good"
            ? "border-forest/25 bg-forest/5"
            : "border-ink/10 bg-white")
      }
    >
      <p className="text-[11px] tracking-[0.06em] text-ink/50 uppercase">{label}</p>
      <p className="mt-1 text-[26px] leading-none font-semibold text-ink tabular-nums">
        {value}
      </p>
      {note ? <p className="mt-1.5 text-[12px] leading-[17px] text-ink/55">{note}</p> : null}
    </div>
  );
}

function dayName(day: string | null) {
  if (!day) return "Date unreadable";
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default async function EventReportPage() {
  await requireSuperadmin();
  const report = await buildReport();

  const { coverage, reminders } = report;
  const reachable = report.total - coverage.noEmail;

  return (
    <>
      <PageHeading
        title="Event report"
        description={`${EVENT.name} · ${EVENT.daysLabel} · Stand ${EVENT.stand}. Generated ${report.generatedAt.toISOString().slice(0, 16).replace("T", " ")} UTC.`}
        actions={
          <>
            <Link href="/admin/events/report/csv" prefetch={false}>
              <Button variant="secondary">Download CSV</Button>
            </Link>
            <Link href="/admin/events">
              <Button>Visitor list</Button>
            </Link>
          </>
        }
      />

      {report.total === 0 ? (
        <Empty>
          Nothing to report yet.{" "}
          <Link href="/admin/events" className="text-forest underline underline-offset-2">
            Import the visitor list
          </Link>{" "}
          first.
        </Empty>
      ) : (
        <>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="On the list"
              value={report.total}
              note={Object.entries(report.byList)
                .map(([list, count]) => `${count} ${list.toLowerCase()}`)
                .join(" · ")}
            />
            <Stat
              label="Confirmed"
              value={report.byStatus.CONFIRMED ?? 0}
              note={`${report.byStatus.AWAITING ?? 0} still to reply`}
              tone="good"
            />
            <Stat
              label="Reminded"
              value={coverage.emailed + coverage.whatsapped - coverage.bothChannels}
              note={`${coverage.emailed} by email, ${coverage.whatsapped} on WhatsApp`}
            />
            <Stat
              label="Not yet contacted"
              value={coverage.untouched}
              note="Excludes anyone cancelled"
              tone={coverage.untouched > 0 ? "warn" : "good"}
            />
          </div>

          {/*
            The schedule is the report's spine: it is what somebody staffing the
            stand looks at, and the only thing here that has to be readable at a
            glance the morning of the show.
          */}
          <h2 className="mb-3 text-[15px] font-semibold text-ink">
            Who is coming, and when
          </h2>
          <div className="mb-8 overflow-x-auto rounded-lg border border-ink/10 bg-white">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead className="border-b border-ink/10 text-[11px] tracking-[0.06em] text-ink/50 uppercase">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Day</th>
                  <th className="px-4 py-2.5 font-medium">Morning</th>
                  <th className="px-4 py-2.5 font-medium">Afternoon</th>
                  <th className="px-4 py-2.5 font-medium">Evening</th>
                  <th className="px-4 py-2.5 font-medium">Not stated</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                {report.schedule.map((row) => (
                  <tr key={row.day ?? "unknown"}>
                    <td className="px-4 py-2.5 font-medium text-ink">
                      {row.day ? (
                        <Link
                          href={`/admin/events?day=${row.day}`}
                          className="underline underline-offset-2"
                        >
                          {dayName(row.day)}
                        </Link>
                      ) : (
                        <span className="text-amber-800">{dayName(null)}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-ink/70">{row.morning}</td>
                    <td className="px-4 py-2.5 tabular-nums text-ink/70">{row.afternoon}</td>
                    <td className="px-4 py-2.5 tabular-nums text-ink/70">{row.evening}</td>
                    <td className="px-4 py-2.5 tabular-nums text-ink/70">{row.unspecified}</td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-ink">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-3 text-[15px] font-semibold text-ink">
            How the reminders have gone
          </h2>
          <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Emails sent"
              value={reminders.emailSent}
              note={`${reachable} of ${report.total} have an email address`}
            />
            <Stat
              label="Emails failed"
              value={reminders.emailFailed}
              note={reminders.emailFailed ? "Listed below, with the reason" : "Nothing bounced"}
              tone={reminders.emailFailed > 0 ? "warn" : "plain"}
            />
            <Stat
              label="WhatsApp messages"
              value={reminders.whatsappSent}
              note="Opened and marked sent by a person"
            />
            <Stat
              label="Due, not sent"
              value={report.dueNow.length}
              note={report.dueNow.length ? "Send them from the visitor list" : "Up to date"}
              tone={report.dueNow.length > 0 ? "warn" : "good"}
            />
          </div>
          <p className="mb-8 max-w-[70ch] text-[12px] leading-[18px] text-ink/50">
            The WhatsApp figure counts messages this dashboard composed and a
            person opened — WhatsApp itself tells us nothing back, so read it as
            &ldquo;we sent this&rdquo; rather than as a delivery receipt. The
            email figure is Resend&rsquo;s acceptance of the message, which is a
            delivery to the mail server and not proof it reached an inbox.
          </p>

          {report.needsDecision.length > 0 ? (
            <>
              <h2 className="mb-1 text-[15px] font-semibold text-ink">
                Needs a decision
              </h2>
              <p className="mb-3 max-w-[70ch] text-[13px] leading-[20px] text-ink/60">
                The date on these rows could not be read as a single day, so no
                reminder is scheduled. Nothing goes out to them until somebody
                picks a day.
              </p>
              <ul className="mb-8 divide-y divide-ink/8 overflow-hidden rounded-lg border border-amber-300 bg-white">
                {report.needsDecision.map((visitor) => (
                  <li
                    key={visitor.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[13px]"
                  >
                    <span className="font-medium text-ink">{visitor.name}</span>
                    <span className="text-ink/55">
                      Sheet says &ldquo;{visitor.visitDateRaw || "nothing"}&rdquo;
                      {visitor.preferredTimeRaw ? ` · ${visitor.preferredTimeRaw}` : ""}
                    </span>
                    <Link
                      href="/admin/events?state=unscheduled"
                      className="text-forest underline underline-offset-2"
                    >
                      Fix
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {report.missed.length > 0 ? (
            <>
              <h2 className="mb-1 text-[15px] font-semibold text-ink">
                Nobody has contacted these {report.missed.length}
              </h2>
              <p className="mb-3 max-w-[70ch] text-[13px] leading-[20px] text-ink/60">
                No email and no WhatsApp on record. This is the list that
                matters — everything else here is a count of work already done.
              </p>
              <ul className="mb-8 divide-y divide-ink/8 overflow-hidden rounded-lg border border-ink/10 bg-white">
                {report.missed.map((visitor) => (
                  <li
                    key={visitor.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[13px]"
                  >
                    <span className="font-medium text-ink">{visitor.name}</span>
                    <span className="text-ink/55">
                      {visitor.visitDate
                        ? dayName(visitor.visitDate.toISOString().slice(0, 10))
                        : "No day"}{" "}
                      · {SLOT_LABELS[visitor.slot]} · {STATUS_LABELS[visitor.status]}
                    </span>
                    <span className="text-ink/45">
                      {visitor.email ?? "no email"}
                      {visitor.phone ? ` · +${visitor.phone}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h2 className="mb-3 text-[15px] font-semibold text-ink">
            Every status on the list
          </h2>
          <div className="mb-8 flex flex-wrap gap-2">
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <Link
                key={value}
                href={`/admin/events?status=${value}`}
                className="rounded-md border border-ink/12 bg-white px-3 py-2 text-[12px] text-ink/70 hover:bg-ink/5"
              >
                {label}
                <span className="ml-2 font-semibold tabular-nums text-ink">
                  {report.byStatus[value] ?? 0}
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mb-3 text-[15px] font-semibold text-ink">
            The last 25 sends
          </h2>
          {report.recent.length === 0 ? (
            <Empty>Nothing has been sent yet.</Empty>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-ink/10 bg-white">
              <table className="w-full min-w-[720px] text-left text-[13px]">
                <thead className="border-b border-ink/10 text-[11px] tracking-[0.06em] text-ink/50 uppercase">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">When</th>
                    <th className="px-4 py-2.5 font-medium">Visitor</th>
                    <th className="px-4 py-2.5 font-medium">Channel</th>
                    <th className="px-4 py-2.5 font-medium">Result</th>
                    <th className="px-4 py-2.5 font-medium">By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/8">
                  {report.recent.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-2.5 tabular-nums text-ink/55">
                        {entry.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-ink">
                        {entry.visitor.name}
                      </td>
                      <td className="px-4 py-2.5 text-ink/70">
                        {entry.channel === "EMAIL" ? "Email" : "WhatsApp"}
                      </td>
                      <td className="px-4 py-2.5">
                        {entry.status === "SENT" ? (
                          <span className="text-forest">Sent</span>
                        ) : (
                          <span className="text-red-700" title={entry.detail ?? undefined}>
                            Failed — {entry.detail?.slice(0, 90) ?? "no reason recorded"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-ink/55">
                        {entry.automatic ? "Scheduled run" : (entry.sentByName ?? "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
