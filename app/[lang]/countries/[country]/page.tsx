import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { Link } from "@/app/components/link";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import {
  programmes,
  type CountryCode,
  type Programme,
} from "@/app/lib/programmes";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";

/**
 * The country hubs cut across the pillars: someone whose question is "what can
 * I do in Türkiye?" is not asking about citizenship or residency or property
 * separately. They are also where the legacy site's own country roots —
 * /turkey, /uae, /eu — are redirected, so these URLs have history behind them.
 */
const countryNames: Record<CountryCode, string> = {
  tr: "Türkiye",
  gd: "Grenada",
  dm: "Dominica",
  kn: "St Kitts and Nevis",
  lc: "Saint Lucia",
  ag: "Antigua and Barbuda",
  ae: "United Arab Emirates",
  pt: "Portugal",
  gr: "Greece",
  mt: "Malta",
};

const countries = [...new Set(programmes.map((p) => p.country))];

function isCountry(value: string): value is CountryCode {
  return (countries as string[]).includes(value);
}

function programmesFor(country: CountryCode): Programme[] {
  return programmes.filter((programme) => programme.country === country);
}

export function generateStaticParams() {
  return locales.flatMap((lang) => countries.map((country) => ({ lang, country })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/countries/[country]">): Promise<Metadata> {
  const { country } = await params;
  if (!isCountry(country)) return {};
  const t = await getDictionary();

  return {
    title: countryNames[country],
    description: t.pillars.citizenship.body,
    alternates: await alternatesFor(`/countries/${country}`),
  };
}

export default async function CountryPage({
  params,
}: PageProps<"/[lang]/countries/[country]">) {
  const { country } = await params;
  if (!isCountry(country)) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const list = programmesFor(country);
  const name = countryNames[country];

  const routeFor = (programme: Programme) =>
    programme.category === "citizenship"
      ? ("citizenshipProgramme" as const)
      : ("goldenVisaProgramme" as const);

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id: "country",
            values: { country },
            name,
            description: t.pillars.citizenship.body,
            itemUrls: list.map((programme) =>
              routeUrl(locale, routeFor(programme), {
                programme: programme.slug,
              }),
            ),
          }),
          breadcrumbs({
            locale,
            id: "country",
            values: { country },
            labels: t.routes,
            leafLabel: name,
          }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="bg-forest py-[104px] lg:py-[128px]">
          <Container>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
              {t.routes.country}
            </p>
            <h1 className="mt-4 font-display text-[40px] leading-[1.14] text-cream sm:text-[54px]">
              <AnimatedTitle variant="banner">{name}</AnimatedTitle>
            </h1>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <ul className="grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
              {list.map((programme) => (
                <li key={`${programme.category}-${programme.slug}`} className="bg-white">
                  <Link
                    href={buildPath(routeFor(programme), {
                      programme: programme.slug,
                    })}
                    className="group block h-full p-8 transition-colors hover:bg-mist"
                  >
                    <p className="text-[11px] uppercase tracking-[0.1em] text-ink/50">
                      {programme.category === "citizenship"
                        ? t.pillars.citizenship.eyebrow
                        : t.pillars.goldenVisa.eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-[22px] leading-[1.28] text-ink">
                      {programme.officialName}
                    </h2>
                    <span className="mt-6 block text-[12.5px] text-gold group-hover:underline">
                      {t.common.learnMore}
                    </span>
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
