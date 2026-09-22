import type { Metadata } from "next";
import { ServicePage } from "@/app/components/service-page";
import { alternatesFor } from "@/app/lib/i18n";
import { servicePages } from "@/app/lib/service-pages";

const page = servicePages.eligibilityReview;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: await alternatesFor(page.path),
  };
}

/** The written eligibility review for Turkish citizenship by investment. */
export default function EligibilityReviewPage() {
  return <ServicePage page={page} />;
}
