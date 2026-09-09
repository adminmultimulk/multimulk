import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { ProtectionChecks } from "@/app/components/protection-checks";
import { ProtectionCta } from "@/app/components/protection-cta";
import { ProtectionFilters } from "@/app/components/protection-filters";
import { ProtectionScore } from "@/app/components/protection-score";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { protectionImages } from "@/app/lib/due-diligence";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.pillars.protection.heading,
    description: t.pillars.protection.body,
    alternates: await alternatesFor("/investor-protection"),
  };
}

export default async function InvestorProtectionPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd
        graph={[breadcrumbs({ locale, id: "investorProtection", labels: t.routes })]}
      />

      <div className="relative">
        <SiteNav />
        {/* The same opening as /about: a photograph, not a flat green band. */}
        <section className="relative flex min-h-[560px] items-center overflow-hidden bg-forest lg:h-[760px]">
          <Image
            src={protectionImages.hero}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-black/70 to-transparent" />

          <Container className="relative pt-24 lg:pt-32">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
              {t.pillars.protection.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[760px] font-display text-[38px] leading-[1.12] text-white sm:text-[56px]">
              <AnimatedTitle>{t.pillars.protection.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[600px] text-[13px] leading-[22px] text-white/85">
              {t.pillars.protection.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        {/* Eligibility, then price, then exit — the ordering is the argument. */}
        <ProtectionFilters />
        <ProtectionChecks />
        <ProtectionScore />
        <ProtectionCta />
      </main>

      <SiteFooter />
    </>
  );
}
