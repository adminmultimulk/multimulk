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
 * Every card takes a rectangular studio frame at 186:287 — the shape the two
 * executives already use at 620x956, and the one the About page sets its
 * leadership pair in. The photograph fills the card and the name sits over its
 * foot; the executives are the same card, larger.
 *
 * The roster was previously a mix: circular cut-outs on the house green,
 * pre-masked at 440x440, for everyone below the executives. Those files are
 * square, so `object-cover` crops them hard to 186:287 — a person still on a
 * 440x440 circle needs a rectangular replacement, not a CSS adjustment.
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
 * The row beneath the executives, in the order Multi Mulk set.
 *
 * Senior enough to sit above the grid but not to share the executives' row:
 * they render at the grid's card size, under the same heading, so the eye
 * reads two tiers of one section rather than a third section.
 */
export const teamSeniorTeam: TeamPerson[] = [
  {
    slug: "souha-koudmani",
    name: "Souha Koudmani",
    department: "executiveLeadership",
    image: "/images/team/souha-koudmani-2.webp",
  },
  {
    slug: "ayshe-ali-haydar",
    name: "Ayshe Ali Haydar",
    department: "clientAdvisory",
    image: "/images/team/ayshe-ali-haydar.webp",
  },
  {
    slug: "asad-ullah-saif",
    name: "Asad Ullah Saif",
    department: "clientAdvisory",
    image: "/images/team/asad-ullah-saif.webp",
  },
  {
    slug: "tariq-tahir",
    name: "Tariq Tahir",
    department: "clientAdvisory",
    image: "/images/team/tariq-tahir.webp",
  },
];

/**
 * Everyone else, in the running order Multi Mulk set by hand.
 *
 * The grid reads in array order, so this array *is* the running order — there
 * is no sort. It was alphabetical until the business supplied an explicit one,
 * which is seniority and standing rather than anything a machine could derive,
 * so nothing here should be re-sorted without asking them first.
 *
 * Names below the supplied order are the people that order did not mention;
 * they sit at the end, alphabetically, rather than being dropped.
 *
 * Twenty-four of these joined in the September 2026 shoot. Two of that batch
 * turned out to be new photographs of people already listed — Niloofar Sadiq
 * and Seyhan Ozmen — and were updated in place rather than duplicated, taking
 * the newer photograph and the spelling the roster uses.
 */
export const teamPeople: TeamPerson[] = [
  {
    slug: "kubra-senturk",
    name: "Kubra Senturk",
    department: "legal",
    image: "/images/team/kubra-senturk-2.webp",
  },
  {
    slug: "sarmad-al-kaseer",
    name: "Sarmad Al Kaseer",
    department: "clientAdvisory",
    image: "/images/team/sarmad-al-kaseer-2.webp",
  },
  {
    slug: "muhammet-kurtulus",
    name: "Muhammet Kurtulus",
    department: "clientAdvisory",
    image: "/images/team/muhammet-kurtulus.webp",
  },
  {
    slug: "sobhi-al-sabhi",
    name: "Sobhi Al Sabhi",
    department: "clientAdvisory",
    image: "/images/team/sobhi-al-sabhi.webp",
  },
  {
    slug: "afsheen",
    name: "Afsheen Baig",
    department: "digitalMedia",
    image: "/images/team/afsheen.webp",
  },
  {
    slug: "muhammad-ali-shahid",
    name: "Muhammad Ali Shahid",
    department: "clientAdvisory",
    image: "/images/team/muhammad-ali-shahid-2.webp",
  },
  {
    slug: "zeynep-nehir-karap",
    name: "Zeynep Nehir Karap",
    department: "clientAdvisory",
    image: "/images/team/zeynep-nehir-karap-2.webp",
  },
  {
    slug: "badar-naseem",
    name: "Badar Naseem",
    department: "clientAdvisory",
    image: "/images/team/badar-naseem.webp",
  },
  {
    slug: "elnaz-aminzadeh",
    name: "Elnaz Aminzadeh",
    department: "clientAdvisory",
    image: "/images/team/elnaz-aminzadeh-2.webp",
  },
  {
    slug: "mubark-ali",
    name: "Mubark Ali",
    department: "clientAdvisory",
    image: "/images/team/mubark-ali-2.webp",
  },
  {
    slug: "seyhan-ozman",
    name: "Seyhan Ozmen",
    department: "operations",
    image: "/images/team/seyhan-ozman.webp",
  },
  {
    slug: "muhammad-jamal",
    name: "Muhammad Jamal",
    department: "clientAdvisory",
    image: "/images/team/muhammad-jamal-2.webp",
  },
  {
    slug: "sinan-sadikhov",
    name: "Sinan Sadikhov",
    department: "clientAdvisory",
    image: "/images/team/sinan-sadikhov.webp",
  },
  {
    slug: "raazia-sanam",
    name: "Raazia Sanam",
    department: "education",
    image: "/images/team/raazia-sanam-2.webp",
  },
  {
    slug: "mahenur-azlem",
    name: "Mahenur Azlem",
    department: "humanResources",
    image: "/images/team/mahenur-azlem-2.webp",
  },
  {
    slug: "alireza-akbari",
    name: "Alireza Akbari",
    department: "marketing",
    image: "/images/team/alireza-akbari-2.webp",
  },
  {
    slug: "rizwan-aslam",
    name: "Rizwan Aslam",
    department: "mediaProduction",
    image: "/images/team/rizwan-aslam-2.webp",
  },
  {
    slug: "maryam-shad",
    name: "Maryam Shad",
    department: "digitalMedia",
    image: "/images/team/maryam-shad-2.webp",
  },
  {
    slug: "hashim-hashimdan",
    name: "Hashim Hashimdan",
    department: "mediaProduction",
    image: "/images/team/hashim-hashimdan.webp",
  },
  {
    slug: "shahid",
    name: "Muhammad Shahid",
    department: "digitalMedia",
    image: "/images/team/shahid.webp",
  },
  {
    slug: "amina-ashraf",
    name: "Amina Ashraf",
    department: "digitalMedia",
    image: "/images/team/amina-ashraf-2.webp",
  },
  {
    slug: "zeeshan-haider",
    name: "Zeeshan Haider",
    department: "mediaProduction",
    image: "/images/team/zeeshan-haider.webp",
  },
  {
    slug: "shaik-mohammed-aburuddin",
    name: "Shaik Mohammed Aburuddin",
    department: "clientAdvisory",
    image: "/images/team/shaik-mohammed-aburuddin-2.webp",
  },
  {
    slug: "faizan-asif",
    name: "Faizan Asif",
    department: "digitalMedia",
    image: "/images/team/faizan-asif-2.webp",
  },
  {
    slug: "iffah-mir",
    name: "Iffah Mir",
    department: "digitalMedia",
    image: "/images/team/iffah-mir-2.webp",
  },
  {
    slug: "mohd-imad",
    name: "Mohd Imad",
    department: "digitalMedia",
    image: "/images/team/mohd-imad.webp",
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
    image: "/images/team/muhammad-riyasat-2.webp",
  },
  {
    slug: "nilofar-sadiq",
    name: "Niloofar Sadiq",
    department: "clientAdvisory",
    image: "/images/team/nilofar-sadiq-2.webp",
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
