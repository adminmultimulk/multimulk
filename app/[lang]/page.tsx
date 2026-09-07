import { Articles } from "@/app/components/articles";
import { Awards } from "@/app/components/awards";
import { CaribbeanRetreats } from "@/app/components/caribbean-retreats";
import { Destinations } from "@/app/components/destinations";
import { Hero } from "@/app/components/hero";
import { Regions } from "@/app/components/regions";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import {
  TurkiyePortfolio,
  type PortfolioItem,
} from "@/app/components/turkiye-portfolio";
import { VideoFeature } from "@/app/components/video-feature";
import { Welcome } from "@/app/components/welcome";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { mergedArticles } from "@/app/lib/cms/articles";
import { developments } from "@/app/lib/cms/developments";
import { buildPath } from "@/app/lib/routes";
import { LATEST_ARTICLES } from "@/app/lib/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { ...t.meta.home, alternates: await alternatesFor("/") };
}

export default async function Home() {
  // The four newest, whichever collection they came from. Sliced here rather
  // than in `content.ts` because the dashboard's articles are only known at
  // request time, and a static export of "the latest" would freeze on the day
  // it was built.
  const latest = (await mergedArticles()).slice(0, LATEST_ARTICLES);

  // The Türkiye section pages through the developments published there. Same
  // reasoning as the articles above: what the portfolio holds is known at
  // request time, and a list written into the source freezes on the day it
  // was typed.
  const turkiye: PortfolioItem[] = (await developments())
    .filter((development) => development.country.includes("Türkiye"))
    .map((development) => ({
      key: development.slug,
      name: development.name,
      image: development.image,
      href: buildPath("development", { slug: development.slug }),
      body: development.description,
    }));

  return (
    <>
      <div className="relative">
        <SiteNav />
        <Hero />
      </div>
      <main className="flex-1">
        <Welcome />
        <VideoFeature />
        <Regions />
        <TurkiyePortfolio items={turkiye} />
        <Awards />
        <CaribbeanRetreats />
        <Destinations />
        <Articles articles={latest} />
      </main>
      <SiteFooter />
    </>
  );
}
