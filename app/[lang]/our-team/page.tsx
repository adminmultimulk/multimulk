import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { TeamCta } from "@/app/components/team-cta";
import { TeamLeadership } from "@/app/components/team-leadership";
import { TeamPeople } from "@/app/components/team-people";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { breadcrumbs } from "@/app/lib/seo/jsonld";
import { teamImages } from "@/app/lib/team";

/**
 * /our-team.
 *
 * Three things, in the order a reader wants them: who leads the firm, what
 * they are like to deal with, and how to start. The About page carries the
 * history and the portfolio, so neither is repeated here.
 *
 * The roster comes from `lib/about.ts`. If the page looks short, that is the
 * roster being two people long, not the layout — the fix is to add people
 * there, with their real roles.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { ...t.meta.team, alternates: await alternatesFor("/our-team") };
}

export default async function TeamPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd graph={[breadcrumbs({ locale, id: "team", labels: t.routes })]} />

      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[560px] items-center overflow-hidden bg-forest lg:h-[720px]">
          <Image
            src={teamImages.hero}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          {/* The frame is brightly lit, so the type side carries a heavier
              wash than the standard hero and the nav gets its own. */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-black/70 to-transparent" />

          <Container className="relative pt-24 lg:pt-32">
            <h1 className="max-w-[620px] font-display text-[40px] leading-[1.1] text-white sm:text-[56px]">
              <AnimatedTitle>{t.team.hero.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[520px] text-[13px] leading-[22px] text-white/85">
              {t.team.hero.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <TeamLeadership />
        <TeamPeople />
        <TeamCta />
      </main>

      <SiteFooter />
    </>
  );
}
