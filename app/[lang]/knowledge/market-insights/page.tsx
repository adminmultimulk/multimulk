import type { Metadata } from "next";
import { InsightsSection } from "@/app/components/insights-section";
import { alternatesFor, getDictionary } from "@/app/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    ...t.meta.marketInsights,
    alternates: await alternatesFor("/knowledge/market-insights"),
  };
}

export default function MarketInsightsPage() {
  return <InsightsSection section="marketInsights" />;
}
