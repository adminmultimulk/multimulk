/**
 * The Document Library: the guides, checklists and decks a reader can take
 * away as a PDF.
 *
 * The files live in `public/documents`, their first pages in
 * `public/images/documents`, both named after the slug. They arrived as slide
 * decks exported one photograph per page at up to 10,000 px wide — half a
 * gigabyte for nine files — and were re-encoded at 2,400 px, which keeps the
 * type crisp at full screen and brings the largest under 16 MB. Replacing a
 * file means doing the same, and updating `pages` and `bytes` here.
 *
 * Titles and summaries are in `dictionary.documents.items`, keyed by slug.
 */

export const documentCategories = [
  "citizenship",
  "applications",
  "programmes",
  "company",
] as const;

export type DocumentCategory = (typeof documentCategories)[number];

export function isDocumentCategory(value: string): value is DocumentCategory {
  return (documentCategories as readonly string[]).includes(value);
}

export type LibraryDocument = {
  slug: string;
  category: DocumentCategory;
  pages: number;
  /** The file's size on disk, shown on the card before a 16 MB download. */
  bytes: number;
};

/** In the order the library lists them within a category. */
export const libraryDocuments: readonly LibraryDocument[] = [
  { slug: "turkiye-citizenship-guide", category: "citizenship", pages: 24, bytes: 6416338 },
  { slug: "step-by-step-process-timeline-guide", category: "citizenship", pages: 22, bytes: 5136781 },
  { slug: "turkish-citizenship-application-stages", category: "citizenship", pages: 19, bytes: 4436819 },
  { slug: "cbi-bank-deposit", category: "citizenship", pages: 16, bytes: 4636070 },
  { slug: "turkey-visa-document-checklist", category: "applications", pages: 17, bytes: 923268 },
  { slug: "turkish-citizenship-application-documents", category: "applications", pages: 13, bytes: 3657316 },
  { slug: "global-citizenship-and-residency-programs", category: "programmes", pages: 41, bytes: 15976011 },
  { slug: "multi-mulk-company-profile", category: "company", pages: 16, bytes: 5086241 },
  { slug: "multi-mulk-b2b", category: "company", pages: 14, bytes: 6668101 },
];

export const documentFile = (slug: string) => `/documents/${slug}.pdf`;
export const documentCover = (slug: string) => `/images/documents/${slug}.jpg`;
