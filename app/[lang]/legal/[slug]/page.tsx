import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { imageCredits } from "@/app/lib/credits";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";

/**
 * The legal pages.
 *
 * The route exists because the footer links to it and the legacy
 * `/privacy-policy` redirects here, so leaving it unbuilt would mean answering
 * a permanent redirect with a 404. The text itself is Multi Mulk's to supply —
 * a privacy policy written by anyone else is not a privacy policy.
 *
 * `image-credits` is the exception, and the reason it lives here rather than
 * waiting for copy: two Creative Commons photographs on the site require their
 * author, licence and a link to be reachable by a reader, so this page is not
 * a placeholder for something Multi Mulk will write — it is the thing that
 * keeps those two images licensed. It renders from `lib/credits.ts`.
 */
const legalSlugs = ["privacy-policy", "terms", "image-credits"] as const;
type LegalSlug = (typeof legalSlugs)[number];

const isLegalSlug = (value: string): value is LegalSlug =>
  (legalSlugs as readonly string[]).includes(value);

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
    // Nothing to rank for. The credits page is worth following, not indexing:
    // it exists for the reader who looks for it and for the licence, not for
    // search.
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({
  params,
}: PageProps<"/[lang]/legal/[slug]">) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const t = await getDictionary();
  const title = await titleFor(slug);
  const copy = t.legal.credits;

  return (
    <>
      <div className="relative">
        <SiteNav />
        <section className="bg-forest py-[96px]">
          <Container>
            <h1 className="font-display text-[34px] leading-[1.2] text-cream sm:text-[44px]">
              <AnimatedTitle variant="banner">{title}</AnimatedTitle>
            </h1>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            {slug === "image-credits" ? (
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

                      {/* Author, source and licence, each a link the licence
                          actually requires rather than a bare name. */}
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
            ) : (
              <p className="max-w-[720px] text-[15px] leading-[26px] text-ink/70">
                {t.legal.pending}
              </p>
            )}
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
