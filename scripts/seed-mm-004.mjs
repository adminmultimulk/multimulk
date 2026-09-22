/**
 * Enters MM-004 (Taş Yapı, Şişli) as a draft listing, with the copy from the
 * developer's project sheet filled in — the description, amenities,
 * architecture, earthquake resistance, distances, the Şişli overview and the
 * market performance.
 *
 * A draft, not a published listing: the sheet says nothing about the price,
 * the layouts or the photography, and those are filled in from the dashboard
 * before it goes live. The card image is a stand-in from `public/` for the
 * same reason, and is flagged as such in the dashboard's preview by being
 * obviously not this building.
 *
 *     node --env-file=.env.local scripts/seed-mm-004.mjs
 *
 * Safe to re-run: it updates the draft in place by slug.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const description = `MM-004 is a premium residential development in central Şişli, Istanbul, combining modern architecture, thoughtfully designed residences, and a peaceful urban environment.

Offering 1+1 to 4+1 units, with selected residences featuring panoramic Golden Horn and Bosphorus views, the project provides convenient access to major business districts, shopping, dining, and lifestyle destinations.`;

const architecture = `MM-004 combines **luxury, comfort, nature, and city living** in central **Şişli**, offering generous **green and peaceful spaces, modern residences, premium social facilities, and thoughtfully designed common areas** for a refined urban lifestyle suited to **families and modern city residents**.`;

const earthquake = `MM-004 prioritizes **earthquake safety and structural durability**, featuring **C45–C50 high-strength concrete, ~42-meter-deep foundations, and advanced reinforcement connections**, with a stated **earthquake resistance target of up to magnitude 9.5**.`;

const distances = [
  ["Cultural Hubs", "Taksim Square", "4 km", "10–15 min"],
  ["Cultural Hubs", "Galataport Istanbul", "6 km", "15–20 min"],
  ["Cultural Hubs", "Tersane Istanbul", "6 km", "15–20 min"],
  ["Cultural Hubs", "Grand Bazaar", "9 km", "20–25 min"],
  ["Cultural Hubs", "Blue Mosque (Sultanahmet)", "11 km", "25–30 min"],

  ["Airports", "Istanbul Airport", "39 km", "35–45 min"],
  ["Airports", "Sabiha Gökçen International Airport", "41 km", "35–45 min"],

  ["Hospitals", "Istanbul Florence Nightingale Hospital", "", "7 min walk"],
  ["Hospitals", "Acıbadem Fulya Hospital", "2 km", "5–7 min"],
  ["Hospitals", "Memorial Şişli Hospital", "2 km", "5–7 min"],
  ["Hospitals", "Gayrettepe Florence Nightingale Hospital", "2.4 km", "5–10 min"],

  ["Business Hubs", "Levent Business District", "5 km", "10 min"],
  ["Business Hubs", "Maslak Business District", "9 km", "10–15 min"],
  ["Business Hubs", "Basın Ekspres Business Corridor", "18 km", "25–30 min"],
  ["Business Hubs", "İstanbul Finans Merkezi (IFC), Ataşehir", "16 km", "20–25 min"],

  ["Transportation", "Metrobus", "", "5 min walk"],
  ["Transportation", "Metro station, M2 line", "", "7 min walk"],
  ["Transportation", "H5 Highway", "", "2 min"],
  ["Transportation", "TEM Highway", "5 km", ""],
  ["Transportation", "1st Bosphorus Bridge", "6 km", ""],
  ["Transportation", "2nd Bosphorus Bridge", "11 km", ""],

  ["Universities", "Haliç University", "6 km", ""],
  ["Universities", "Istanbul Bilgi University", "5 km", ""],
  ["Universities", "Istanbul Technical University, Maslak", "10 km", ""],

  ["Schools", "Saint Michel French High School", "~2.5 km", "7–10 min"],
  ["Schools", "The British International School", "7 km", "15–20 min"],
  ["Schools", "Istanbul International Community School (IICS)", "10 km", "20–25 min"],
  ["Schools", "FMV Işık Schools, Nişantaşı Campus", "4 km", "10–15 min"],
  ["Schools", "ITA Schools", "2.5 km", "7–10 min"],

  ["Shopping Centres", "Trump Towers Mall", "1.5 km", "5 min"],
  ["Shopping Centres", "İstanbul Cevahir Mall", "2 km", "5–7 min"],
  ["Shopping Centres", "City’s Nişantaşı", "3.5 km", "8–12 min"],
  ["Shopping Centres", "Kanyon Shopping Mall", "5 km", "10–15 min"],
  ["Shopping Centres", "Zorlu Center", "6 km", "12–18 min"],
].map(([group, name, distance, time]) => ({ group, name, distance, time }));

const areaOverview = `## Şişli, Istanbul — Real Estate & Area Overview

### Location & Strategic Importance

Şişli is one of Istanbul’s most **central and established European-side districts**, forming a key **business, commercial, retail, healthcare, and upscale residential corridor**.

Located **north of Beyoğlu/Taksim**, it extends toward the **Mecidiyeköy–Zincirlikuyu–Levent business axis** and is bordered by **Beyoğlu to the south, Beşiktaş to the east, Sarıyer to the north, and Kağıthane to the west**.

From a real-estate perspective, Şişli’s strategic value comes from connecting several of Istanbul’s **highest-value areas**: **Taksim–Beyoğlu, Nişantaşı–Beşiktaş, Kağıthane, and Levent–Maslak**.

### Major Neighborhoods & Areas

Şişli has **25 official mahalle**, including **Teşvikiye, Harbiye, Mecidiyeköy, Fulya, Esentepe, 19 Mayıs, Cumhuriyet, Meşrutiyet, Feriköy**, and the neighborhoods surrounding **Bomonti**.

From a real-estate perspective, the key areas are **Nişantaşı–Teşvikiye, Harbiye, Osmanbey, Bomonti, Fulya, Mecidiyeköy, and Esentepe**:

- **Nişantaşı–Teşvikiye:** Şişli’s **premium/luxury residential market**, known for high-end apartments, luxury retail, restaurants, and proximity to **Maçka and the Bosphorus-side districts**.
- **Bomonti:** A major **modern residential investment zone**, characterized by newer residences, mixed-use developments, and high-rise projects.
- **Mecidiyeköy & Esentepe:** Key **commercial and investment areas** along the **Büyükdere Avenue business corridor**, connecting Şişli with **Levent and Maslak**.
- **Fulya:** A mix of established housing and newer upscale residences, strategically positioned between **Şişli, Mecidiyeköy, and Beşiktaş**.

Over the **last five years**, development has increasingly focused on **urban renewal, earthquake resilience, renovation of aging buildings, public-space improvements, and updated planning**. Istanbul Metropolitan Municipality has advanced district-wide planning in stages, including **Dolapdere–Piyalepaşa (approved in 2022)** and further planning covering **central Şişli, Mecidiyeköy, Esentepe, and Kuştepe**.

![Residential m² unit prices across Şişli’s neighbourhoods](/images/mm-004/sisli-price-map.webp "Residential m² unit prices by neighbourhood, from €756/m² to €6,285/m². Source: Endeksa.")

### Transportation & Connectivity

Şişli is one of Istanbul’s best-connected central districts, linking **Taksim, Mecidiyeköy, Levent and Maslak**. It is served by the **M2 and M7 metro lines, Metrobus, buses and minibuses**, with direct access to **D100/E-5 and the Bosphorus bridges**, providing convenient connections across both sides of Istanbul.

### Schools & Education

Şişli offers numerous **private and public schools** and convenient access to international schools in **Beşiktaş, Etiler and Sarıyer**, including the **British International School and IICS**.

### Hospitals & Healthcare

The district is a major healthcare hub, home to **American Hospital, Memorial Şişli, Kolan International, İstanbul Cerrahi and Mecidiyeköy Çevre Hospital**, alongside the public **Prof. Dr. Cemil Taşcıoğlu City Hospital**.

### Shopping & Lifestyle

Şişli is a major retail and lifestyle destination, featuring **Cevahir, City’s Nişantaşı and Trump Mall**, with **Kanyon and Zorlu Center** nearby. **Nişantaşı** is especially known for luxury boutiques, international brands, restaurants and cafés.

### Market Insights — Real Estate Perspective

From an investment standpoint, Şişli can be positioned as a mature, central and relatively supply-constrained Istanbul market.

Its value proposition is built around location rather than expansion. Investors are buying into an established district with strong transportation, employment centers, hospitals, schools, retail and lifestyle infrastructure already in place.

Different micro-markets also serve different investment strategies: Nişantaşı–Teşvikiye for luxury and prestige; Bomonti for modern residences and redevelopment; Fulya for upscale residential living; and Mecidiyeköy–Esentepe for connectivity, offices, rental demand and access to Istanbul’s primary business corridor.`;

const marketPerformance = `### Past — Strong Capital Appreciation

Şişli has demonstrated strong long-term performance. From January 2021 to August 2026, residential unit prices increased by approximately **104%** in USD terms, while average total property values increased by approximately **164%**. This demonstrates substantial long-term appreciation despite periods of market volatility.

### Current — Strong Growth & Attractive Rental Returns

As of August 2026, the average residential asking value is approximately **$1,847/m²**, with an average property value of about **$188,384**. Prices per square meter have increased **27.69%** over the last year. The district records an estimated **7.69% rental yield** and a **13-year amortization period**, indicating that Şişli combines capital appreciation with rental-income potential.

### Future — Positive Growth Outlook

Forecasts point to a further **16.62%** increase in residential unit prices in USD terms over the next year, while average total property values are projected to increase approximately **25.99%** — suggesting Şişli’s upward trajectory is expected to continue.

**Investment insight:** Şişli combines long-term capital appreciation, strong rental potential and limited central-city supply, supporting its position as one of Istanbul’s established residential investment markets.

Source: [Endeksa — Şişli for-sale residential index](https://www.endeksa.com/en/analysis/turkiye/istanbul/sisli/index/for-sale/house)`;

const data = {
  slug: "mm-004",
  title: "MM-004",
  project: "MM-004",
  location: "Şişli, Istanbul",
  country: "Türkiye",
  // Not on the sheet — filled in from the dashboard before publishing.
  priceUSD: 0,
  priceEUR: 0,
  priceTRY: 0,
  type: "Apartment",
  bathrooms: "Bathrooms TBC",
  bedroom: "1+1, 2+1, 3+1, 4+1",
  size: "Size TBC",
  level: "Level TBC",
  view: "Golden Horn & Bosphorus View",
  soldOut: false,
  cbiEligible: false,
  // A stand-in until the renders arrive: another Şişli scheme's hero.
  image: "/images/levent-residences.webp",
  gallery: [],
  description,
  highlights: [
    {
      title: "Golden Horn & Bosphorus Views",
      text: "Selected residences look out over the **Golden Horn** and the **Bosphorus**.",
    },
    {
      title: "Central Şişli",
      text: "Minutes from Taksim, Nişantaşı and the Levent–Maslak business axis, with the Metrobus and the M2 metro a short walk away.",
    },
    {
      title: "Built to Magnitude 9.5",
      text: "C45–C50 high-strength concrete, ~42-metre-deep foundations and advanced reinforcement connections.",
    },
  ],
  amenities: [
    "Indoor Pool",
    "Outdoor Pool",
    "Fitness Centre",
    "Spa & Wellness",
    "Green Spaces",
    "Walking Paths",
    "Private Parking",
    "Dining Areas",
    "Educational Facilities",
    "24/7 Security",
  ],
  floorPlans: [],
  architecture,
  earthquake,
  distances,
  areaOverview,
  areaGallery: [
    "/images/mm-004/sisli-1.webp",
    "/images/mm-004/sisli-2.webp",
    "/images/mm-004/sisli-3.webp",
    "/images/mm-004/sisli-4.webp",
  ],
  marketPerformance,
  marketChart: "/images/mm-004/sisli-market-chart.webp",
  mapDistrict: "Şişli",
  status: "DRAFT",
};

// The lister who entered the other MM developments.
const lister =
  (await prisma.property.findFirst({
    where: { project: { startsWith: "MM-" } },
    select: { listerId: true },
  })) ?? (await prisma.user.findFirst({ where: { role: "SUPERADMIN" }, select: { id: true } }));
if (!lister) throw new Error("No lister to attribute the draft to.");
const listerId = "listerId" in lister ? lister.listerId : lister.id;

const existing = await prisma.property.findUnique({ where: { slug: data.slug } });
if (existing) {
  await prisma.property.update({ where: { slug: data.slug }, data });
  console.log(`Updated draft ${data.slug} (${existing.id}).`);
} else {
  const created = await prisma.property.create({ data: { ...data, listerId } });
  console.log(`Created draft ${data.slug} (${created.id}).`);
}

await prisma.$disconnect();
