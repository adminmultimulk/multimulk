import type { Metadata } from "next";
import {
  PropertyForm,
  emptyProperty,
} from "@/app/components/admin/property-form";
import { PageHeading } from "@/app/components/admin/ui";
import { requirePropertyAccess } from "@/app/lib/admin/guard";
import { mergedLocations } from "@/app/lib/cms/properties";
import { locations } from "@/app/lib/properties";

export const metadata: Metadata = { title: "New listing" };

export default async function NewPropertyPage() {
  await requirePropertyAccess();
  const places = await mergedLocations(locations);

  return (
    <>
      <PageHeading
        title="Add a listing"
        description="Publishing puts the unit on the search page and gives it a page of its own at /properties/<slug>. Save it as a draft while the details are still being confirmed — nothing is public until you publish."
      />
      <PropertyForm property={emptyProperty} locations={places} />
    </>
  );
}
