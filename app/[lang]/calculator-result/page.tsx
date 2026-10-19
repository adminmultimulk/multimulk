import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { CalculatorResultPanel } from "@/app/components/calculator-result-panel";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { company, ogImage } from "@/app/lib/content";
import { intlLocale } from "@/app/lib/i18n/config";
import { alternatesFor, getI18n } from "@/app/lib/i18n";
import { mintFormToken } from "@/app/lib/leads/token";
import {
  isPublishable,
  programmeKey,
  programmes,
} from "@/app/lib/programmes";
import { routes } from "@/app/lib/routes";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  const { title, description } = t.calculatorResult.meta;
  return {
    title: { absolute: title },
    description,
    // Campaign and query-parameter variants should not invent doorway pages.
    robots: { index: false, follow: true },
    alternates: await alternatesFor(routes.calculatorResult.pattern),
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

type SearchParams = Promise<{
  programme?: string;
  adults?: string;
  children?: string;
}>;

export default async function CalculatorResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, t } = await getI18n();
  const copy = t.calculatorResult;
  const params = await searchParams;

  const offered = programmes.filter(
    (programme) =>
      isPublishable(programme) &&
      programme.routes.some((route) => route.offered),
  );

  const adults =
    params.adults === "1" || params.adults === "2" ? params.adults : "2";
  const children = ["0", "1", "2", "3", "4"].includes(params.children ?? "")
    ? (params.children as string)
    : "2";
  const programme =
    params.programme &&
    offered.some((p) => programmeKey(p) === params.programme)
      ? params.programme
      : offered[0]
        ? programmeKey(offered[0])
        : "";

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbs({ locale, id: "calculatorResult", labels: t.routes }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[480px] items-end overflow-hidden bg-forest-deep pb-14 pt-36 lg:min-h-[560px] lg:pb-20">
          <Image
            src="/images/hero-beach-vista.webp"
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
            <CalculatorResultPanel
              programmes={offered}
              token={mintFormToken()}
              initialProgramme={programme}
              initialAdults={adults}
              initialChildren={children}
            />
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
