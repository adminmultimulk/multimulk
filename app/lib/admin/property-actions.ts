"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { PROPERTIES_TAG } from "@/app/lib/cms/tags";
import { CBI_THRESHOLD_USD, propertyTypes } from "@/app/lib/properties";
import { requirePropertyAccess, type ActionState } from "./guard";
import {
  checkImage,
  checkSlug,
  checkbox,
  field,
  lines,
  money,
  reservedPropertySlugs,
  slugify,
} from "./validate";

/** The search page, the home hero's filters, and the merged reader behind both. */
function publishedPropertiesChanged() {
  updateTag(PROPERTIES_TAG);
  revalidatePath("/[lang]/search-property", "page");
  revalidatePath("/[lang]", "page");
}

export async function saveProperty(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requirePropertyAccess();

  const id = field(form, "id") || null;
  const title = field(form, "title");
  const slug = field(form, "slug") || slugify(title);
  const project = field(form, "project");
  const location = field(form, "location");
  const country = field(form, "country");
  const type = field(form, "type");
  const bathrooms = field(form, "bathrooms");
  const bedroom = field(form, "bedroom");
  const size = field(form, "size");
  const level = field(form, "level");
  const view = field(form, "view");
  const image = field(form, "image");
  const gallery = lines(field(form, "gallery"));
  const soldOut = checkbox(form, "soldOut");
  const publish = field(form, "intent") === "publish";

  const priceUSD = money(field(form, "priceUSD"));
  const priceEUR = money(field(form, "priceEUR"));
  const priceTRY = money(field(form, "priceTRY"));

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "A listing title is required.";
  if (!project) fieldErrors.project = "Which development is this unit in?";
  if (!location) fieldErrors.location = "A city or district is required.";
  if (!country) fieldErrors.country = "A country is required.";
  if (!propertyTypes.includes(type))
    fieldErrors.type = `Pick one of: ${propertyTypes.join(", ")}.`;
  if (!bedroom) fieldErrors.bedroom = 'Required — e.g. "Studio" or "2 Bedroom".';
  if (!bathrooms) fieldErrors.bathrooms = 'Required — e.g. "2 Bathroom".';
  if (!size) fieldErrors.size = 'Required — e.g. "1,297.59 sq. ft.".';
  if (!level) fieldErrors.level = 'Required — e.g. "Level 1-3".';
  if (!view) fieldErrors.view = 'Required — e.g. "Sea View".';

  const slugError = checkSlug(slug);
  if (slugError) fieldErrors.slug = slugError;
  else if (reservedPropertySlugs.has(slug))
    fieldErrors.slug = "The site already lists a unit at this slug.";

  if (priceUSD === null) fieldErrors.priceUSD = "Whole numbers only, no symbols.";
  if (priceEUR === null) fieldErrors.priceEUR = "Whole numbers only, no symbols.";
  if (priceTRY === null) fieldErrors.priceTRY = "Whole numbers only, no symbols.";

  if (!image) fieldErrors.image = "A card image is required.";
  const imageError = checkImage(image, "The card image");
  if (imageError) fieldErrors.image = imageError;
  for (const item of gallery) {
    const error = checkImage(item, "Every gallery image");
    if (error) {
      fieldErrors.gallery = error;
      break;
    }
  }

  if (Object.keys(fieldErrors).length)
    return { fieldErrors, error: "Nothing was saved — see the fields marked below." };

  /*
   * Eligibility is derived rather than typed, because it is a threshold and
   * not an opinion: a lister who has to remember USD 400,000 will eventually
   * tick the box on a unit that misses it. The checkbox on the form only ever
   * adds — a Caribbean unit can qualify under its own programme well below the
   * Türkiye figure — so ticking it overrides a false, never a true.
   */
  const cbiEligible =
    (priceUSD as number) >= CBI_THRESHOLD_USD || checkbox(form, "cbiEligible");

  const existing = id
    ? await prisma.property.findUnique({ where: { id }, select: { publishedAt: true } })
    : null;
  if (id && !existing) return { error: "That listing no longer exists." };

  const data = {
    slug,
    title,
    project,
    location,
    country,
    priceUSD: priceUSD as number,
    priceEUR: priceEUR as number,
    priceTRY: priceTRY as number,
    type,
    bathrooms,
    bedroom,
    size,
    level,
    view,
    soldOut,
    cbiEligible,
    image,
    gallery,
    status: publish ? ("PUBLISHED" as const) : ("DRAFT" as const),
    publishedAt: publish ? (existing?.publishedAt ?? new Date()) : (existing?.publishedAt ?? null),
  };

  try {
    if (id) await prisma.property.update({ where: { id }, data });
    else await prisma.property.create({ data: { ...data, listerId: user.id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return { fieldErrors: { slug: "Another listing already uses this slug." } };
    console.error("Could not save property:", error);
    return { error: "The database refused the change. Nothing was saved." };
  }

  publishedPropertiesChanged();
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

/** Takes a listing off the site without losing it. */
export async function unpublishProperty(id: string): Promise<void> {
  await requirePropertyAccess();
  await prisma.property.update({ where: { id }, data: { status: "DRAFT" } });
  publishedPropertiesChanged();
  revalidatePath("/admin/properties");
}

/**
 * Marks a unit sold.
 *
 * Its own action rather than a trip through the edit form: this is the change
 * a lister makes most often and under the most time pressure, and it stays
 * published — a sold unit still has a page, it simply says so.
 */
export async function toggleSoldOut(id: string, soldOut: boolean): Promise<void> {
  await requirePropertyAccess();
  await prisma.property.update({ where: { id }, data: { soldOut } });
  publishedPropertiesChanged();
  revalidatePath("/admin/properties");
}

export async function deleteProperty(id: string): Promise<void> {
  const user = await requirePropertyAccess();
  const property = await prisma.property.findUnique({
    where: { id },
    select: { listerId: true },
  });
  if (!property) return;
  if (property.listerId !== user.id && user.role !== "SUPERADMIN")
    throw new Error("Only the lister or a superadmin can delete this listing.");

  await prisma.property.delete({ where: { id } });
  publishedPropertiesChanged();
  revalidatePath("/admin/properties");
}
