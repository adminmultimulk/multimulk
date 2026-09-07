/**
 * Enters the Peron İstanbul development as three CMS listings.
 *
 * The first piece of real Türkiye inventory to go through the dashboard rather
 * than `app/lib/properties.ts`, and written as a script because the developer
 * sent one sheet covering three layouts — typing the same amenity list into
 * the form three times invites three slightly different amenity lists.
 *
 * Everything is written as DRAFT. Nothing reaches the public site until
 * somebody presses Publish in /admin/properties, which is deliberate: the
 * fields marked TODO below are placeholders, not figures from the developer.
 *
 *   node --env-file=.env.local scripts/seed-peron-istanbul.mjs
 *   node --env-file=.env.local scripts/seed-peron-istanbul.mjs --publish
 *
 * Re-running updates the same three rows by slug rather than adding more, so
 * once the real prices and sizes arrive, edit the table below and run it again.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const publish = process.argv.includes("--publish");

/*
 * ---------------------------------------------------------------------------
 * TODO — placeholders, awaiting the developer's price list.
 *
 * `size`, `bathrooms`, `level` and the three prices are NOT from the Peron
 * sheet; they are stand-ins so the page can be reviewed with its real prose.
 * Replace them before publishing. A price of 0 also leaves `cbiEligible`
 * false — every one of these units is expected to clear the USD 400,000
 * Türkiye threshold, so that flips once the real figures are in.
 * ---------------------------------------------------------------------------
 */
const PLACEHOLDER = { priceUSD: 0, priceEUR: 0, priceTRY: 0 };

/** Facts that are the same on every unit in the development. */
const shared = {
  project: "Peron İstanbul",
  location: "Kartal",
  country: "Türkiye",
  type: "Apartment",
  image: "/images/listing-hero.png", // TODO — developer photography.
  gallery: [], // TODO — developer photography.
  floorPlans: [], // TODO — one plan per layout.

  description:
    "Peron İstanbul rises on the Kartal coast, three hundred metres from the " +
    "Marmara and fifty metres from the Marmaray line, on a 43,000 m² site " +
    "given over almost entirely to landscape — 23,000 m² of it, with the " +
    "outdoor pool sunk below the level of the gardens so the view across them " +
    "stays unbroken. Six of the seven residences on each floor look out to the " +
    "sea and the Princes' Islands. Delivered by Eczacıbaşı, Betacons and the " +
    "TYM group, the development is a family address by design: there are no " +
    "studios and no one-bedrooms anywhere in its 666 apartments.",

  highlights: [
    {
      title: "Fifty Metres to Marmaray",
      text: "The Marmaray station is on the doorstep, the E-5 is 1.5 km away and Sabiha Gökçen airport a six-kilometre run",
    },
    {
      title: "A Family-Only Address",
      text: "666 apartments across four blocks, every one of them 2+1 or larger — no studios, no one-bedrooms",
    },
    {
      title: "Built on Rock",
      text: "Earthquake resistance reported by İstanbul University and the University of Tokyo, on rocky ground",
    },
  ],

  amenities: [
    "Outdoor Sunken Pool",
    "Indoor Pools",
    "Fitness Centre",
    "Sauna",
    "Turkish Bath",
    "Jacuzzi",
    "Steam Room",
    "Relaxation Rooms",
    "Reformer Pilates Studio",
    "Massage Rooms",
    "Basketball & Volleyball Courts",
    "Children's Playground",
    "Walking Paths",
    "Dog Walking Area",
    "Viewing Terrace",
    "Landscaped Resting Areas",
    "Artistic Objects",
    "Secure Parking",
  ],

  paymentPlan:
    "45% down payment, the balance over 24 monthly instalments. VAT at 1%.",
  handover: "December 2027",
  titleDeed: "Ready title deed",
  serviceCharge: null, // TODO — ask the developer.

  // Kartal coast. TODO — replace with the site's own pin.
  mapLat: 40.8781,
  mapLng: 29.1903,
};

/**
 * The three layouts on the sheet.
 *
 * `bedroom` is written out because the search filter reads the leading number:
 * "2 Bedroom" answers the 2 filter. The Turkish 2+1 / 3+1 / 4+1 is kept in the
 * title, which is what a buyer from İstanbul will actually look for.
 */
