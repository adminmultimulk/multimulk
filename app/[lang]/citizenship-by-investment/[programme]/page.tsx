import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CitizenshipProgrammeDetail } from "@/app/components/citizenship-programme-page";
import { ProgrammePage } from "@/app/components/programme-page";
import { isProgrammeKey } from "@/app/lib/citizenship";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import { getProgramme, isPublishable, programmesIn } from "@/app/lib/programmes";

/**
 * A citizenship programme.
 *
 * Two of these — Türkiye and the Caribbean as a region — have a full page
 * behind them: photography, benefits, process, qualifying developments and an
 * eight-question FAQ. The individual island programmes do not yet, and get the
 * data-driven page instead. Showing the richer layout with most of it empty
 * would look like a page that failed to load rather than one still being
 * written.
 */
export function generateStaticParams() {
  const slugs = [
    "turkiye",
    "caribbean",
    ...programmesIn("citizenship")
      .filter(isPublishable)
      .map((programme) => programme.slug),
  ];
  return locales.flatMap((lang) =>
    [...new Set(slugs)].map((programme) => ({ lang, programme })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/citizenship-by-investment/[programme]">): Promise<Metadata> {
  const { programme: slug } = await params;
  const t = await getDictionary();
  const alternates = await alternatesFor(`/citizenship-by-investment/${slug}`);

  if (isProgrammeKey(slug)) {
    return { ...t.meta.citizenship[slug], alternates };
  }

  const programme = getProgramme("citizenship", slug);
  if (!programme) return {};

  return {
    title: programme.officialName,
    description: t.pillars.citizenship.body,
    alternates,
    ...(isPublishable(programme) ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function CitizenshipProgrammePage({
  params,
}: PageProps<"/[lang]/citizenship-by-investment/[programme]">) {
  const { programme: slug } = await params;

  if (isProgrammeKey(slug)) {
    return (
      <CitizenshipProgrammeDetail
        programmeKey={slug}
        routeId="citizenshipProgramme"
      />
    );
  }

  const programme = getProgramme("citizenship", slug);
  if (!programme) notFound();

  return <ProgrammePage programme={programme} routeId="citizenshipProgramme" />;
}
