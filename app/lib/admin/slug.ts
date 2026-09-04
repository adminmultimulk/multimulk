/**
 * Slug shaping, kept apart from the rest of the form validation.
 *
 * `validate.ts` reads the static article and property lists to check a slug is
 * not already spoken for, which pulls in the whole content layer — a megabyte
 * of prose that must never be sent to a browser. The editor forms want the
 * slugify half as you type, so that half lives here on its own.
 */

/** Lowercase, digits and single hyphens — what the existing slugs all are. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const MAX_SLUG = 96;

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG);
}

export function checkSlug(value: string): string | null {
  if (!value) return "A slug is required.";
  if (value.length > MAX_SLUG)
    return `Slugs are limited to ${MAX_SLUG} characters.`;
  if (!SLUG.test(value))
    return "Use lowercase letters, numbers and single hyphens only.";
  return null;
}
