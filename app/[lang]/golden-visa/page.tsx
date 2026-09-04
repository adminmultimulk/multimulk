import type { Metadata } from "next";
import { PillarHub } from "@/app/components/pillar-hub";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { isPublishable, programmesIn } from "@/app/lib/programmes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.pillars.goldenVisa.heading,
    description: t.pillars.goldenVisa.body,
    alternates: await alternatesFor("/golden-visa"),
  };
}

export default async function GoldenVisaHubPage() {
  const t = await getDictionary();
  return (
    <PillarHub
      routeId="goldenVisaHub"
      programmeRouteId="goldenVisaProgramme"
      copy={t.pillars.goldenVisa}
      programmes={programmesIn("residency").filter(isPublishable)}
    />
  );
}
