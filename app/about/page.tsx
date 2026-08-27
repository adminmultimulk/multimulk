import Image from "next/image";
import type { Metadata } from "next";
import { AboutDevelopments } from "../components/about-developments";
import { AboutIntro } from "../components/about-intro";
import { AboutLeadership } from "../components/about-leadership";
import { AboutMap } from "../components/about-map";
import { AboutPlaces } from "../components/about-places";
import { AboutPrinciples } from "../components/about-principles";
import { AboutRegions } from "../components/about-regions";
import { AnimatedTitle } from "../components/animated-title";
import { Container } from "../components/container";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { aboutHero } from "../lib/about";

export const metadata: Metadata = {
  title: "About Us | Multi Mulk",
  description:
    "Multi Mulk is an international property and citizenship advisory, connecting global citizens with landmark residences across Türkiye and the Caribbean.",
};

export default function AboutPage() {
  return (
    <>
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
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/80 via-forest-deep/35 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-forest-deep/70 to-transparent" />

          <Container className="relative pt-24 lg:pt-32">
            <h1 className="max-w-[620px] font-display text-[40px] leading-[1.1] text-white sm:text-[58px]">
              <AnimatedTitle>{aboutHero.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[590px] text-[13px] leading-[22px] text-white/85">
              {aboutHero.body}
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
