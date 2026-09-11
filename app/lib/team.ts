import type { Dictionary } from "./i18n";

/**
 * The team page.
 *
 * Thirty-four people. Ten came across from the previous site with their
 * portraits; the rest joined in the September 2026 shoot. Names live here
 * because names are never translated; the department above the name and the
 * role beneath it are keyed by slug in the dictionary, so they read in
 * whatever language the page is in.
 *
 * Most of the portraits are the ones the company already uses: a circular
 * photograph on the house green, pre-masked with transparent corners at
 * 440x440. That is why those cards frame them as circles rather than filling
 * a rectangle — cropping one to a portrait frame would slice the circle. They
 * sit on a light card so the green belongs to the picture rather than having
 * to match the page.
 *
 * The two executives are the exception: they have rectangular studio frames at
 * 620x956, the same files the About page sets its leadership pair in, so their
 * cards fill the frame edge to edge and carry the name over the photograph the
 * way the About page does. Same faces on both pages, framed the same way.
 *
 * Nothing here is invented. A person, a title or a face that was not on the
 * page this was taken from does not belong here until someone at Multi Mulk
 * has supplied it.
 */

/** Both keyed off the dictionary, so a person without copy is a build error. */
type PersonSlug = keyof Dictionary["team"]["people"];
type DepartmentKey = keyof Dictionary["team"]["departments"];

export type TeamPerson = {
  /** Key into `dictionary.team.people` for the role lines under the name. */
  slug: PersonSlug;
  name: string;
  /** Key into `dictionary.team.departments` for the line above the name. */
  department: DepartmentKey;
  image: string;
};

/** The two named on the previous site as executive leadership. */
export const teamLeadership: TeamPerson[] = [
  {
    slug: "sajid-ali-haydar",
    name: "Sajid Ali Haydar",
    department: "executiveLeadership",
    image: "/images/team/sajid-ali-haydar.webp",
  },
  {
    slug: "nader-djebbi",
    name: "Nader Djebbi",
    department: "growthDubai",
    image: "/images/team/nader-djebbi.webp",
  },
];

/**
 * Everyone else, A to Z by the name as the card shows it.
 *
 * First name first, because that is how these names are written and read —
 * several of them ("Muhammad Ali Shahid", "Asad Ullah Saif", "Sobhi Al Sabhi")
 * have no surname to sort on in the western sense. Alphabetical rather than by
 * department: the department is printed on every card, so the grid groups
 * itself visually without the array having to.
 *
 * Twenty-four of these joined in the September 2026 shoot. Two of that batch
 * turned out to be new photographs of people already listed — Niloofar Sadiq
 * and Seyhan Ozmen — and were updated in place rather than duplicated, taking
 * the newer photograph and the spelling the roster uses.
 */
