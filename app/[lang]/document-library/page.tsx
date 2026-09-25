import type { Metadata } from "next";
import { DocumentLibrary } from "@/app/components/document-library";
import { JsonLd } from "@/app/components/json-ld";
import { PageHero } from "@/app/components/page-hero";
import { SiteFooter } from "@/app/components/site-footer";
import { documentFile, libraryDocuments } from "@/app/lib/documents";
import { alternatesFor, getDictionary, getI18n } from "@/app/lib/i18n";
import { routes } from "@/app/lib/routes";
import { breadcrumbs, collectionPage } from "@/app/lib/seo/jsonld";
import { absoluteUrl } from "@/app/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    ...t.documents.meta,
    alternates: await alternatesFor(routes.documents.pattern),
  };
}

export default async function DocumentLibraryPage() {
  const { locale, t } = await getI18n();
  const copy = t.documents;

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id: "documents",
            name: copy.meta.title,
            description: copy.meta.description,
            itemUrls: libraryDocuments.map((doc) =>
              absoluteUrl(documentFile(doc.slug)),
            ),
          }),
          breadcrumbs({ locale, id: "documents", labels: t.routes }),
        ]}
      />

      <PageHero eyebrow={copy.eyebrow} heading={copy.heading} body={copy.body} />

      <main className="flex-1">
        <DocumentLibrary />
      </main>

      <SiteFooter />
    </>
  );
}
