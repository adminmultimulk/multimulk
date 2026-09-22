import type { Metadata } from "next";
import { InsightsSection } from "@/app/components/insights-section";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    ...t.meta.publications,
    alternates: await alternatesFor("/knowledge/publications"),
  };
}

export default function PublicationsPage() {
  return <InsightsSection section="publications" />;
}
