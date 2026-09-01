import { Articles } from "@/app/components/articles";
import { Awards } from "@/app/components/awards";
import { CaribbeanRetreats } from "@/app/components/caribbean-retreats";
import { Destinations } from "@/app/components/destinations";
import { Hero } from "@/app/components/hero";
import { Regions } from "@/app/components/regions";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { TurkiyePortfolio } from "@/app/components/turkiye-portfolio";
import { Welcome } from "@/app/components/welcome";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { ...t.meta.home, alternates: await alternatesFor("/") };
}

export default function Home() {
  return (
    <>
      <div className="relative">
        <SiteNav />
        <Hero />
      </div>
      <main className="flex-1">
        <Welcome />
        <Regions />
        <TurkiyePortfolio />
        <Awards />
        <CaribbeanRetreats />
        <Destinations />
        <Articles />
      </main>
      <SiteFooter />
    </>
  );
}
