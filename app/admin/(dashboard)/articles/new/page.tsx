import type { Metadata } from "next";
import {
  ArticleForm,
  emptyArticle,
} from "@/app/components/admin/article-form";
import { PageHeading } from "@/app/components/admin/ui";
import { requireArticleAccess } from "@/app/lib/admin/guard";
import { productionOrigin } from "@/app/lib/site";

export const metadata: Metadata = { title: "New article" };

export default async function NewArticlePage() {
  await requireArticleAccess();

  return (
    <>
      <PageHeading
        title="Write an article"
        description="Save it as a draft as often as you like. Nothing reaches the site until you publish."
      />
      <ArticleForm article={emptyArticle} origin={productionOrigin.host} />
    </>
  );
}
