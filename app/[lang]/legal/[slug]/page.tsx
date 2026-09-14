import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { contact } from "@/app/lib/content";
import { imageCredits } from "@/app/lib/credits";
import { alternatesFor, getDictionary, getLocale, type Dictionary } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import { formatDate, interpolate, pick, pickAll } from "@/app/lib/i18n/format";
import {
  getLegalDocument,
  isLegalSlug,
  legalSlugs,
  type LegalDocument,
  type LegalSlug,
} from "@/app/lib/legal";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

/**
 * The legal pages.
 *
 * The privacy policy and the terms render from `lib/legal.ts` — the policy is
 * Multi Mulk's own text, carried over from the legacy site's /privacy-policy
 * (which redirects here) and brought up to date; the terms are new. Both are
 * staged for translation under `dictionary.legal.copy`, section by section,
 * and fall back to the English until a language fills them in.
 *
 * `image-credits` renders from `lib/credits.ts` instead: two Creative Commons
 * photographs on the site require their author, licence and a link to be
 * reachable by a reader, and this page is what keeps them licensed.
 */
export function generateStaticParams() {
  return locales.flatMap((lang) => legalSlugs.map((slug) => ({ lang, slug })));
}

async function titleFor(slug: LegalSlug) {
  const t = await getDictionary();
  if (slug === "image-credits") return t.footer.aboutItems.imageCredits;
  return t.footer.aboutItems[slug === "terms" ? "terms" : "privacy"];
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return {};

  return {
    title: await titleFor(slug),
    alternates: await alternatesFor(`/legal/${slug}`),
    // The credits page is worth following, not indexing: it exists for the
    // reader who looks for it and for the licence, not for search. The policy
    // and the terms stay crawlable — a reader searching for them should find
    // ours rather than a cached copy of the legacy page.
    ...(slug === "image-credits"
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

/**
 * A document in the reader's language: every line falls back to the English
 * in `legal.ts` through `pick`, section by section, keyed by section id.
 */
function localise(t: Dictionary, document: LegalDocument) {
  const copy = t.legal.copy[document.slug];
  return {
    intro: pickAll(copy?.intro, document.intro),
    sections: document.sections.map((section) => {
      const staged = copy?.sections?.[section.id];
      return {
        id: section.id,
        heading: pick(staged?.heading, section.heading),
        paragraphs: pickAll(staged?.paragraphs, section.paragraphs),
        bullets: section.bullets
          ? pickAll(staged?.bullets, section.bullets)
          : undefined,
        after: section.after ? pick(staged?.after, section.after) : undefined,
      };
    }),
  };
}

export default async function LegalPage({
  params,
}: PageProps<"/[lang]/legal/[slug]">) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const title = await titleFor(slug);
  const document = getLegalDocument(slug);
  const copy = document ? localise(t, document) : null;

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbs({
            locale,
            id: "legal",
            values: { slug },
            labels: t.routes,
            leafLabel: title,
          }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="bg-forest py-[96px]">
          <Container>
            <h1 className="font-display text-[34px] leading-[1.2] text-cream sm:text-[44px]">
              <AnimatedTitle variant="banner">{title}</AnimatedTitle>
            </h1>
            {document ? (
              <p className="mt-5 text-[11.5px] uppercase tracking-[0.12em] text-cream/60">
                {interpolate(t.legal.updated, {
                  date: formatDate(locale, document.updatedOn),
                })}
              </p>
            ) : null}
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            {slug === "image-credits" ? (
              <Credits t={t} />
            ) : document && copy ? (
              /* `dir="auto"`: the document reads in whatever language it is
                 actually in. Until a translation is filled in, an Arabic or
                 Urdu page carries the English text, and English set
                 right-to-left puts every full stop at the wrong end. */
              <article dir="auto" className="max-w-[760px]">
                {copy.intro.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-5 text-[15px] leading-[26px] text-ink/80 first:mt-0"
                  >
                    {paragraph}
                  </p>
                ))}

                {copy.sections.map((section) => (
                  <section key={section.id} className="mt-12">
                    <h2 className="font-display text-[24px] leading-[1.3] text-ink">
                      {section.heading}
                    </h2>
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-4 text-[14.5px] leading-[25px] text-ink/80"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets ? (
                      <ul className="mt-4 flex flex-col gap-3 ps-5">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="list-disc text-[14.5px] leading-[25px] text-ink/80 marker:text-gold"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {section.after ? (
                      <p className="mt-4 text-[14.5px] leading-[25px] text-ink/80">
                        {section.after}
                      </p>
                    ) : null}
                    {/* The contact section closes with the offices themselves,
                        read from `contact` so the policy cannot name an address
                        the footer has moved away from. */}
                    {section.id === "contact" && document.contact ? (
                      <Offices t={t} />
                    ) : null}
                  </section>
                ))}
              </article>
            ) : null}
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

/** The three offices, head office first, with the shared email once. */
function Offices({ t }: { t: Dictionary }) {
  return (
    <div className="mt-6 grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-3">
      {contact.offices.map((office) => (
        <div key={office.key} className="text-[13.5px] leading-[22px] text-ink/80">
          <p className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
            {t.footer.offices[office.key]}
            {office.headOffice ? ` · ${t.legal.headOffice}` : ""}
          </p>
          <p className="mt-2">{t.footer.addresses[office.key]}</p>
          <a
            href={`tel:${office.phone.replace(/\s/g, "")}`}
            className="num mt-1 block text-ink transition-colors hover:text-gold"
          >
            {office.phone}
          </a>
        </div>
      ))}
      <a
        href={`mailto:${contact.email}`}
        className="text-[13.5px] text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink sm:col-span-3"
      >
        {contact.email}
      </a>
    </div>
  );
}

function Credits({ t }: { t: Dictionary }) {
  const copy = t.legal.credits;
  return (
    <>
      <p className="max-w-[720px] text-[15px] leading-[26px] text-ink/70">
        {copy.intro}
      </p>

      <ul className="mt-12 max-w-[720px] divide-y divide-ink/10 border-y border-ink/10">
        {imageCredits.map((credit) => (
          <li key={credit.source.href} className="py-7">
            <h2 className="font-display text-[19px] leading-[27px] text-ink">
              {credit.subject}
            </h2>
            <p className="mt-1 text-[12.5px] leading-[19px] text-ink/55">
              {credit.usedOn}
            </p>

            {/* Author, source and licence, each a link the licence actually
                requires rather than a bare name. */}
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-[13px] leading-[21px] sm:grid-cols-[88px_1fr]">
              <dt className="text-ink/55">{copy.authorLabel}</dt>
              <dd className="text-ink">{credit.author}</dd>

              <dt className="text-ink/55">{copy.sourceLabel}</dt>
              <dd>
                <a
                  href={credit.source.href}
                  rel="noreferrer"
                  target="_blank"
                  className="text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
                >
                  {credit.source.label}
                </a>
              </dd>

              <dt className="text-ink/55">{copy.licenceLabel}</dt>
              <dd>
                <a
                  href={credit.licence.href}
                  rel="license noreferrer"
                  target="_blank"
                  className="text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
                >
                  {credit.licence.label}
                </a>
              </dd>
            </dl>

            {credit.shareAlike ? (
              <p className="mt-4 text-[12.5px] leading-[20px] text-ink/70">
                {copy.shareAlike}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-[720px] text-[12.5px] leading-[20px] text-ink/55">
        {copy.rest}
      </p>
    </>
  );
}
