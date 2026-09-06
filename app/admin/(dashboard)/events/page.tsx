import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { ActionButton } from "@/app/components/admin/action-button";
import {
  CopyButton,
  EditVisitorForm,
  ImportForm,
  SendDueForm,
  StatusSelect,
  WhatsappButton,
} from "@/app/components/admin/event-forms";
import { Button, Empty, PageHeading } from "@/app/components/admin/ui";
import { deleteVisitor, sendOneReminder } from "@/app/lib/admin/event-actions";
import { requireSuperadmin } from "@/app/lib/admin/guard";
import { prisma } from "@/app/lib/db";
import { EVENT, SLOT_LABELS, STATUS_LABELS } from "@/app/lib/events/config";
import {
  dayLabel,
  timeLabel,
  whatsappLink,
  whatsappText,
} from "@/app/lib/events/message";
import { reminderEmailConfigured } from "@/app/lib/events/send";

export const metadata: Metadata = { title: "Event visitors" };

type Filters = { day?: string; slot?: string; status?: string; state?: string };

function one(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return first && first !== "all" ? first : undefined;
}

/*
 * A query string is arbitrary text, and Prisma answers an enum it does not
 * recognise by throwing — a 500 where "no such filter" is the honest reply. So
 * the two enum filters are matched against their own lists rather than cast.
 */
const SLOTS = ["MORNING", "AFTERNOON", "EVENING", "UNSPECIFIED"] as const;
const STATUSES = [
  "AWAITING",
  "CONFIRMED",
  "CANCELLED",
  "ATTENDED",
  "NO_SHOW",
] as const;

function pick<T extends readonly string[]>(
  allowed: T,
  value: string | undefined,
): T[number] | undefined {
  return allowed.find((entry) => entry === value);
}

/** A filter link that keeps the other filters as they are. */
function filterHref(current: Filters, change: Partial<Filters>) {
  const next = { ...current, ...change };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) if (value) params.set(key, value);
  const query = params.toString();
  return query ? `/admin/events?${query}` : "/admin/events";
}

