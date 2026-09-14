/**
 * Image attributions that are an obligation rather than a courtesy.
 *
 * Most of the photography on this site is Pexels stock, public domain, or the
 * company's own. A few files are not: they are Creative Commons, and their
 * licences require the author's name, the licence, and a link to both —
 * placed somewhere a reader can actually reach. `public/images/cbi/CREDITS.md` records
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
  // The client-outcome pages: Grenada and Dominica, from Wikimedia Commons.
  {
    subject: "Grand Anse beach and St. George's from the air, Grenada",
    usedOn: "Client outcome: A Gulf Resident in Grenada, banner",
    author: "madmack66",
    source: {
      label: "Grand Anse and St. George's.jpg on Wikimedia Commons",
      href: "https://commons.wikimedia.org/wiki/File:Grand_Anse_and_St._George%27s.jpg",
    },
    licence: { label: "CC BY 2.0", href: "https://creativecommons.org/licenses/by/2.0/" },
  },
  {
    subject: "Grand Anse beach at sunset, Grenada",
    usedOn: "Client outcome: A Gulf Resident in Grenada, closing band",
    author: "madmack66",
    source: {
      label: "Grand Anse - 1.jpg on Wikimedia Commons",
      href: "https://commons.wikimedia.org/wiki/File:Grand_Anse_-_1.jpg",
    },
    licence: { label: "CC BY 2.0", href: "https://creativecommons.org/licenses/by/2.0/" },
  },
  {
    subject: "Grand Anse beach under the palms, Grenada",
    usedOn: "Client outcome: A Gulf Resident in Grenada, first frame",
    author: "Ian Gratton",
    source: {
      label: "Great Anse beach, Grenada.jpg on Wikimedia Commons",
      href: "https://commons.wikimedia.org/wiki/File:Great_Anse_beach,_Grenada.jpg",
    },
    licence: { label: "CC BY 2.0", href: "https://creativecommons.org/licenses/by/2.0/" },
  },
  {
    subject: "Grand Anse beach, Grenada",
    usedOn: "Client outcome: A Gulf Resident in Grenada, collage",
    author: "Varun Kapoor / Vkap",
    source: {
      label: "Grand Anse Beach Grenada.jpg on Wikimedia Commons",
      href: "https://commons.wikimedia.org/wiki/File:Grand_Anse_Beach_Grenada.jpg",
    },
    licence: { label: "CC BY 3.0", href: "https://creativecommons.org/licenses/by/3.0/" },
  },
  {
    subject: "The Cabrits National Park from Prince Rupert Bay, Dominica",
    usedOn: "Client outcome: An Egyptian Family in Dominica, banner and closing band",
    author: "David Broad",
    source: {
      label: "Cabritts National Park, Dominica - panoramio.jpg on Wikimedia Commons",
      href: "https://commons.wikimedia.org/wiki/File:Cabritts_National_Park,_Dominica_-_panoramio.jpg",
    },
    licence: { label: "CC BY 3.0", href: "https://creativecommons.org/licenses/by/3.0/" },
  },
  {
    subject: "The Soufrière coast, Dominica",
    usedOn: "Client outcome: An Egyptian Family in Dominica, second frame",
    author: "giggel",
    source: {
      label: "Dominica, Karibik - The Soufriere Coast - panoramio.jpg on Wikimedia Commons",
      href: "https://commons.wikimedia.org/wiki/File:Dominica,_Karibik_-_Dominica_-_The_Soufriere_Coast_-_panoramio.jpg",
    },
    licence: { label: "CC BY 3.0", href: "https://creativecommons.org/licenses/by/3.0/" },
  },
  {
    subject: "Soufrière and the Pitons at golden hour, Saint Lucia",
    usedOn: "Caribbean citizenship programme page, opening image; Saint Lucia programme page, banner",
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
