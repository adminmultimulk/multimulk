/**
 * Price parsing, kept apart from the rest of the form validation.
 *
 * Same reason `slug.ts` is its own file: `validate.ts` reads the static
 * article and property lists to check a slug is not already spoken for, which
 * pulls in the whole content layer — a megabyte of prose that must never be
 * sent to a browser. The preview beside the property form has to read a price
 * exactly the way the Server Action will, so that half lives here on its own
 * and both sides import it.
 */

/** A currency symbol or code somebody pasted along with the number. */
const SYMBOLS = /[$€₺]|\b(?:USD|EUR|TRY|TL)\b/gi;

/** "450.000", "450,000", "1 234 567" — a number written with its thousands. */
const GROUPED = /^\d{1,3}(?:[.,]\d{3})+$/;

/**
 * A money field: a whole number, however it was written.
 *
 * The prices on this site are entered by people working across three
 * currencies and two conventions for writing them, usually by pasting out of a
 * developer's sheet — so "450000", "450,000", "450.000" and "$450,000" all
 * mean the same thing and are all read the same way. A separator is only
 * honoured where it groups three digits, because that is the only place it is
 * unambiguous: "450.5" could be a price with a typo or a number that is not a
 * price at all, and rejecting it so somebody looks is better than saving one
 * of the two readings and being wrong half the time.
 */
export function money(value: string): number | null {
  const bare = value.replace(SYMBOLS, "").replace(/[\s ]/g, "");
  const cleaned = GROUPED.test(bare) ? bare.replace(/[.,]/g, "") : bare;
  if (!/^\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isSafeInteger(n) ? n : null;
}
