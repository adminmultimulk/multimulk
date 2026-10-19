import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { GuideForm } from "@/app/components/guide-form";
import { JsonLd } from "@/app/components/json-ld";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { documentCover, libraryDocuments } from "@/app/lib/documents";
import { company, ogImage } from "@/app/lib/content";
import { intlLocale } from "@/app/lib/i18n/config";
import { alternatesFor, getI18n } from "@/app/lib/i18n";
import { mintFormToken } from "@/app/lib/leads/token";
import { routes } from "@/app/lib/routes";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

const GUIDE_SLUG = "turkiye-citizenship-guide";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  const { title, description } = t.freeGuide.meta;
  return {
    title: { absolute: title },
    description,
    alternates: await alternatesFor(routes.freeGuide.pattern),
    openGraph: {
      title,
      description,
      siteName: company.name,
      locale: intlLocale[locale],
      type: "website",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FreeGuidePage() {
  const { locale, t } = await getI18n();
  const copy = t.freeGuide;
  const guide = libraryDocuments.find((doc) => doc.slug === GUIDE_SLUG);
  const item = t.documents.items[GUIDE_SLUG];

  return (
    <>
      <JsonLd
        graph={[breadcrumbs({ locale, id: "freeGuide", labels: t.routes })]}
      />

      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[520px] items-end overflow-hidden bg-forest-deep pb-14 pt-36 lg:min-h-[640px] lg:pb-20">
          <Image
            src="/images/cbi/cbi-documents.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/45" />

          <Container className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[780px] font-display text-[40px] leading-[1.1] text-white sm:text-[58px]">
              <AnimatedTitle>{copy.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[560px] text-[15px] leading-[25px] text-white/85">
              {copy.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1 py-16 lg:py-20">
        <Container>
          <div className="bg-mist p-8 sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              <div>
                <h2 className="max-w-[420px] font-display text-[30px] leading-[1.24] text-ink sm:text-[38px]">
                  {copy.leadHeading}
                </h2>
                <p className="mt-6 max-w-[440px] text-[13.5px] leading-[23px] text-ink/80">
                  {copy.leadBody}
                </p>

                <ul className="mt-9 space-y-4">
                  {copy.includes.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[13.5px] leading-[22px] text-ink/85"
                    >
                      <span
                        aria-hidden
                        className="mt-[8px] size-1.5 shrink-0 rotate-45 bg-gold"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {guide ? (
                  <div className="relative mt-10 aspect-[16/10] w-full max-w-[420px] overflow-hidden bg-white">
                    <Image
                      src={documentCover(GUIDE_SLUG)}
                      alt=""
                      fill
                      sizes="420px"
                      className="object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-forest-deep/80 px-5 py-4 text-[12.5px] text-cream">
                      {item.title}
                    </span>
                  </div>
                ) : null}
              </div>

              <div>
                <h2 className="font-display text-[26px] leading-[1.24] text-ink sm:text-[32px]">
                  {copy.formHeading}
                </h2>
                <p className="mt-4 max-w-[420px] text-[13.5px] leading-[23px] text-ink/80">
                  {copy.formBody}
                </p>
                <div className="mt-8">
                  <GuideForm token={mintFormToken()} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
