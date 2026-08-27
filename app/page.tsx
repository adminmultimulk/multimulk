import { Articles } from "./components/articles";
import { Awards } from "./components/awards";
import { CaribbeanRetreats } from "./components/caribbean-retreats";
import { Destinations } from "./components/destinations";
import { Hero } from "./components/hero";
import { Regions } from "./components/regions";
import { SiteFooter } from "./components/site-footer";
import { SiteNav } from "./components/site-nav";
import { TurkiyePortfolio } from "./components/turkiye-portfolio";
import { Welcome } from "./components/welcome";

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
