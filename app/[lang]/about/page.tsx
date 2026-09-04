import Image from "next/image";
import type { Metadata } from "next";
import { AboutDevelopments } from "@/app/components/about-developments";
import { AboutIntro } from "@/app/components/about-intro";
import { AboutLeadership } from "@/app/components/about-leadership";
import { AboutMap } from "@/app/components/about-map";
import { AboutPlaces } from "@/app/components/about-places";
import { AboutPrinciples } from "@/app/components/about-principles";
import { AboutRegions } from "@/app/components/about-regions";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { aboutHero } from "@/app/lib/about";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { ...t.meta.about, alternates: await alternatesFor("/about") };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd graph={[breadcrumbs({ locale, id: "about", labels: t.routes })]} />
      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[600px] items-center overflow-hidden bg-forest lg:h-[900px]">
          <Image
            src={aboutHero.image}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-black/70 to-transparent" />

          <Container className="relative pt-24 lg:pt-32">
            <h1 className="max-w-[620px] font-display text-[40px] leading-[1.1] text-white sm:text-[58px]">
              <AnimatedTitle>{t.about.hero.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[590px] text-[13px] leading-[22px] text-white/85">
              {t.about.hero.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <AboutIntro />
        <AboutRegions />
        <AboutPrinciples />
        <AboutDevelopments />
        <AboutLeadership />
        <AboutMap />
        <AboutPlaces />
      </main>

      <SiteFooter />
    </>
  );
}
