import { EVENT } from "@/app/lib/events/config";
import { buildReport, reportCsv } from "@/app/lib/events/report";
import { requireSuperadmin } from "@/app/lib/admin/guard";

/**
 * The report as a spreadsheet.
 *
 * A route handler rather than a page because the answer is a file. It sits
 * under the dashboard's path but not under its layout — layouts do not wrap
 * route handlers — so the guard is called here explicitly. That is the whole
 * reason `requireSuperadmin` lives in a module of its own rather than in the
 * layout: every entrance has to be able to call it.
 */
export async function GET() {
  await requireSuperadmin();

  const report = await buildReport();
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(reportCsv(report), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${EVENT.key}-visitors-${stamp}.csv"`,
      // A stale download of a list that changes hourly is worse than no
      // download at all.
      "cache-control": "no-store",
    },
  });
}
