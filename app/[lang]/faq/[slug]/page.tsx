import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleBody } from "@/app/components/article-body";
import { Container } from "@/app/components/container";
import { LastReviewed } from "@/app/components/figure";
import { JsonLd } from "@/app/components/json-ld";
import { Link } from "@/app/components/link";
import { PageHero } from "@/app/components/page-hero";
import { SiteFooter } from "@/app/components/site-footer";
import { answeredInFull, getFaq } from "@/app/lib/faqs";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs, faqPage, routeUrl } from "@/app/lib/seo/jsonld";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    answeredInFull.map((faq) => ({ lang, slug: faq.slug! })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/faq/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const faq = getFaq(slug);
  if (!faq) return {};

  return {
    title: faq.question,
    description: faq.answer[0],
    alternates: await alternatesFor(`/faq/${slug}`),
  };
}

export default async function FaqPage({
  params,
}: PageProps<"/[lang]/faq/[slug]">) {
  const { slug } = await params;
  const faq = getFaq(slug);
  if (!faq) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);

  const related = answeredInFull.filter(
    (other) =>
      other.slug !== slug &&
      other.topics.some((topic) => faq.topics.includes(topic)),
  );

  return (
    <>
      <JsonLd
        graph={[
          // One question, one answer. The page is the answer, so the markup
          // says exactly that rather than restating the whole hub.
          faqPage(`${routeUrl(locale, "faq", { slug })}#faq`, [
            { question: faq.question, answer: faq.answer.join(" ") },
          ]),
          breadcrumbs({
            locale,
            id: "faq",
            values: { slug },
            labels: t.routes,
            leafLabel: faq.question,
          }),
        ]}
      />

      <PageHero eyebrow={t.faq.eyebrow} heading={faq.question} />

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[96px]">
          <Container>
            <div className="max-w-[760px]">
              {/* The short answer, set apart. Someone who reads only the first
                  paragraph should still have been answered. */}
              <p className="border-s-2 border-gold ps-6 font-display text-[20px] leading-[1.5] text-ink sm:text-[23px]">
                {faq.answer[0]}
              </p>

              <ArticleBody body={faq.answer.slice(1)} />

              {faq.review ? (
                <LastReviewed review={faq.review} className="mt-10" />
              ) : null}

              {related.length ? (
                <nav className="mt-14 border-t border-ink/15 pt-8">
                  <h2 className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink/50">
                    {t.faq.eyebrow}
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {related.map((other) => (
                      <li key={other.id}>
                        <Link
                          href={buildPath("faq", { slug: other.slug! })}
                          className="text-[14px] leading-[22px] text-ink underline-offset-4 hover:underline"
                        >
                          {other.question}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
