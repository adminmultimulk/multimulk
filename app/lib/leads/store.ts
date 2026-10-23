/**
 * The leads collection: every enquiry, readable from the dashboard.
 *
 * A destination in `./sink.ts` like Bitrix24 and the team inbox — a row here
 * is somewhere the lead can be read back from — so a save that fails is logged
 * and reported there exactly as a CRM failure would be.
 */

import "server-only";
import { prisma } from "../db";
import type { Lead } from "./schema";

/** Stores the lead and hands back its row id. */
export async function saveLead(lead: Lead): Promise<string> {
  const row = await prisma.lead.create({
    data: {
      kind: lead.enquiryType,
      name: lead.name,
      phone: lead.phone,
      phoneCountry: lead.phoneCountry ?? null,
      email: lead.email,
      subject: lead.subject,
      message: lead.message,
      locale: lead.locale,
      path: lead.source.path,
      programme: lead.source.programme ?? null,
      submittedAt: new Date(lead.submittedAt),
    },
    select: { id: true },
  });
  return row.id;
}

/** Links the stored row to the card Bitrix24 created for the same lead. */
export async function linkBitrix(id: string, bitrixId: string): Promise<void> {
  await prisma.lead.update({ where: { id }, data: { bitrixId } });
}
