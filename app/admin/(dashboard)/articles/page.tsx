import Link from "next/link";
import type { Metadata } from "next";
import { ActionButton } from "@/app/components/admin/action-button";
import {
  Button,
  Empty,
  PageHeading,
  StatusPill,
} from "@/app/components/admin/ui";
import {
  deleteArticle,
  unpublishArticle,
} from "@/app/lib/admin/article-actions";
import { requireArticleAccess } from "@/app/lib/admin/guard";
import { prisma } from "@/app/lib/db";

export const metadata: Metadata = { title: "Articles" };

function day(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "—";
}

/** Marked published, but with a date still to come. */
function isScheduled(article: { status: string; publishedAt: Date | null }) {
  return (
    article.status === "PUBLISHED" &&
    Boolean(article.publishedAt && article.publishedAt > new Date())
  );
}

export default async function ArticlesPage() {
  const user = await requireArticleAccess();

  const articles = await prisma.article.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: { author: { select: { name: true, id: true } } },
  });

  return (
    <>
      <PageHeading
        title="Articles"
        description="Everything written here is merged into the Knowledge Centre alongside the existing archive. Drafts stay invisible to readers."
        actions={
          <Link href="/admin/articles/new">
            <Button>Write an article</Button>
          </Link>
        }
      />

      {articles.length === 0 ? (
        <Empty>
          Nothing yet. The Knowledge Centre is still showing only the articles
          that ship with the site.
        </Empty>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink/10 bg-white">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="border-b border-ink/10 text-[11px] tracking-[0.06em] text-ink/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Headline</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-ink/6 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="font-medium text-ink hover:text-forest"
                    >
                      {article.title}
                    </Link>
                    <span className="block text-[11px] text-ink/45">
                      /knowledge/{article.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={article.status}
                      scheduled={isScheduled(article)}
                    />
                  </td>
                  <td className="px-4 py-3 text-ink/70 tabular-nums">
                    {day(article.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{article.author.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {article.status === "PUBLISHED" ? (
                        <>
                          {isScheduled(article) ? null : (
                            <Link
                              href={`/en/knowledge/${article.slug}`}
                              target="_blank"
                              className="self-center text-[12px] text-ink/60 underline underline-offset-2 hover:text-ink"
                            >
                              View
                            </Link>
                          )}
                          <ActionButton
                            action={unpublishArticle.bind(null, article.id)}
                            label={isScheduled(article) ? "Unschedule" : "Take offline"}
                            busyLabel="Removing…"
                          />
                        </>
                      ) : null}
                      {article.author.id === user.id || user.role === "SUPERADMIN" ? (
                        <ActionButton
                          action={deleteArticle.bind(null, article.id)}
                          label="Delete"
                          confirmLabel="Delete for good"
                          busyLabel="Deleting…"
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