function Tabs({
  current,
  field,
  options,
}: {
  current: Filters;
  field: keyof Filters;
  options: { value?: string; label: string; count?: number }[];
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => {
        const active = (current[field] ?? undefined) === option.value;
        return (
          <Link
            key={option.label}
            href={filterHref(current, { [field]: option.value ?? "all" })}
            aria-current={active ? "true" : undefined}
            className={
              "rounded-md px-2.5 py-1.5 text-[12px] transition-colors " +
              (active
                ? "bg-forest text-white"
                : "border border-ink/12 bg-white text-ink/70 hover:bg-ink/5")
            }
          >
            {option.label}
            {option.count === undefined ? null : (
              <span className={active ? "ml-1.5 text-white/70" : "ml-1.5 text-ink/40"}>
                {option.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function when(value: Date | null) {
  if (!value) return "—";
  return value.toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

export default async function EventVisitorsPage({
  searchParams,
}: PageProps<"/admin/events">) {
  await requireSuperadmin();

  const query = await searchParams;
  const filters: Filters = {
    day: one(query.day),
    slot: one(query.slot),
    status: one(query.status),
    state: one(query.state),
  };

  const now = new Date();

  const day = filters.day ? new Date(`${filters.day}T00:00:00Z`) : undefined;
  const slot = pick(SLOTS, filters.slot);
  const status = pick(STATUSES, filters.status);

  /*
   * `state` and `status` are both conditions on the same row, so they are
   * collected into one `AND` rather than spread over each other: written as a
   * flat object, "reminder due" — which excludes the cancelled — would quietly
   * replace whichever status the person had picked, and the page would show a
   * list that did not match its own filter buttons.
   */
  const conditions: Prisma.EventVisitorWhereInput[] = [];
  if (day && !Number.isNaN(day.getTime())) conditions.push({ visitDate: day });
  if (slot) conditions.push({ slot });
  if (status) conditions.push({ status });
  if (filters.state === "due")
    conditions.push({
      emailSentAt: null,
      email: { not: null },
      remindAt: { not: null, lte: now },
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    });
  if (filters.state === "untouched")
    conditions.push({ emailSentAt: null, whatsappSentAt: null });
  if (filters.state === "unscheduled") conditions.push({ remindAt: null });

  const where: Prisma.EventVisitorWhereInput = {
    event: EVENT.key,
    ...(conditions.length ? { AND: conditions } : {}),
  };

  const [visitors, total, dueCount, untouched, unscheduled, dayCounts] =
    await Promise.all([
      prisma.eventVisitor.findMany({
        where,
        orderBy: [{ visitDate: "asc" }, { slot: "asc" }, { name: "asc" }],
      }),
      prisma.eventVisitor.count({ where: { event: EVENT.key } }),
      prisma.eventVisitor.count({
        where: {
          event: EVENT.key,
          emailSentAt: null,
          email: { not: null },
          remindAt: { not: null, lte: now },
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
      }),
      prisma.eventVisitor.count({
        where: { event: EVENT.key, emailSentAt: null, whatsappSentAt: null },
      }),
      prisma.eventVisitor.count({ where: { event: EVENT.key, remindAt: null } }),
      Promise.all(
        EVENT.days.map(async (value) => ({
          value,
          count: await prisma.eventVisitor.count({
            where: { event: EVENT.key, visitDate: new Date(`${value}T00:00:00Z`) },
          }),
        })),
      ),
    ]);

  return (
    <>
      <PageHeading
        title="Event visitors"
        description={`${EVENT.name}, ${EVENT.daysLabel} at ${EVENT.venue}. Stand ${EVENT.stand}. Each reminder goes out ahead of the visitor's own slot, not in one blast — the schedule is worked out from the date and time they gave.`}
        actions={
          <Link href="/admin/events/report">
            <Button variant="secondary">Report</Button>
          </Link>
        }
      />

      {!reminderEmailConfigured ? (
        <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-[20px] text-amber-900">
          <strong>Email reminders are switched off.</strong> Set{" "}
          <code className="font-mono">RESEND_API_KEY</code> and{" "}
          <code className="font-mono">LEAD_EMAIL_FROM</code> (a sender on a
          domain verified in Resend) and redeploy. Everything else on this page
          works meanwhile — the WhatsApp messages are composed in the browser and
          do not need it.
        </p>
      ) : null}

      {total === 0 ? null : (
        <section className="mb-6 rounded-lg border border-ink/10 bg-white p-5">
          <h2 className="mb-1 text-[15px] font-semibold text-ink">
            Send the reminders that are due
          </h2>
          <p className="mb-4 max-w-[70ch] text-[13px] leading-[20px] text-ink/60">
            Due means the visitor&rsquo;s slot is close enough to remind them and
            nothing has been sent yet. The same run happens on its own every hour;
            this is the button for when you want it now.
          </p>
          <SendDueForm due={dueCount} />
        </section>
      )}

      <div className="mb-5 grid gap-3">
        <Tabs
          current={filters}
          field="day"
          options={[
            { label: "All days", count: total },
            ...dayCounts.map((entry) => ({
              value: entry.value,
              label: new Date(`${entry.value}T00:00:00Z`).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                timeZone: "UTC",
              }),
              count: entry.count,
            })),
          ]}
        />
        <Tabs
          current={filters}
          field="slot"
          options={[
            { label: "Any time" },
            { value: "MORNING", label: "Morning" },
            { value: "AFTERNOON", label: "Afternoon" },
            { value: "EVENING", label: "Evening" },
            { value: "UNSPECIFIED", label: "Time not stated" },
          ]}
        />
        <Tabs
          current={filters}
          field="state"
          options={[
            { label: "Everyone" },
            { value: "due", label: "Reminder due", count: dueCount },
            { value: "untouched", label: "Not yet contacted", count: untouched },
            { value: "unscheduled", label: "No schedule", count: unscheduled },
          ]}
        />
      </div>

      <section className="mb-8">
        {visitors.length === 0 ? (
          <Empty>
            {total === 0
              ? "No visitors imported yet. Paste the list from the spreadsheet below."
              : "No visitor matches those filters."}
          </Empty>
        ) : (
          <div className="grid gap-3">
            {visitors.map((visitor) => {
              const message = whatsappText(visitor);
              const link = whatsappLink(visitor);
              const overdue =
                !visitor.emailSentAt &&
                visitor.remindAt !== null &&
                visitor.remindAt <= now &&
                visitor.status !== "CANCELLED";

              return (
                <article
                  key={visitor.id}
                  className={
                    "rounded-lg border bg-white p-5 " +
                    (overdue ? "border-amber-300" : "border-ink/10")
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-[240px]">
                      <h3 className="text-[14px] font-semibold text-ink">
                        {visitor.name}
                        <span className="ml-2 rounded-full bg-ink/8 px-2 py-0.5 text-[11px] font-medium tracking-[0.04em] text-ink/60 uppercase">
                          {visitor.list}
                        </span>
                      </h3>
                      <p className="mt-1 text-[13px] text-ink">
                        {dayLabel(visitor)} · {timeLabel(visitor)}
                      </p>
                      <p className="mt-0.5 text-[12px] text-ink/55">
                        {visitor.email ? (
                          <a
                            href={`mailto:${visitor.email}`}
                            className="underline underline-offset-2"
                          >
                            {visitor.email}
                          </a>
                        ) : (
                          <span className="text-red-700">No email address</span>
                        )}
                        {" · "}
                        {visitor.phone ? (
                          <a href={`tel:+${visitor.phone}`} className="underline underline-offset-2">
                            +{visitor.phone}
                          </a>
                        ) : (
                          <span className="text-red-700">No phone number</span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[12px] text-ink/45">
                        {visitor.remindAt
                          ? `Reminder due ${when(visitor.remindAt)}`
                          : `No schedule — "${visitor.visitDateRaw || "no date"}" could not be read as a day`}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <StatusSelect id={visitor.id} status={visitor.status} />
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <ActionButton
                          action={sendOneReminder.bind(null, visitor.id)}
                          label={visitor.emailSentAt ? "Email again" : "Email"}
                          busyLabel="Sending…"
                          variant={visitor.emailSentAt ? "secondary" : "primary"}
                          confirmLabel={visitor.emailSentAt ? "Send a second email" : undefined}
                        />
                        <WhatsappButton
                          id={visitor.id}
                          link={link}
                          sent={Boolean(visitor.whatsappSentAt)}
                        />
                      </div>
                      <p className="text-right text-[11px] text-ink/45">
                        {visitor.emailSentAt
                          ? `Emailed ${visitor.emailSentAt.toISOString().slice(0, 10)}`
                          : "Not emailed"}
                        {" · "}
                        {visitor.whatsappSentAt
                          ? `WhatsApp ${visitor.whatsappSentAt.toISOString().slice(0, 10)}`
                          : "No WhatsApp"}
                      </p>
                    </div>
                  </div>

                  <details className="mt-3 border-t border-ink/10 pt-3">
                    <summary className="cursor-pointer text-[12px] text-ink/60 hover:text-ink">
                      The message they will get
                    </summary>
                    <pre className="mt-2 max-w-[70ch] overflow-x-auto rounded-md bg-ink/4 px-3 py-2 font-sans text-[12px] leading-[19px] whitespace-pre-wrap text-ink/75">
                      {message}
                    </pre>
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <CopyButton text={message} />
                      <ActionButton
                        action={deleteVisitor.bind(null, visitor.id)}
                        label="Remove"
                        busyLabel="Removing…"
                        confirmLabel="Remove from the list"
                        variant="secondary"
                      />
                    </div>
                  </details>

                  <div className="mt-3">
                    <EditVisitorForm visitor={visitor} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5">
        <h2 className="mb-1 text-[15px] font-semibold text-ink">
          Import from the spreadsheet
        </h2>
        <p className="mb-4 max-w-[70ch] text-[13px] leading-[20px] text-ink/60">
          Statuses set here are kept when you re-import — the sheet decides when
          somebody is coming, this page decides what has happened since.
        </p>
        <ImportForm />
      </section>

      <p className="mt-6 text-[12px] text-ink/45">
        Slots: {Object.values(SLOT_LABELS).join(" · ")}. Statuses:{" "}
        {Object.values(STATUS_LABELS).join(" · ")}.
      </p>
    </>
  );
}
