import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { ArticleCard } from "./article-card";
import { Container, SectionIntro } from "./container";
import { ContactForm } from "./contact-form";
import { Figure, LastReviewed } from "./figure";
import { JsonLd } from "./json-ld";
import { Link } from "./link";
import { ProgrammeTable } from "./programme-table";
import { ServiceFaq } from "./service-faq";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { mergedArticles } from "@/app/lib/cms/articles";
import { comparisonTable, getComparison } from "@/app/lib/comparisons";
import { getFigure } from "@/app/lib/figures";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import { mintFormToken } from "@/app/lib/leads/token";
import type { LegalReview, ReviewSource } from "@/app/lib/review";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs, faqPage, routeUrl, ORG_ID } from "@/app/lib/seo/jsonld";
import type { ServicePage as Page } from "@/app/lib/service-pages";

/**
 * An advisory landing page: what Multi Mulk does about a programme, ending
 * on the enquiry form.
 *
 * One component for both pages in `service-pages.ts`. The sections run in
 * the order a reader who arrived from a search query needs them — what it is,
 * who it is for, how it works, the figures, what to read, the questions, the
 * form — and every section is copy handed in, so the page has no opinion of
 * its own about which programme it is describing.
 */
export async function ServicePage({ page }: { page: Page }) {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  const comparison = page.comparison
    ? getComparison(page.comparison.slug)
    : undefined;

  // The reading rail is whatever the Knowledge Centre currently has under
  // those slugs — a piece not yet published is simply not shown.
  const articles = await mergedArticles();
  const reading = page.reading.slugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article) => article !== undefined);

  const review = page.stats ? statsReview(page.stats) : undefined;
  const url = routeUrl(locale, page.routeId);

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbs({ locale, id: page.routeId, labels: t.routes }),
          {
            "@type": "Service",
            "@id": `${url}#service`,
            name: page.meta.title,
            description: page.meta.description,
            serviceType: "Citizenship by investment advisory",
            provider: { "@id": ORG_ID },
            url,
            ...(review ? { dateModified: review.reviewedOn } : {}),
          },
          faqPage(`${url}#faq`, page.faq.items),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[560px] items-center overflow-hidden bg-forest lg:h-[720px]">
          <Image
            src={page.hero.image}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-black/70 to-transparent" />

          <Container className="relative pt-24 lg:pt-32">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
              {page.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[800px] font-display text-[38px] leading-[1.12] text-white sm:text-[56px]">
              <AnimatedTitle>{page.hero.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[620px] text-[13.5px] leading-[23px] text-white/85">
              {page.hero.body}
            </p>
            <a
              href="#enquire"
              className="mt-9 inline-block rounded-full bg-cream px-9 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
            >
              {page.hero.cta}
            </a>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        {/* The figures, read from the registry with their qualifiers attached. */}
        {page.stats && review ? (
          <section className="bg-mist py-[56px] lg:py-[72px]">
            <Container>
              <dl className="grid grid-cols-1 gap-px bg-ink/12 text-ink sm:grid-cols-2 xl:grid-cols-4">
                {page.stats.map((stat) => (
                  <div
                    key={stat.figure}
                    className="bg-mist px-7 py-8 lg:px-9 lg:py-10 xl:px-7"
                  >
                    <Figure id={stat.figure} label={stat.label} size="lg" />
                  </div>
                ))}
              </dl>
              {/* Rendered wherever the site states a figure it did not
                  invent: when it was checked, by whom, against what. */}
              <LastReviewed review={review} className="mt-5" />
            </Container>
          </section>
        ) : null}

        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
              <div>
                <h2 className="font-display text-[28px] leading-[1.24] text-ink sm:text-[36px]">
                  <AnimatedTitle variant="section">
                    {page.intro.heading}
                  </AnimatedTitle>
                </h2>
                <div className="mt-8 space-y-5 text-[14px] leading-[24px] text-ink/80">
                  {page.intro.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                  {page.intro.imageEyebrow}
                </p>
                <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={page.intro.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-mist py-[72px] lg:py-[104px]">
          <Container>
            <SectionIntro
              eyebrow={page.audience.eyebrow}
              heading={page.audience.heading}
              body={page.audience.body}
            />
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:gap-7">
              {page.audience.items.map((item, index) => (
                <li
                  key={item.title}
                  className="bg-white p-7 shadow-[0_18px_50px_-30px_rgba(7,31,19,0.55)] lg:p-8"
                >
                  <div className="flex items-start justify-between gap-5 border-b border-ink/12 pb-4">
                    <span className="num font-display text-[40px] leading-none text-ink/75">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="max-w-[220px] pt-2 text-end text-[10.5px] font-medium uppercase leading-[15px] tracking-[0.1em] text-gold">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-5 text-[12.5px] leading-[21px] text-ink/80">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <SectionIntro
              eyebrow={page.scope.eyebrow}
              heading={page.scope.heading}
              body={page.scope.body}
            />
            <ol className="mx-auto mt-12 max-w-[880px] lg:mt-16">
              {page.scope.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-4 border-t border-ink/12 py-7 sm:grid-cols-[72px_1fr] sm:gap-8"
                >
                  <span className="num font-display text-[32px] leading-none text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[20px] leading-[1.3] text-ink sm:text-[23px]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-[23px] text-ink/80">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {comparison && page.comparison ? (
          <section className="bg-mist py-[72px] lg:py-[96px]">
            <Container>
              <h2 className="font-display text-[26px] leading-[1.25] text-ink sm:text-[32px]">
                {page.comparison.heading}
              </h2>
              <p className="mt-4 max-w-[680px] text-[14px] leading-[23px] text-ink/70">
                {page.comparison.body}
              </p>
              <div className="mt-9 bg-white p-6 lg:p-8">
                <ProgrammeTable rows={comparisonTable(comparison)} />
              </div>
              <Link
                href={page.comparison.href}
                className="mt-6 inline-block text-[13px] text-forest underline underline-offset-4 hover:text-gold"
              >
                {t.compare.heading} →
              </Link>
            </Container>
          </section>
        ) : null}

        {reading.length > 0 ? (
          <section className="bg-white py-[72px] lg:py-[96px]">
            <Container>
              <h2 className="font-display text-[26px] leading-[1.25] text-ink sm:text-[32px]">
                {page.reading.heading}
              </h2>
              <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {reading.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    headingLevel={3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <ServiceFaq heading={page.faq.heading} items={page.faq.items} />

        <section
          id="enquire"
          className="scroll-mt-[72px] bg-white py-[72px] lg:py-[104px]"
        >
          <Container>
            <div className="bg-mist p-8 sm:p-12 lg:p-16">
              <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
                <div>
                  <h2 className="max-w-[440px] font-display text-[28px] leading-[1.24] text-ink sm:text-[36px]">
                    {page.enquire.heading}
                  </h2>
                  <p className="mt-6 max-w-[440px] text-[13.5px] leading-[23px] text-ink/80">
                    {page.enquire.body}
                  </p>
                  <p className="mt-8 text-[12.5px] leading-[21px] text-ink/60">
                    <Link
                      href={buildPath("contact")}
                      className="underline underline-offset-4 hover:text-gold"
                    >
                      {t.routes.contact}
                    </Link>
                  </p>
                </div>
                <ContactForm
                  token={mintFormToken()}
                  programme={page.enquire.programme ?? page.key}
                  defaultEnquiry={page.enquire.defaultEnquiry}
                />
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

/**
 * The review line for a stat row: the oldest check among the figures shown,
 * with every source they cite. The same rule as `programmeReview` in
 * `citizenship.ts`, over a list of figure ids rather than a programme.
 */
function statsReview(stats: NonNullable<Page["stats"]>): LegalReview {
  const reviews = stats.map((stat) => getFigure(stat.figure).review);
  const oldest = reviews.reduce((a, b) =>
    a.reviewedOn <= b.reviewedOn ? a : b,
  );
  const sources = new Map<string, ReviewSource>();
  for (const review of reviews) {
    for (const source of review.sources) sources.set(source.url, source);
  }
  return { ...oldest, sources: [...sources.values()] };
}
