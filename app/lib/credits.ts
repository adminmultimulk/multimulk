/**
 * Image attributions that are an obligation rather than a courtesy.
 *
 * Most of the photography on this site is Pexels stock or public domain, which
 * asks for nothing. One file does not: it is Creative Commons, and its licence
 * requires the author's name, the licence, and a link to both — placed
 * somewhere a reader can actually reach. `public/images/cbi/CREDITS.md` records
 * where every asset came from, but a file in the repository is not published,
 * so it does not discharge anything. This list is what `/legal/image-credits`
 * renders, and that page is the discharge.
 *
 * Nothing here is translated. Author names are proper nouns and licence names
 * are the licences' own identifiers; rendering "CC BY-SA 4.0" as anything else
 * in another language would be citing a licence that does not exist.
 *
 * Adding a Creative Commons image to the site means adding a row here. Removing
 * the last row does not mean removing the page — check `CREDITS.md` first.
 */
export type ImageCredit = {
  /** What the reader is looking at, in plain words. */
  subject: string;
  /** Where it appears, so a reader can match the credit to the picture. */
  usedOn: string;
  author: string;
  source: { label: string; href: string };
  licence: { label: string; href: string };
  /**
   * Set when the licence is share-alike, which binds our crop as well as the
   * original. The page says so in that case, because the obligation runs on to
   * anyone who takes the derived file from here. No current row sets it — the
   * only share-alike file was dropped when the destinations panel moved to
   * client artwork — but the next CC BY-SA image needs it.
   */
  shareAlike?: boolean;
};

export const imageCredits: ImageCredit[] = [
  {
    subject: "Soufrière and the Pitons at golden hour, Saint Lucia",
    usedOn: "Caribbean citizenship programme page, opening image",
    author: "Jim Vajda",
    source: {
      label: "Soufriere, St. Lucia Sunset.jpg on Wikimedia Commons",
      href: "https://commons.wikimedia.org/wiki/File:Soufriere,_St._Lucia_Sunset.jpg",
    },
    licence: {
      label: "CC BY 2.0",
      href: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
];
