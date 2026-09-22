import type { Metadata } from "next";
import { InsightsSection } from "@/app/components/insights-section";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    ...t.meta.events,
    alternates: await alternatesFor("/knowledge/events"),
  };
}

export default function EventsPage() {
  return <InsightsSection section="events" />;
}
