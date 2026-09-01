import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Awards } from "@/app/components/awards";
import { CitizenshipAbout } from "@/app/components/citizenship-about";
import { CitizenshipAnchors } from "@/app/components/citizenship-anchors";
import { CitizenshipBenefits } from "@/app/components/citizenship-benefits";
import { CitizenshipCta } from "@/app/components/citizenship-cta";
import { CitizenshipEnquire } from "@/app/components/citizenship-enquire";
import { CitizenshipFaq } from "@/app/components/citizenship-faq";
import { CitizenshipGallery } from "@/app/components/citizenship-gallery";
import { CitizenshipHero } from "@/app/components/citizenship-hero";
import { CitizenshipIndustry } from "@/app/components/citizenship-industry";
import { CitizenshipIntro } from "@/app/components/citizenship-intro";
import { CitizenshipProcess } from "@/app/components/citizenship-process";
import { CitizenshipProjects } from "@/app/components/citizenship-projects";
import { CitizenshipSignature } from "@/app/components/citizenship-signature";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import {
  isProgrammeKey,
  programmeKeys,
  programmes,
} from "@/app/lib/citizenship";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    programmeKeys.map((programme) => ({ lang, programme })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/citizenship/[programme]">): Promise<Metadata> {
  const { programme } = await params;
  if (!isProgrammeKey(programme)) return {};

  const t = await getDictionary();
  return {
    ...t.meta.citizenship[programme],
    alternates: await alternatesFor(`/citizenship/${programme}`),
  };
}

export default async function CitizenshipPage({
  params,
}: PageProps<"/[lang]/citizenship/[programme]">) {
  const { programme: key } = await params;
  if (!isProgrammeKey(key)) notFound();

  const programme = programmes[key];

  return (
    <>
      <div className="relative">
        <SiteNav />
        <CitizenshipHero programme={programme} />
      </div>

      <main className="flex-1">
        <CitizenshipAnchors />
        <CitizenshipIntro programme={programme} />
        {/* The site-wide recognition row, in the place the reference gives it. */}
        <Awards />
        <CitizenshipBenefits programme={programme} />
        <CitizenshipGallery programme={programme} />
        <CitizenshipSignature programme={programme} />
        <CitizenshipProjects programme={programme} />
        <CitizenshipProcess programme={programme} />
        <CitizenshipIndustry programme={programme} />
        <CitizenshipAbout programme={programme} />
        <CitizenshipFaq programme={programme} />
        <CitizenshipEnquire programme={programme} />
        <CitizenshipCta programme={programme} />
      </main>

      <SiteFooter />
    </>
  );
}
