import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProgrammePage } from "@/app/components/programme-page";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import { getProgramme, isPublishable, programmesIn } from "@/app/lib/programmes";

export function generateStaticParams() {
  // Unreviewed programmes are not pre-rendered and not linked; they resolve on
  // demand so the team can read them, and `robots` below keeps them out of the
  // index until their figures are signed off.
  return locales.flatMap((lang) =>
    programmesIn("residency")
      .filter(isPublishable)
      .map((programme) => ({ lang, programme: programme.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/golden-visa/[programme]">): Promise<Metadata> {
  const { programme: slug } = await params;
  const t = await getDictionary();
  const programme = getProgramme("residency", slug);
  if (!programme) return {};

  return {
    title: programme.officialName,
    description: t.pillars.goldenVisa.body,
    alternates: await alternatesFor(`/golden-visa/${slug}`),
    ...(isPublishable(programme) ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function GoldenVisaProgrammePage({
  params,
}: PageProps<"/[lang]/golden-visa/[programme]">) {
  const { programme: slug } = await params;
  const programme = getProgramme("residency", slug);
  if (!programme) notFound();

  return <ProgrammePage programme={programme} routeId="goldenVisaProgramme" />;
}
