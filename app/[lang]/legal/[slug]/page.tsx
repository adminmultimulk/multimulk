import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";

/**
 * The legal pages.
 *
 * The route exists because the footer links to it and the legacy
 * `/privacy-policy` redirects here, so leaving it unbuilt would mean answering
 * a permanent redirect with a 404. The text itself is Multi Mulk's to supply —
 * a privacy policy written by anyone else is not a privacy policy.
 */
const legalSlugs = ["privacy-policy", "terms"] as const;
type LegalSlug = (typeof legalSlugs)[number];

const isLegalSlug = (value: string): value is LegalSlug =>
  (legalSlugs as readonly string[]).includes(value);

export function generateStaticParams() {
  return locales.flatMap((lang) => legalSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return {};
  const t = await getDictionary();

  return {
    title: t.footer.aboutItems[slug === "terms" ? "terms" : "privacy"],
    alternates: await alternatesFor(`/legal/${slug}`),
    // Nothing to rank for, and nothing here yet to index.
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({
  params,
}: PageProps<"/[lang]/legal/[slug]">) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const t = await getDictionary();
  const title = t.footer.aboutItems[slug === "terms" ? "terms" : "privacy"];

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
            <p className="max-w-[720px] text-[15px] leading-[26px] text-ink/70">
              {t.legal.pending}
            </p>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
