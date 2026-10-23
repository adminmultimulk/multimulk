"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { isEmail } from "@/app/lib/events/parse";
import { isEnquiryType } from "@/app/lib/leads/schema";
import { requireSuperadmin, type ActionState } from "./guard";
import { field } from "./validate";

/**
 * Correcting and removing leads on the dashboard.
 *
 * Neither touches Bitrix24: the card there is the sales team's, and editing it
 * belongs in Bitrix. These keep the dashboard's own list honest — a typo in a
 * number fixed, a test submission cleared away.
 */

function changed() {
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

/** E.164 as stored: the digits, with the plus put back on the front. */
function normalisePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

export async function updateLead(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireSuperadmin();

  const id = field(form, "id");
  if (!id) return { error: "That lead no longer exists." };

  const name = field(form, "name");
  const email = field(form, "email").toLowerCase();
  const phone = normalisePhone(field(form, "phone"));
  const kind = field(form, "kind");
  const subject = field(form, "subject");
  const message = field(form, "message");
  const notes = field(form, "notes");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "A name is required.";
  if (email && !isEmail(email)) fieldErrors.email = "That is not an email address.";
  if (!email && !phone)
    fieldErrors.email = "An email address or a phone number is needed.";
  if (phone && phone.length < 8) fieldErrors.phone = "That number is too short.";
  if (!isEnquiryType(kind)) fieldErrors.kind = "Choose a form.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const updated = await prisma.lead.updateMany({
    where: { id },
    data: { name, email, phone, kind, subject, message, notes: notes || null },
  });
  if (updated.count === 0) return { error: "That lead no longer exists." };

  changed();
  return { success: `${name} saved.` };
}

export async function deleteLead(id: string): Promise<void> {
  await requireSuperadmin();
  await prisma.lead.deleteMany({ where: { id } });
  changed();
}
