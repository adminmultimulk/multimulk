import Link from "next/link";
import { Empty, PageHeading, StatusPill } from "@/app/components/admin/ui";
import { requireUser } from "@/app/lib/admin/guard";
import {
  canEditArticles,
  canEditProperties,
  canManageUsers,
} from "@/app/lib/auth/roles";
import { prisma } from "@/app/lib/db";
import { allArticles } from "@/app/lib/knowledge";
import { units } from "@/app/lib/properties";

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note?: string;
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white px-5 py-4">
      <p className="text-[11px] tracking-[0.06em] text-ink/50 uppercase">
        {label}
      </p>
      <p className="mt-1 text-[26px] leading-none font-semibold text-ink tabular-nums">
        {value}
      </p>
      {note ? <p className="mt-1.5 text-[12px] text-ink/50">{note}</p> : null}
    </div>
  );
}

export default async function OverviewPage() {
  const user = await requireUser();

  const articles = canEditArticles(user.role);
  const properties = canEditProperties(user.role);

  const [
    articlesLive,
    articlesDraft,
    propertiesLive,
    propertiesDraft,
    people,
    recent,
  ] = await Promise.all([
    articles ? prisma.article.count({ where: { status: "PUBLISHED" } }) : 0,
    articles ? prisma.article.count({ where: { status: "DRAFT" } }) : 0,
    properties ? prisma.property.count({ where: { status: "PUBLISHED" } }) : 0,
    properties ? prisma.property.count({ where: { status: "DRAFT" } }) : 0,
    canManageUsers(user.role) ? prisma.user.count({ where: { active: true } }) : 0,
    articles
      ? prisma.article.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: { id: true, title: true, status: true, updatedAt: true },
        })
      : [],
  ]);

  return (
    <>
      <PageHeading
        title={`Good to see you, ${user.name.split(" ")[0]}`}
        description="Drafts are private. Publishing puts a piece on the live site within seconds — the pages that list it are refreshed as part of the save."
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {articles ? (
          <>
            <Stat
              label="Articles live"
              value={articlesLive}
              note={`Alongside ${allArticles.length} that ship with the site`}
            />
            <Stat label="Articles in draft" value={articlesDraft} />
          </>
        ) : null}
        {properties ? (
          <>
            <Stat
              label="Listings live"
              value={propertiesLive}
              note={`Alongside ${units.length} that ship with the site`}
            />
            <Stat label="Listings in draft" value={propertiesDraft} />
          </>
        ) : null}
        {canManageUsers(user.role) ? (
          <Stat label="Accounts enabled" value={people} />
        ) : null}
      </div>

      {articles ? (
        <>
          <h2 className="mb-3 text-[15px] font-semibold text-ink">
            Recently edited
          </h2>
          {recent.length === 0 ? (
            <Empty>
              Nothing written here yet.{" "}
              <Link
                href="/admin/articles/new"
                className="text-forest underline underline-offset-2"
              >
                Start an article
              </Link>
              .
            </Empty>
          ) : (
            <ul className="divide-y divide-ink/8 overflow-hidden rounded-lg border border-ink/10 bg-white">
              {recent.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-[13px] transition-colors hover:bg-ink/3"
                  >
                    <span className="font-medium text-ink">{article.title}</span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-ink/45 tabular-nums">
                        {article.updatedAt.toISOString().slice(0, 10)}
                      </span>
                      <StatusPill status={article.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}

      {properties && !articles ? (
        <p className="text-[13px] text-ink/60">
          <Link
            href="/admin/properties"
            className="text-forest underline underline-offset-2"
          >
            Go to the listings
          </Link>{" "}
          to add a unit or mark one sold.
        </p>
      ) : null}
    </>
  );
}
