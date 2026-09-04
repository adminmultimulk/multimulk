import Link from "next/link";
import type { Metadata } from "next";
import { ActionButton } from "@/app/components/admin/action-button";
import { Button, Empty, PageHeading, StatusPill } from "@/app/components/admin/ui";
import {
  deleteProperty,
  toggleSoldOut,
  unpublishProperty,
} from "@/app/lib/admin/property-actions";
import { requirePropertyAccess } from "@/app/lib/admin/guard";
import { prisma } from "@/app/lib/db";

export const metadata: Metadata = { title: "Properties" };

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default async function PropertiesPage() {
  const user = await requirePropertyAccess();

  const properties = await prisma.property.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: { lister: { select: { name: true, id: true } } },
  });

  return (
    <>
      <PageHeading
        title="Properties"
        description="Published listings appear on /search-property alongside the inventory that ships with the site."
        actions={
          <Link href="/admin/properties/new">
            <Button>Add a listing</Button>
          </Link>
        }
      />

      {properties.length === 0 ? (
        <Empty>
          No listings yet. The search page is still showing only the units that
          ship with the site.
        </Empty>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink/10 bg-white">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead className="border-b border-ink/10 text-[11px] tracking-[0.06em] text-ink/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Unit</th>
                <th className="px-4 py-3 font-medium">Where</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-ink/6 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="font-medium text-ink hover:text-forest"
                    >
                      {property.title}
                    </Link>
                    <span className="block text-[11px] text-ink/45">
                      {property.project} · {property.lister.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {property.location}
                    <span className="block text-[11px] text-ink/45">
                      {property.country}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/70 tabular-nums">
                    {usd.format(property.priceUSD)}
                    {property.cbiEligible ? (
                      <span className="block text-[11px] text-forest">
                        CBI eligible
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={property.status} />
                    {property.soldOut ? (
                      <span className="mt-1 block text-[11px] text-ink/50">
                        Sold out
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <ActionButton
                        action={toggleSoldOut.bind(
                          null,
                          property.id,
                          !property.soldOut,
                        )}
                        label={property.soldOut ? "Mark available" : "Mark sold"}
                        busyLabel="Saving…"
                      />
                      {property.status === "PUBLISHED" ? (
                        <ActionButton
                          action={unpublishProperty.bind(null, property.id)}
                          label="Take offline"
                          busyLabel="Removing…"
                        />
                      ) : null}
                      {property.lister.id === user.id ||
                      user.role === "SUPERADMIN" ? (
                        <ActionButton
                          action={deleteProperty.bind(null, property.id)}
                          label="Delete"
                          confirmLabel="Delete for good"
                          busyLabel="Deleting…"
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
