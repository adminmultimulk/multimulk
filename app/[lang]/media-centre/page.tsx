import type { Metadata } from "next";
import { MediaArticles } from "@/app/components/media-articles";
import { MediaHero } from "@/app/components/media-hero";
import { MediaNewsletter } from "@/app/components/media-newsletter";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { ...t.meta.media, alternates: await alternatesFor("/media-centre") };
}

export default function MediaCentrePage() {
  return (
    <>
      <div className="relative">
        <SiteNav />
        <MediaHero />
      </div>

      <main className="flex-1">
        <MediaArticles />
        <MediaNewsletter />
      </main>

      <SiteFooter />
    </>
  );
}
