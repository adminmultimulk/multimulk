import type { Metadata } from "next";
import { ServicePage } from "@/app/components/service-page";
import { alternatesFor } from "@/app/lib/i18n";
import { servicePages } from "@/app/lib/service-pages";

const page = servicePages.secondPassport;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: await alternatesFor(page.path),
  };
}

/** Global mobility: which second passport an investor is eligible for. */
export default function SecondPassportPage() {
  return <ServicePage page={page} />;
}
