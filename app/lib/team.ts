import type { Dictionary } from "./i18n";

/**
 * The team page.
 *
 * Twelve people, carried over from the previous site's team page along with
 * their portraits. Names live here because names are never translated; the
 * department above the name and the role beneath it are keyed by slug in the
 * dictionary, so they read in whatever language the page is in.
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

/** Everyone else, in the order the previous site listed them. */
export const teamPeople: TeamPerson[] = [
  {
    slug: "nargis-sadiq",
    name: "Nargis Sadiq",
    department: "turkeyOperations",
    image: "/images/team/nargis-sadiq.webp",
  },
  {
    slug: "seyhan-ozman",
    name: "Seyhan Ozman",
    department: "operations",
    image: "/images/team/seyhan-ozman.webp",
  },
  {
    slug: "fatih-abbas",
    name: "Fatih Abbas",
    department: "istanbulSales",
    image: "/images/team/fatih-abbas.webp",
  },
  {
    slug: "errfan-balouch",
    name: "Errfan Balouch",
    department: "sales",
    image: "/images/team/errfan-balouch.webp",
  },
  {
    slug: "nilofar-sadiq",
    name: "Nilofar Sadiq",
    department: "clientAdvisory",
    image: "/images/team/nilofar-sadiq.webp",
  },
  {
    slug: "danish-anwar",
    name: "Danish Anwar",
    department: "clientAdvisory",
    image: "/images/team/danish-anwar.webp",
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
    slug: "abdul-hadi",
    name: "Abdul Hadi",
    department: "mediaProduction",
    image: "/images/team/abdul-hadi.webp",
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
