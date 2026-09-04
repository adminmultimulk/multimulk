import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PropertyForm } from "@/app/components/admin/property-form";
import { PageHeading, StatusPill } from "@/app/components/admin/ui";
import { requirePropertyAccess } from "@/app/lib/admin/guard";
import { mergedLocations } from "@/app/lib/cms/properties";
import { prisma } from "@/app/lib/db";
import { locations } from "@/app/lib/properties";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditPropertyPage({
  params,
}: PageProps<"/admin/properties/[id]">) {
  await requirePropertyAccess();
  const { id } = await params;
  if (!/^[0-9a-f]{24}$/i.test(id)) notFound();

  const [property, places] = await Promise.all([
    prisma.property.findUnique({ where: { id } }),
    mergedLocations(locations),
  ]);
  if (!property) notFound();

  return (
    <>
      <PageHeading
        title="Edit listing"
        description={
          property.status === "PUBLISHED"
            ? "This listing is live. Saving publishes the change straight away."
            : "This listing is a draft — buyers cannot see it yet."
        }
        actions={<StatusPill status={property.status} />}
      />
      <PropertyForm
        property={{
          id: property.id,
          slug: property.slug,
          title: property.title,
          project: property.project,
          location: property.location,
          country: property.country,
          priceUSD: String(property.priceUSD),
          priceEUR: String(property.priceEUR),
          priceTRY: String(property.priceTRY),
          type: property.type,
          bathrooms: property.bathrooms,
          bedroom: property.bedroom,
          size: property.size,
          level: property.level,
          view: property.view,
          soldOut: property.soldOut,
          cbiEligible: property.cbiEligible,
          image: property.image,
          gallery: property.gallery,
          status: property.status,
        }}
        locations={places}
      />
    </>
  );
}
