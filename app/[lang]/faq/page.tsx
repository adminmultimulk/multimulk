import type { Metadata } from "next";
import { Container } from "@/app/components/container";
import { FaqList } from "@/app/components/faq-list";
import { JsonLd } from "@/app/components/json-ld";
import { PageHero } from "@/app/components/page-hero";
import { SiteFooter } from "@/app/components/site-footer";
import { faqs, faqTopics } from "@/app/lib/faqs";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { breadcrumbs, faqPage, routeUrl } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.faq.heading,
    description: t.faq.body,
    alternates: await alternatesFor("/faq"),
  };
}

export default async function FaqIndexPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd
        graph={[
          faqPage(
            `${routeUrl(locale, "faqIndex")}#faq`,
            faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer.join(" "),
            })),
          ),
          breadcrumbs({ locale, id: "faqIndex", labels: t.routes }),
        ]}
      />

      <PageHero
        eyebrow={t.faq.eyebrow}
        heading={t.faq.heading}
        body={t.faq.body}
      />

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[96px]">
          <Container>
            <FaqList faqs={faqs} topics={faqTopics} />
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
