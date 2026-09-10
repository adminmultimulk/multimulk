"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { PROPERTIES_TAG } from "@/app/lib/cms/tags";
import { isDistrict } from "@/app/lib/districts";
import { developmentSlug, getDevelopment } from "@/app/lib/cms/developments";
import {
  CBI_THRESHOLD_USD,
  propertyTypes,
  titleDeedTaxRates,
  vatRates,
} from "@/app/lib/properties";
import { requirePropertyAccess, type ActionState } from "./guard";
import {
  checkFile,
  checkHighlights,
  checkImage,
  checkSlug,
  choice,
  coordinate,
  highlightPairs,
  checkbox,
  field,
  lines,
  money,
  rate,
  reservedPropertySlugs,
  slugify,
} from "./validate";

/** The search page, the home hero's filters, and the merged reader behind both. */
function publishedPropertiesChanged() {
  updateTag(PROPERTIES_TAG);
  /*
   * The whole tree, not a handful of pages. The navigation bar carries the
   * developments assembled from published listings, and the bar is on every
   * page — so publishing a unit changes the Real Estate menu everywhere, not
   * just on the pages that list units.
   */
  revalidatePath("/[lang]", "layout");
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

  // Everything below builds the listing's own page. All of it is optional: a
  // unit can go on the search page with the fields above alone, and each
  // section is omitted rather than empty when its field is blank.
  const description = field(form, "description");
  const highlights = highlightPairs(field(form, "highlights"));
  const amenities = lines(field(form, "amenities"));
  const brochure = field(form, "brochure");
  const floorPlans = lines(field(form, "floorPlans"));
  const paymentPlan = field(form, "paymentPlan");
  const handover = field(form, "handover");
  const serviceCharge = field(form, "serviceCharge");
  const titleDeed = field(form, "titleDeed");
  const gyo = choice(field(form, "gyo"), ["yes", "no"]);
  const vatRate = rate(field(form, "vatRate"), vatRates);
  const titleDeedTaxRate = rate(field(form, "titleDeedTaxRate"), titleDeedTaxRates);
  const videoUrl = field(form, "videoUrl");
  const mapDistrict = field(form, "mapDistrict");
  const mapLat = coordinate(field(form, "mapLat"), 90);
  const mapLng = coordinate(field(form, "mapLng"), 180);
  const seoTitle = field(form, "seoTitle");
  const seoDescription = field(form, "seoDescription");
  const noindex = checkbox(form, "noindex");

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
  /*
   * A development answers at its name slugged, and wins the collision, so a
   * listing that took the slug would have a page nobody could reach.
   *
   * Except where the development in question is this listing's own. A scheme
   * is assembled from the listings that name it, so the first unit published
   * in "Pearl House 4" *creates* the development at `pearl-house-4` — and if
   * the unit was itself slugged `pearl-house-4`, every later save of it
   * collided with a development it had brought into existence, and the listing
   * could never be edited again. That is not a clash: the development's page
   * is assembled from this unit and carries it, so nothing is unreachable.
   */
  else if (developmentSlug(project) !== slug && (await getDevelopment(slug)))
    fieldErrors.slug = `A development already answers at /properties/${slug}. Give the unit a slug of its own — "${slug}-2-bedroom", say.`;

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
  for (const item of floorPlans) {
    const error = checkImage(item, "Every floor plan");
    if (error) {
      fieldErrors.floorPlans = error;
      break;
    }
  }

  const brochureError = checkFile(brochure, "The brochure");
  if (brochureError) fieldErrors.brochure = brochureError;

  // Three closed lists, and a browser that submits something else is not a
  // browser filling in this form.
  if (gyo === false) fieldErrors.gyo = "Answer yes or no, or leave it unstated.";
  if (vatRate === false)
    fieldErrors.vatRate = `One of: ${vatRates.join("%, ")}%.`;
  if (titleDeedTaxRate === false)
    fieldErrors.titleDeedTaxRate = `One of: ${titleDeedTaxRates.join("%, ")}%.`;

  if (videoUrl && !/^https:\/\//.test(videoUrl))
    fieldErrors.videoUrl = "A full https:// link to the tour, or leave it empty.";

  // Both or neither: half a coordinate puts the pin in the sea.
  // A district that is not in the table would be a pin that never draws, so
  // it is refused here rather than silently falling back on the public page.
  if (mapDistrict && !isDistrict(mapDistrict))
    fieldErrors.mapDistrict = "Not a district the map knows. Pick one from the list.";
  if (mapLat === false) fieldErrors.mapLat = "A latitude between -90 and 90.";
  if (mapLng === false) fieldErrors.mapLng = "A longitude between -180 and 180.";
  if ((mapLat === null) !== (mapLng === null))
    fieldErrors.mapLat = "A map needs both a latitude and a longitude.";

  const highlightError = checkHighlights(field(form, "highlights"));
  if (highlightError) fieldErrors.highlights = highlightError;

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
    description: description || null,
    highlights,
    amenities,
    brochure: brochure || null,
    floorPlans,
    paymentPlan: paymentPlan || null,
    handover: handover || null,
    serviceCharge: serviceCharge || null,
    titleDeed: titleDeed || null,
    // `null` is "not stated", which the page leaves out entirely — a different
    // answer from "no" and from "0%", both of which it shows.
    gyo: gyo === false || gyo === null ? null : gyo === "yes",
    vatRate: vatRate === false ? null : vatRate,
    titleDeedTaxRate: titleDeedTaxRate === false ? null : titleDeedTaxRate,
    videoUrl: videoUrl || null,
    mapDistrict: mapDistrict || null,
    mapLat: mapLat === false ? null : mapLat,
    mapLng: mapLng === false ? null : mapLng,
    seoTitle: seoTitle || null,
    seoDescription: seoDescription || null,
    noindex,
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