export const teamPeople: TeamPerson[] = [
  {
    slug: "abdul-hadi",
    name: "Abdul Hadi",
    department: "mediaProduction",
    image: "/images/team/abdul-hadi.webp",
  },
  {
    slug: "alireza-akbari",
    name: "Alireza Akbari",
    department: "marketing",
    image: "/images/team/alireza-akbari.webp",
  },
  {
    slug: "amina-ashraf",
    name: "Amina Ashraf",
    department: "digitalMedia",
    image: "/images/team/amina-ashraf.webp",
  },
  {
    slug: "asad-ullah-saif",
    name: "Asad Ullah Saif",
    department: "clientAdvisory",
    image: "/images/team/asad-ullah-saif.webp",
  },
  {
    slug: "ayshe-ali-haydar",
    name: "Ayshe Ali Haydar",
    department: "clientAdvisory",
    image: "/images/team/ayshe-ali-haydar.webp",
  },
  {
    slug: "badar-naseem",
    name: "Badar Naseem",
    department: "clientAdvisory",
    image: "/images/team/badar-naseem.webp",
  },
  {
    slug: "danish-anwar",
    name: "Danish Anwar",
    department: "clientAdvisory",
    image: "/images/team/danish-anwar.webp",
  },
  {
    slug: "elnaz-aminzadeh",
    name: "Elnaz Aminzadeh",
    department: "clientAdvisory",
    image: "/images/team/elnaz-aminzadeh.webp",
  },
  {
    slug: "errfan-balouch",
    name: "Errfan Balouch",
    department: "sales",
    image: "/images/team/errfan-balouch.webp",
  },
  {
    slug: "faizan-asif",
    name: "Faizan Asif",
    department: "digitalMedia",
    image: "/images/team/faizan-asif.webp",
  },
  {
    slug: "fatih-abbas",
    name: "Fatih Abbas",
    department: "istanbulSales",
    image: "/images/team/fatih-abbas.webp",
  },
  {
    slug: "iffah-mir",
    name: "Iffah Mir",
    department: "digitalMedia",
    image: "/images/team/iffah-mir.webp",
  },
  {
    slug: "kubra-senturk",
    name: "Kubra Senturk",
    department: "legal",
    image: "/images/team/kubra-senturk.webp",
  },
  {
    slug: "mahenur-azlem",
    name: "Mahenur Azlem",
    department: "humanResources",
    image: "/images/team/mahenur-azlem.webp",
  },
  {
    slug: "maryam-shad",
    name: "Maryam Shad",
    department: "digitalMedia",
    image: "/images/team/maryam-shad.webp",
  },
  {
    slug: "mubark-ali",
    name: "Mubark Ali",
    department: "clientAdvisory",
    image: "/images/team/mubark-ali.webp",
  },
  {
    slug: "muhammad-ali-shahid",
    name: "Muhammad Ali Shahid",
    department: "clientAdvisory",
    image: "/images/team/muhammad-ali-shahid.webp",
  },
  {
    slug: "muhammad-jamal",
    name: "Muhammad Jamal",
    department: "clientAdvisory",
    image: "/images/team/muhammad-jamal.webp",
  },
  {
    slug: "muhammad-mubashir",
    name: "Muhammad Mubashir",
    department: "clientAdvisory",
    image: "/images/team/muhammad-mubashir.webp",
  },
  {
    slug: "muhammad-riyasat",
    name: "Muhammad Riyasat",
    department: "clientAdvisory",
    image: "/images/team/muhammad-riyasat.webp",
  },
  {
    slug: "muhammet-kurtulus",
    name: "Muhammet Kurtulus",
    department: "clientAdvisory",
    image: "/images/team/muhammet-kurtulus.webp",
  },
  {
    slug: "nargis-sadiq",
    name: "Nargis Sadiq",
    department: "turkeyOperations",
    image: "/images/team/nargis-sadiq.webp",
  },
  {
    slug: "nilofar-sadiq",
    name: "Niloofar Sadiq",
    department: "clientAdvisory",
    image: "/images/team/nilofar-sadiq.webp",
  },
  {
    slug: "rizwan-aslam",
    name: "Rizwan Aslam",
    department: "mediaProduction",
    image: "/images/team/rizwan-aslam.webp",
  },
  {
    slug: "rizwan-saeed",
    name: "Rizwan Saeed",
    department: "clientAdvisory",
    image: "/images/team/rizwan-saeed.webp",
  },
  {
    slug: "sadaf-sarwar",
    name: "Sadaf Sarwar",
    department: "digitalMedia",
    image: "/images/team/sadaf-sarwar.webp",
  },
  {
    slug: "sarmad-al-kaseer",
    name: "Sarmad Al Kaseer",
    department: "clientAdvisory",
    image: "/images/team/sarmad-al-kaseer.webp",
  },
  {
    slug: "seyhan-ozman",
    name: "Seyhan Ozmen",
    department: "operations",
    image: "/images/team/seyhan-ozman.webp",
  },
  {
    slug: "sinan-sadikhov",
    name: "Sinan Sadikhov",
    department: "clientAdvisory",
    image: "/images/team/sinan-sadikhov.webp",
  },
  {
    slug: "sobhi-al-sabhi",
    name: "Sobhi Al Sabhi",
    department: "clientAdvisory",
    image: "/images/team/sobhi-al-sabhi.webp",
  },
  {
    slug: "tariq-tahir",
    name: "Tariq Tahir",
    department: "clientAdvisory",
    image: "/images/team/tariq-tahir.webp",
  },
  {
    slug: "zeeshan-haider",
    name: "Zeeshan Haider",
    department: "mediaProduction",
    image: "/images/team/zeeshan-haider.webp",
  },

];

/**
 * The two photographs the page sets its type over. Both are advisory scenes
 * rather than architecture: this is the one page about the firm rather than
 * the property, and a render of a lobby would be answering a different
 * question. `cbi-advisory.jpg` is already the About menu's "Our Team" card, so
 * the association is one a returning reader has met before.
 */
export const teamImages = {
  hero: "/images/cbi/cbi-advisory.jpg",
  cta: "/images/cbi/cbi-documents.jpg",
};
