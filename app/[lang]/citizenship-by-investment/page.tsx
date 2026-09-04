import type { Metadata } from "next";
import { PillarHub } from "@/app/components/pillar-hub";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";
import { isPublishable, programmesIn } from "@/app/lib/programmes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.pillars.citizenship.heading,
    description: t.pillars.citizenship.body,
    alternates: await alternatesFor("/citizenship-by-investment"),
  };
}

export default async function CitizenshipHubPage() {
  const t = await getDictionary();
  return (
    <PillarHub
      routeId="citizenshipHub"
      programmeRouteId="citizenshipProgramme"
      copy={t.pillars.citizenship}
      programmes={programmesIn("citizenship").filter(isPublishable)}
    />
  );
}