const layouts = [
  {
    slug: "peron-istanbul-2-1",
    title: "Peron İstanbul 2+1",
    bedroom: "2 Bedroom",
    bathrooms: "1 Bathroom", // TODO
    size: "TBC", // TODO
    level: "Garden Floor to Upper Levels", // TODO
    view: "Sea View & Island View",
    variants: "Open kitchen, closed kitchen, flat and garden floor",
  },
  {
    slug: "peron-istanbul-3-1",
    title: "Peron İstanbul 3+1",
    bedroom: "3 Bedroom",
    bathrooms: "2 Bathroom", // TODO
    size: "TBC", // TODO
    level: "Garden Floor to Loft", // TODO
    view: "Sea View & Island View",
    variants:
      "Closed kitchen, flat, garden floor, loft and extra terrace",
  },
  {
    slug: "peron-istanbul-4-1",
    title: "Peron İstanbul 4+1",
    bedroom: "4 Bedroom",
    bathrooms: "2 Bathroom", // TODO
    size: "TBC", // TODO
    level: "Garden Floor to Penthouse", // TODO
    view: "Sea View & Island View",
    variants: "Closed kitchen, flat, garden floor and penthouse",
  },
];

/** The specification paragraph that follows the development's own prose. */
function specification(layout) {
  return (
    `${shared.description}\n\n` +
    `Available as ${layout.variants.toLowerCase()}. Every residence is handed ` +
    `over with six built-in appliances — oven, extractor, microwave, hob, ` +
    `dishwasher and fridge — two air conditioners and an air conditioning ` +
    `line to each room, finished in ultra-luxury materials.\n\n` +
    `The site holds four blocks over 43,000 m², with 23,000 m² of landscape, ` +
    `3,000 m² of social facilities, parking for 1,245 vehicles across two ` +
    `floors, and 23 commercial units at road level below the gardens. ` +
    `Acıbadem Hospital is 100 m away, the Eczacıbaşı Sports Complex 300 m, ` +
    `Bahçeşehir College 250 m, the ferry and seabus terminal 2 km and the ` +
    `metro 3.5 km.`
  );
}

async function main() {
  // Whoever the listing belongs to in the dashboard. A superadmin is the safe
  // default — the account exists on every deployment, and only the lister or a
  // superadmin can delete a listing later.
  const lister =
    (await prisma.user.findFirst({
      where: { active: true, role: "LISTER" },
      orderBy: { createdAt: "asc" },
    })) ??
    (await prisma.user.findFirst({
      where: { active: true, role: "SUPERADMIN" },
      orderBy: { createdAt: "asc" },
    }));

  if (!lister) throw new Error("No active lister or superadmin to own the listings.");

  for (const layout of layouts) {
    const data = {
      slug: layout.slug,
      title: layout.title,
      project: shared.project,
      location: shared.location,
      country: shared.country,
      ...PLACEHOLDER,
      type: shared.type,
      bathrooms: layout.bathrooms,
      bedroom: layout.bedroom,
      size: layout.size,
      level: layout.level,
      view: layout.view,
      soldOut: false,
      cbiEligible: PLACEHOLDER.priceUSD >= 400000,
      image: shared.image,
      gallery: shared.gallery,
      description: specification(layout),
      highlights: shared.highlights,
      amenities: shared.amenities,
      brochure: null,
      floorPlans: shared.floorPlans,
      paymentPlan: shared.paymentPlan,
      handover: shared.handover,
      serviceCharge: shared.serviceCharge,
      titleDeed: shared.titleDeed,
      videoUrl: null,
      mapLat: shared.mapLat,
      mapLng: shared.mapLng,
      seoTitle: `${layout.title} — Kartal Coast, İstanbul`,
      seoDescription:
        `A ${layout.bedroom.toLowerCase()} residence at Peron İstanbul on the ` +
        `Kartal coast: 300 m from the sea, 50 m from Marmaray, handover ` +
        `December 2027 with a ready title deed.`,
      noindex: false,
      status: publish ? "PUBLISHED" : "DRAFT",
      publishedAt: publish ? new Date() : null,
    };

    const row = await prisma.property.upsert({
      where: { slug: layout.slug },
      update: data,
      create: { ...data, listerId: lister.id },
    });

    console.log(`${row.status.padEnd(9)} ${row.slug}  (${row.id})`);
  }

  console.log(
    `\nOwned by ${lister.name} (${lister.username}).` +
      (publish
        ? "\nPublished — these are live on /search-property now."
        : "\nDrafts. Review them at /admin/properties, and replace every TODO" +
          "\nin this file — prices, sizes, bathrooms, photography — before publishing."),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
