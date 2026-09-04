import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { Link } from "@/app/components/link";
import { PageHero } from "@/app/components/page-hero";
import { SiteFooter } from "@/app/components/site-footer";
import { authors } from "@/app/lib/authors";
import { faqs } from "@/app/lib/faqs";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import { programmes } from "@/app/lib/programmes";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs, ORG_ID, routeUrl } from "@/app/lib/seo/jsonld";
import { absoluteUrl } from "@/app/lib/site";

const bySlug = Object.values(authors);

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    bySlug.map((author) => ({ lang, slug: author.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/authors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const author = bySlug.find((person) => person.slug === slug);
  if (!author) return {};

  return {
    title: author.name,
    alternates: await alternatesFor(`/authors/${slug}`),
  };
}

export default async function AuthorPage({
  params,
}: PageProps<"/[lang]/authors/[slug]">) {
  const { slug } = await params;
  const author = bySlug.find((person) => person.slug === slug);
  if (!author) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const url = routeUrl(locale, "author", { slug });

  // What this person has actually signed off. An author page that lists no
  // work is a biography; the reviewed content is what makes it a credential.
  const reviewedProgrammes = programmes.filter(
    (programme) => programme.review.reviewedBy === author.id,
  );
  const reviewedFaqs = faqs.filter(
    (faq) => faq.review?.reviewedBy === author.id && faq.slug,
  );

  return (
    <>
      <JsonLd
        graph={[
          {
            "@type": "ProfilePage",
            "@id": `${url}#profile`,
            url,
            mainEntity: { "@id": `${url}#person` },
          },
          {
            "@type": "Person",
            "@id": `${url}#person`,
            name: author.name,
            url,
            ...(author.image ? { image: absoluteUrl(author.image) } : {}),
            jobTitle:
              t.authors.roles[author.roleKey as keyof typeof t.authors.roles],
            worksFor: { "@id": ORG_ID },
            knowsAbout: [...author.knowsAbout],
            ...(author.sameAs.length ? { sameAs: [...author.sameAs] } : {}),
          },
          breadcrumbs({
            locale,
            id: "author",
            values: { slug },
            labels: t.routes,
            leafLabel: author.name,
          }),
        ]}
      />

      <PageHero
        eyebrow={t.authors.roles[author.roleKey as keyof typeof t.authors.roles]}
        heading={author.name}
      />

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[96px]">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
              {author.image ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={author.image}
                    alt={author.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="max-w-[720px]">
                <h2 className="text-[11px] uppercase tracking-[0.1em] text-ink/50">
                  {t.authors.credentials}
                </h2>
                {author.credentials.length ? (
                  <ul className="mt-3 flex flex-col gap-2 text-[14px] leading-[22px] text-ink">
                    {author.credentials.map((credential) => (
                      <li key={credential}>{credential}</li>
                    ))}
                  </ul>
                ) : (
                  /* Left blank on purpose. Inventing a qualification for a
                     real person is worse than admitting we have not confirmed
                     one — and this page exists to establish trust. */
                  <p className="mt-3 text-[13.5px] leading-[21px] text-ink/55">
                    {t.authors.noCredentials}
                  </p>
                )}

                <h2 className="mt-10 text-[11px] uppercase tracking-[0.1em] text-ink/50">
                  {t.authors.knowsAbout}
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {author.knowsAbout.map((subject) => (
                    <li
                      key={subject}
                      className="rounded-full border border-ink/20 px-4 py-1.5 text-[12px] text-ink/75"
                    >
                      {subject}
                    </li>
                  ))}
                </ul>

                {reviewedProgrammes.length || reviewedFaqs.length ? (
                  <>
                    <h2 className="mt-10 text-[11px] uppercase tracking-[0.1em] text-ink/50">
                      {t.authors.reviewedContent}
                    </h2>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {reviewedProgrammes.map((programme) => (
                        <li key={`${programme.category}-${programme.slug}`}>
                          <Link
                            href={buildPath(
                              programme.category === "citizenship"
                                ? "citizenshipProgramme"
                                : "goldenVisaProgramme",
                              { programme: programme.slug },
                            )}
                            className="text-[14px] leading-[22px] text-ink underline-offset-4 hover:underline"
                          >
                            {programme.officialName}
                          </Link>
                        </li>
                      ))}
                      {reviewedFaqs.map((faq) => (
                        <li key={faq.id}>
                          <Link
                            href={buildPath("faq", { slug: faq.slug! })}
                            className="text-[14px] leading-[22px] text-ink underline-offset-4 hover:underline"
                          >
                            {faq.question}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
