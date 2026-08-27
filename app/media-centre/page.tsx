import type { Metadata } from "next";
import { MediaArticles } from "../components/media-articles";
import { MediaHero } from "../components/media-hero";
import { MediaNewsletter } from "../components/media-newsletter";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";

export const metadata: Metadata = {
  title: "Media Centre | Multi Mulk",
  description:
    "Press coverage, announcements and guides from Multi Mulk — Turkish citizenship by investment, İstanbul and coastal developments, and our Caribbean portfolio.",
};

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
