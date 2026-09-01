/**
 * Development/project pages served at /properties/[slug].
 *
 * The copy here is the English source. Short strings — taglines, overview
 * headings, highlight titles, stat labels, amenity names — are translated in
 * the dictionaries and looked up by the page; the long prose is staged under
 * `dictionary.property.copy[slug]` and falls back to what is written here.
 *
 * NOTE: placeholder content — names, copy, figures and photography are
 * stand-ins and must be replaced with Multi Mulk's real Türkiye developments
 * before launch. See the note at the top of content.ts.
 *
 * The residences shown on each page are derived from `properties.ts` by
 * matching `Unit.project` to `Project.name`, so inventory stays in one place.
 */

export type Project = {
  slug: string;
  /** Never translated — the name a buyer searches for, in every language. */
  name: string;
  tagline: string;
  description: string;
  location: string;
  country: string;
  image: string;
  highlights: { title: string; text: string }[];
  overview: { heading: string; body: string };
  stats: { label: string; value: string }[];
  amenities: { body: string; items: string[] };
};

export const projects: Project[] = [
  {
    slug: "levent-residences",
    name: "Levent Residences",
    tagline: "A Landmark Address in the Heart of İstanbul",
    description:
      "Rising in Şişli, moments from the Levent financial district, these residences pair a central address with the calm of considered interiors. Generous layouts, full-height glazing and a curated amenity floor make this a natural home for families and investors seeking İstanbul at its most connected — and a qualifying route to Turkish citizenship.",
    location: "Şişli",
    country: "İstanbul, Türkiye",
    image: "/images/levent-residences.webp",
    highlights: [
      {
        title: "Central Connectivity",
        text: "Minutes from the Levent and Maslak business districts, with metro access on the doorstep",
      },
      {
        title: "Citizenship Eligible",
        text: "Selected residences meet the USD 400,000 Türkiye Citizenship by Investment threshold",
      },
      {
        title: "City and Bosphorus Views",
        text: "Upper floors are oriented to capture the skyline and glimpses of the Bosphorus",
      },
    ],
    overview: {
      heading: "Each Residence: A Panorama of the City.",
      body: "Thoughtfully designed to blend urban convenience with calm, Levent Residences offers layered living across a range of layouts — from efficient studios to family townhouses — each finished to a standard that holds its value.",
    },
    stats: [
      { label: "Quantity", value: "420 apartments" },
      { label: "Townhouses", value: "11 townhouses with 3 & 5 bedrooms" },
      { label: "Apartments", value: "Studio, 1, 2, 3 bedroom units" },
      { label: "Room Sizes", value: "512 sq. ft. - 6,600 sq. ft." },
    ],
    amenities: {
      body: "A full amenity floor supports daily life — an arrival lobby with concierge, a spa and hammam, a residents' lounge, a fitness centre and a landscaped terrace for the warmer months.",
      items: [
        "Lobby & Concierge",
        "Spa & Hammam",
        "Residents’ Lounge",
        "Fitness Centre",
        "Landscaped Terrace",
        "Indoor Pool",
        "Secure Parking",
      ],
    },
  },
  {
    slug: "bosphorus-heights",
    name: "Bosphorus Heights",
    tagline: "Elevated Living Above the Strait",
    description:
      "An exclusive collection of 165 residences in Beyoğlu, positioned to take in the Bosphorus and the historic peninsula beyond. Close to Galata, İstiklal and the ferry piers, Bosphorus Heights offers a rare combination of heritage surroundings and contemporary design.",
    location: "Beyoğlu",
    country: "İstanbul, Türkiye",
    image: "/images/bosphorus-heights.webp",
    highlights: [
      {
        title: "Bosphorus Outlook",
        text: "Residences oriented to frame the strait and the historic peninsula",
      },
      {
        title: "Heritage Quarter",
        text: "Walking distance to Galata Tower, İstiklal Caddesi and the Karaköy waterfront",
      },
      {
        title: "Citizenship Eligible",
        text: "Selected residences meet the USD 400,000 Türkiye Citizenship by Investment threshold",
      },
    ],
    overview: {
      heading: "Framed by Water, Crowned by Sky.",
      body: "Rise above the city and experience İstanbul from a quieter vantage point. Whether a pied-à-terre or a place to call home, this is an invitation to live at the meeting point of two continents.",
    },
    stats: [
      { label: "Quantity", value: "165 total apartments" },
      { label: "Studio Apartments", value: "78 studio units" },
      { label: "Apartments", value: "87 one-bedroom units" },
      { label: "Location", value: "Beyoğlu, İstanbul" },
    ],
    amenities: {
      body: "Residents enjoy a considered set of amenities built around movement and rest alike — an indoor pool, a fully equipped gym, and a rooftop lounge with an uninterrupted view of the strait.",
      items: ["Rooftop Lounge", "Indoor Pool", "Gym", "Concierge"],
    },
  },
  {
    slug: "marmara-vista",
    name: "Marmara Vista",
    tagline: "Coastal Calm on İstanbul’s Western Shore",
    description:
      "Set in Beylikdüzü on the Marmara coast, Marmara Vista offers 151 studio, one- and two-bedroom residences with sweeping sea views. A short drive from the airport and the new city centre, it suits families and investors who want space and light without leaving İstanbul.",
    location: "Beylikdüzü",
    country: "İstanbul, Türkiye",
    image: "/images/marmara-vista.webp",
    highlights: [
      {
        title: "Marmara Sea Views",
        text: "Residences oriented to capture uninterrupted views across the Marmara",
      },
      {
        title: "Family Neighbourhood",
        text: "Parks, international schools and the Beylikdüzü promenade within easy reach",
      },
      {
        title: "Airport Access",
        text: "A straightforward run to İstanbul Airport and the E-5 corridor",
      },
    ],
    overview: {
      heading: "Space, Light and the Open Sea.",
      body: "Marmara Vista offers 151 exquisite studio, one- and two-bedroom residences on İstanbul's western shore, with serene, panoramic views across the Marmara Sea.",
    },
    stats: [
      { label: "Quantity", value: "151 apartments" },
      { label: "Apartments", value: "Studio, 1 & 2 bedroom units" },
      { label: "Room Sizes", value: "479 sq. ft. - 1,709 sq. ft." },
      { label: "Floors", value: "Floor 1 - 15" },
    ],
    amenities: {
      body: "A considered collection of amenities shapes daily life at Marmara Vista — from the arrival lobby through to the pool deck and the coastal promenade a short walk away.",
      items: ["Lobby", "Fitness Centre", "Outdoor Pool", "Promenade Access"],
    },
  },
  {
    slug: "aegean-bay-residences",
    name: "Aegean Bay Residences",
    tagline: "The Ideal Escape on the Bodrum Peninsula",
    description:
      "Set above a quiet bay on the Bodrum peninsula, Aegean Bay Residences is a refined coastal address where calm interiors, natural light and effortless living come together. Designed for those who value privacy and quality, it offers an easy rhythm of mornings by the water and evenings framed by the horizon.",
    location: "Bodrum",
    country: "Muğla, Türkiye",
    image: "/images/aegean-bay.webp",
    highlights: [
      {
        title: "Unmatched Coastal Living",
        text: "Direct access to the bay and the ease of a true resort-side lifestyle, grounded in comfort and privacy",
      },
      {
        title: "Bodrum Peninsula",
        text: "Minutes from Yalıkavak Marina and the peninsula's harbour villages",
      },
      {
        title: "Citizenship Eligible",
        text: "Selected residences meet the USD 400,000 Türkiye Citizenship by Investment threshold",
      },
    ],
    overview: {
      heading: "Wake Up to the Aegean.",
      body: "A rare fusion of sophistication and serenity, Aegean Bay Residences redefines coastal exclusivity on the Bodrum peninsula. With its intimate charm and stunning surroundings, it is a haven of modern elegance — equally suited to a summer retreat or a distinguished permanent address.",
    },
    stats: [
      { label: "Quantity", value: "88 apartments" },
      { label: "Apartments", value: "Studio to 3 bedrooms" },
      { label: "Room Sizes", value: "572 sq. ft. - 3,874 sq. ft." },
      { label: "Location", value: "Bodrum, Muğla" },
    ],
    amenities: {
      body: "An intimate set of amenities supports a calm, private way of living — an arrival lobby, a fitness centre, the pool terrace, and steps down to the bay.",
      items: ["Lobby", "Fitness Centre", "Pool Terrace", "Bay Access"],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
