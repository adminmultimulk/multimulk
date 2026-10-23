import type { NextRequest } from "next/server";
import { requireSuperadmin } from "@/app/lib/admin/guard";
import { leadFilters, leadsCsv, leadWhere } from "@/app/lib/admin/leads";
import { prisma } from "@/app/lib/db";

/**
 * The Leads list as a spreadsheet, with the same filters as the page. Layouts
 * do not wrap route handlers, so the guard is called here as well — see
 * `../../events/report/csv/route.ts`.
 */
export async function GET(request: NextRequest) {
  await requireSuperadmin();

  const filters = leadFilters(Object.fromEntries(request.nextUrl.searchParams));
  const leads = await prisma.lead.findMany({
    where: leadWhere(filters),
    orderBy: { submittedAt: "desc" },
  });
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(leadsCsv(leads), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="multimulk-leads-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
