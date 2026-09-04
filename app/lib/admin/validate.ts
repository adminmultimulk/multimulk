import { allArticles } from "@/app/lib/knowledge";
import { units } from "@/app/lib/properties";
import { isTopic } from "@/app/lib/topics";

export { checkSlug, slugify } from "./slug";

/**
 * Slugs the static content in `app/lib` already answers on.
 *
 * The public site merges the database on top of those lists, and a collision
 * would give one URL two articles. Checking here means the clash is a form
 * error at the moment of typing rather than a page that renders whichever
 * source happened to sort first.
 */
export const reservedArticleSlugs = new Set(allArticles.map((a) => a.slug));
export const reservedPropertySlugs = new Set(units.map((u) => u.slug));


/** Splits a textarea into one entry per non-empty line, trimmed. */
export function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Splits a comma-separated field, e.g. the topics input. */
export function commaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * What an article body can be wrong about.
 *
 * The parser degrades quietly by design — an image it cannot render becomes a
 * paragraph of literal Markdown rather than an exception on a live page — and
 * quiet is exactly wrong at the moment of saving, where the person who can fix
 * it is looking at the screen. So the two mistakes that produce visible
 * nonsense are caught here instead.
 */
export function checkBody(blocks: readonly string[]): string | null {
  if (!blocks.length) return "The article has no body copy.";

  const remote = blocks.find((block) =>
    /^!\[[^\]]*\]\((?!\/)/.test(block.trim()),
  );
  if (remote)
    return 'An image in the body points somewhere else. Use a path under /public, e.g. "/images/levent-residences.webp".';

  const empty = blocks.find((block) => /^#{2,3}\s*$/.test(block.trim()));
  if (empty) return "There is a heading with nothing in it.";

  return null;
}

/**
 * A `datetime-local` field, read as UTC.
 *
 * The editor's input is UTC and is labelled as such — see `Schedule` in the
 * article form — because a local time the server has to reconstruct from a
 * timezone the form never sent is how a scheduled piece goes out early. A
 * bare `YYYY-MM-DD` is accepted too, which is the shape the field had before
 * scheduling existed and what a hand-edited row may still hold.
 */
export function when(value: string): Date | null | "invalid" {
  if (!value) return null;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00Z`
    : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
      ? `${value}:00Z`
      : null;
  if (!iso) return "invalid";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "invalid" : date;
}

export function checkTopics(values: string[]): string | null {
  if (values.length === 0) return "Pick at least one topic.";
  const unknown = values.filter((value) => !isTopic(value));
  if (unknown.length) return `Not a topic: ${unknown.join(", ")}.`;
  return null;
}

/** A site-relative path or an absolute URL; anything else breaks `next/image`. */
export function checkImage(value: string, label: string): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return null;
  if (/^https?:\/\//.test(value)) return null;
  return `${label} must start with "/" or be a full https:// URL.`;
}

/** Reads a text field out of a FormData, trimmed. */
export function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function checkbox(form: FormData, name: string): boolean {
  return form.get(name) === "on" || form.get(name) === "true";
}

/** A money field: digits only, and never negative. */
export function money(value: string): number | null {
  const cleaned = value.replace(/[,\s]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isSafeInteger(n) ? n : null;
}
