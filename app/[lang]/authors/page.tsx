import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { Link } from "@/app/components/link";
import { PageHero } from "@/app/components/page-hero";
import { SiteFooter } from "@/app/components/site-footer";
import { authors } from "@/app/lib/authors";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.authors.heading,
    description: t.authors.body,
    alternates: await alternatesFor("/authors"),
  };
}

export default async function AuthorsPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const people = Object.values(authors);

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id: "authors",
            name: t.authors.heading,
            description: t.authors.body,
            itemUrls: people.map((person) =>
              routeUrl(locale, "author", { slug: person.slug }),
            ),
          }),
          breadcrumbs({ locale, id: "authors", labels: t.routes }),
        ]}
      />

      <PageHero
        eyebrow={t.authors.eyebrow}
        heading={t.authors.heading}
        body={t.authors.body}
      />

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <ul className="grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((person) => (
                <li key={person.id} className="bg-white">
                  <Link
                    href={buildPath("author", { slug: person.slug })}
                    className="group block h-full transition-colors hover:bg-mist"
                  >
                    {person.image ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="p-7">
                      <h2 className="font-display text-[21px] leading-[1.3] text-ink">
                        {person.name}
                      </h2>
                      <p className="mt-2 text-[12.5px] text-ink/60">
                        {t.authors.roles[person.roleKey as keyof typeof t.authors.roles]}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
