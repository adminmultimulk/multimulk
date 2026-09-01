import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import {
  PropertySearch,
  type InitialFilters,
} from "@/app/components/property-search";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { currencies, type Currency } from "@/app/lib/properties";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { ...t.meta.search, alternates: await alternatesFor("/search-property") };
}

/** Query params arrive as string | string[] | undefined; normalise to a list. */
function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : value.split(","))
    .map((v) => v.trim())
    .filter(Boolean);
}

function one(value: string | string[] | undefined, fallback: string) {
  const [first] = list(value);
  return first ?? fallback;
}

export default async function SearchPropertyPage({
  searchParams,
}: PageProps<"/[lang]/search-property">) {
  const t = await getDictionary();
  const params = await searchParams;
  const currency = one(params.currency, "USD").toUpperCase();

  const initial: InitialFilters = {
    query: one(params.q, ""),
    types: list(params.type),
    bedrooms: list(params.bedroom),
    currency: (currencies as string[]).includes(currency)
      ? (currency as Currency)
      : "USD",
    maxPrice: one(params.max, "Any"),
    location: one(params.location, "Any"),
    cbiOnly: one(params.cbi, "") === "1",
  };

  return (
    <>
      <div className="relative">
        <SiteNav />
        <section className="relative flex h-[495px] items-end overflow-hidden bg-forest">
          <Image
            src="/images/listing-hero.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/85 via-forest-deep/45 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-forest-deep/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-t from-forest-deep/80 to-transparent" />

          <Container className="relative pb-14">
            <h1 className="max-w-[662px] font-display text-[40px] leading-[1.14] text-white sm:text-[54px]">
              <AnimatedTitle>{t.search.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[500px] text-[13px] leading-[21px] text-cream/90">
              {t.search.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1 py-16 lg:py-20">
        <Container>
          <PropertySearch initial={initial} />
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
