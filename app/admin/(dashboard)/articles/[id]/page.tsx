import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleForm } from "@/app/components/admin/article-form";
import { PageHeading, StatusPill } from "@/app/components/admin/ui";
import { requireArticleAccess } from "@/app/lib/admin/guard";
import { prisma } from "@/app/lib/db";
import { productionOrigin } from "@/app/lib/site";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/articles/[id]">) {
  await requireArticleAccess();
  const { id } = await params;

  // An id from the URL is arbitrary text; Prisma rejects a malformed ObjectId
  // by throwing, which would be a 500 where a 404 is the honest answer.
  if (!/^[0-9a-f]{24}$/i.test(id)) notFound();

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const scheduled =
    article.status === "PUBLISHED" &&
    Boolean(article.publishedAt && article.publishedAt > new Date());

  return (
    <>
      <PageHeading
        title="Edit article"
        description={
          scheduled
            ? "This piece is scheduled. It appears on the site once its publication time passes."
            : article.status === "PUBLISHED"
              ? "This piece is live. Saving publishes the change straight away."
              : "This piece is a draft — readers cannot see it yet."
        }
        actions={<StatusPill status={article.status} scheduled={scheduled} />}
      />
      <ArticleForm
        origin={productionOrigin.host}
        article={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          body: article.body,
          topics: article.topics,
          category: article.category,
          source: article.source ?? "",
          image: article.image ?? "",
          hero: article.hero ?? "",
          readMore: article.readMore ?? "",
          // `datetime-local` wants exactly `YYYY-MM-DDTHH:mm`, and the field
          // is UTC throughout — see `Schedule` in the form.
          date: article.publishedAt
            ? article.publishedAt.toISOString().slice(0, 16)
            : "",
          seoTitle: article.seoTitle ?? "",
          seoDescription: article.seoDescription ?? "",
          canonicalUrl: article.canonicalUrl ?? "",
          noindex: article.noindex,
          status: article.status,
        }}
      />
    </>
  );
}
