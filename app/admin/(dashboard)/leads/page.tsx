import Link from "next/link";
import type { Metadata } from "next";
import { ActionButton } from "@/app/components/admin/action-button";
import { EditLeadForm } from "@/app/components/admin/lead-forms";
import { Button, Empty, PageHeading } from "@/app/components/admin/ui";
import { deleteLead } from "@/app/lib/admin/lead-actions";
import { requireSuperadmin } from "@/app/lib/admin/guard";
import {
  kindLabel,
  kindOptions,
  languageLabel,
  leadFilters,
  leadTime,
  leadWhere,
  type LeadFilters,
} from "@/app/lib/admin/leads";
import { prisma } from "@/app/lib/db";
import { bitrixLeadUrl } from "@/app/lib/leads/bitrix24";
import { absoluteUrl } from "@/app/lib/site";

export const metadata: Metadata = { title: "Leads" };

const PAGE_SIZE = 50;

/** A link that keeps the other filters as they are. */
function leadsHref(current: LeadFilters & { page?: number }, change: Partial<LeadFilters & { page?: number }>) {
  const next = { ...current, ...change };
  const params = new URLSearchParams();
  if (next.kind) params.set("kind", next.kind);
  if (next.q) params.set("q", next.q);
  if (next.page && next.page > 1) params.set("page", String(next.page));
  const query = params.toString();
  return query ? `/admin/leads?${query}` : "/admin/leads";
}

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireSuperadmin();

  const query = await searchParams;
  const filters = leadFilters(query);
  const requested = Number(Array.isArray(query.page) ? query.page[0] : query.page);
  const page = Number.isInteger(requested) && requested > 1 ? requested : 1;
  const where = leadWhere(filters);

  const [leads, matching, counts] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.lead.count({ where }),
    prisma.lead.groupBy({
      by: ["kind"],
      where: leadWhere({ q: filters.q }),
      _count: { _all: true },
    }),
  ]);

  const countFor = (kind: string) => counts.find((entry) => entry.kind === kind)?._count._all ?? 0;
  const total = counts.reduce((sum, entry) => sum + entry._count._all, 0);
  const pages = Math.max(1, Math.ceil(matching / PAGE_SIZE));

  const csvParams = new URLSearchParams();
  if (filters.kind) csvParams.set("kind", filters.kind);
  if (filters.q) csvParams.set("q", filters.q);
  const csvHref = `/admin/leads/csv${csvParams.size ? `?${csvParams}` : ""}`;

  return (
    <>
      <PageHeading
        title="Leads"
        description="Every enquiry from the site's forms, newest first. Follow-up happens in Bitrix24 — each lead links to its card there."
        actions={
          <a href={csvHref}>
            <Button variant="secondary">Download CSV</Button>
          </a>
        }
      />

      <form action="/admin/leads" className="mb-4 flex flex-wrap gap-2">
        {filters.kind ? <input type="hidden" name="kind" value={filters.kind} /> : null}
        <input
          type="search"
          name="q"
          defaultValue={filters.q}
          placeholder="Search name, email, phone or subject"
          className="w-full max-w-[360px] rounded-md border border-ink/15 bg-white px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/15"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {filters.q ? (
          <Link
            href={leadsHref({ kind: filters.kind }, {})}
            className="self-center text-[12px] text-ink/60 underline underline-offset-2 hover:text-ink"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <div className="mb-5 flex flex-wrap gap-1">
        {[{ value: undefined, label: "All forms", count: total }, ...kindOptions.map((option) => ({ ...option, count: countFor(option.value) }))]
          .filter((option) => option.value === undefined || option.count > 0)
          .map((option) => {
            const active = filters.kind === option.value;
            return (
              <Link
                key={option.label}
                href={leadsHref({ q: filters.q }, { kind: option.value })}
                aria-current={active ? "true" : undefined}
                className={
                  "rounded-md px-2.5 py-1.5 text-[12px] transition-colors " +
                  (active ? "bg-forest text-white" : "border border-ink/12 bg-white text-ink/70 hover:bg-ink/5")
                }
              >
                {option.label}
                <span className={active ? "ml-1.5 text-white/70" : "ml-1.5 text-ink/40"}>{option.count}</span>
              </Link>
            );
          })}
      </div>

      {leads.length === 0 ? (
        <Empty>
          {total === 0 && !filters.q
            ? "No leads yet. Every form on the site saves here from now on."
            : "No lead matches that search."}
        </Empty>
      ) : (
        <div className="grid gap-3">
          {leads.map((lead) => {
            const bitrix = lead.bitrixId ? bitrixLeadUrl(lead.bitrixId) : null;
            const digits = lead.phone.replace(/\D/g, "");
            return (
              <article key={lead.id} className="rounded-lg border border-ink/10 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-[240px]">
                    <h2 className="text-[14px] font-semibold text-ink">
                      <bdi>{lead.name}</bdi>
                      <span className="ml-2 rounded-full bg-ink/8 px-2 py-0.5 text-[11px] font-medium tracking-[0.04em] text-ink/60 uppercase">
                        {kindLabel(lead.kind)}
                      </span>
                    </h2>
                    <p className="mt-1 text-[12px] text-ink/55">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="underline underline-offset-2">
                          {lead.email}
                        </a>
                      ) : (
                        "No email"
                      )}
                      {" · "}
                      {lead.phone ? (
                        <>
                          <a href={`tel:${lead.phone}`} className="underline underline-offset-2">
                            {lead.phone}
                          </a>{" "}
                          (
                          <a
                            href={`https://wa.me/${digits}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            WhatsApp
                          </a>
                          )
                        </>
                      ) : (
                        "No phone"
                      )}
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink/45">
                      {languageLabel(lead.locale)} ·{" "}
                      <a
                        href={absoluteUrl(lead.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {lead.path}
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 text-right">
                    <p className="text-[12px] text-ink/60 tabular-nums">{leadTime(lead.submittedAt)}</p>
                    {bitrix ? (
                      <a
                        href={bitrix}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-forest underline underline-offset-2"
                      >
                        Open in Bitrix24
                      </a>
                    ) : (
                      <span className="text-[12px] text-amber-700">Not in Bitrix24</span>
                    )}
                  </div>
                </div>

                <details className="mt-3 border-t border-ink/10 pt-3">
                  <summary className="cursor-pointer text-[12px] text-ink/60 hover:text-ink">
                    <bdi>{lead.subject || "Message"}</bdi>
                  </summary>
                  <p
                    dir="auto"
                    className="mt-2 max-w-[70ch] rounded-md bg-ink/4 px-3 py-2 text-[12px] leading-[19px] whitespace-pre-wrap text-ink/75"
                  >
                    {lead.message || "—"}
                  </p>
                </details>

                {lead.notes ? (
                  <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-[19px] whitespace-pre-wrap text-amber-900">
                    <strong>Notes:</strong> {lead.notes}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-start gap-2 border-t border-ink/10 pt-3">
                  <EditLeadForm lead={lead} kinds={kindOptions} />
                  <ActionButton
                    action={deleteLead.bind(null, lead.id)}
                    label="Delete"
                    busyLabel="Deleting…"
                    confirmLabel="Delete from the dashboard"
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {pages > 1 ? (
        <nav className="mt-6 flex items-center justify-between text-[13px]">
          {page > 1 ? (
            <Link href={leadsHref({ ...filters, page }, { page: page - 1 })} className="text-forest underline underline-offset-2">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-ink/50 tabular-nums">
            Page {page} of {pages} · {matching} leads
          </span>
          {page < pages ? (
            <Link href={leadsHref({ ...filters, page }, { page: page + 1 })} className="text-forest underline underline-offset-2">
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </>
  );
}
