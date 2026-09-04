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
        description="Save it as a draft while the details are still being confirmed. Nothing reaches the search page until you publish."
      />
      <PropertyForm property={emptyProperty} locations={places} />
    </>
  );
}
