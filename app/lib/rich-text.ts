/**
 * The grammar an article body is written in, and the parser for it.
 *
 * An article is stored as a list of blocks — one entry per paragraph, heading,
 * list, quote, image, callout or table — which is the shape the migrated
 * archive already arrived in and the shape the database column holds. That
 * storage stays a plain `string[]`; what changes here is that a block may now
 * carry structure, so a writer has the tools a blog needs without the body
 * becoming HTML that has to be sanitised before it can be rendered.
 *
 * The subset is deliberately small and Markdown-shaped: everything below is
 * what an editor would type by reflex, and nothing in it can produce markup
 * this file did not construct. Parsing happens here and rendering happens in
 * `ArticleBody`, so the dashboard's preview and the published page are the
 * same code and cannot drift.
 *
 * Block level, one per entry, distinguished by how the entry starts:
 *
 *     ## Heading                     a section heading
 *     ### Heading                    a subheading
 *     - item                         a bulleted list, one item per line
 *     1. item                        a numbered list, one item per line
 *     > Quoted line                  a pull quote
 *     > — Attribution                …and who said it, as the last line
 *     ![Alt](/images/x.jpg "Cap")    a figure, with optional caption
 *     | a | b |                      a table, one row per line
 *     :::note Title                  a callout; note, tip, warning or key
 *     ---                            a rule between sections
 *     anything else                  a paragraph
 *
 * Inline, anywhere prose is allowed: `**bold**`, `*italic*`, `` `code` ``,
 * `[text](https://…)`, and a backslash to escape any of them.
 */

import { slugify } from "./admin/slug";

// --- Inline ------------------------------------------------------------------

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong"; children: Inline[] }
  | { kind: "em"; children: Inline[] }
  | { kind: "code"; text: string }
  | { kind: "link"; href: string; children: Inline[] };

/**
 * One pass, longest marker first.
 *
 * `**` has to be tried before `*` or every bold run would parse as two empty
 * italics, and the escape alternative has to come before both so `\*` can mean
 * an asterisk in a price footnote rather than the start of emphasis.
 *
 * Held as a source string and compiled per call rather than as one shared
 * `/g` literal: `parseInline` recurses into the contents of a link or a bold
 * run, and a nested call sharing the outer call's `lastIndex` restarts it from
 * the beginning of the string — which is not a wrong result, it is a loop.
 */
const INLINE_SOURCE =
  "\\\\([\\\\*`[\\]])|\\*\\*([^*]+)\\*\\*|\\*([^*\\n]+)\\*|`([^`]+)`|\\[([^\\]\\n]+)\\]\\(([^\\s)]+)\\)";

/**
 * Only schemes that are safe to put in an `href`.
 *
 * A link's target comes from the same textarea as its label, so `javascript:`
 * is reachable from the editor by anybody who can write an article. Everything
 * that is not a site path, an ordinary web URL, a mail or a phone link is
 * dropped back to plain text rather than rendered as a link.
 */
function safeHref(href: string): string | null {
  if (href.startsWith("/") || href.startsWith("#")) return href;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  return null;
}

export function parseInline(input: string): Inline[] {
  const out: Inline[] = [];
  const inline = new RegExp(INLINE_SOURCE, "g");
  let last = 0;

  const push = (text: string) => {
    if (text) out.push({ kind: "text", text });
  };

  let match: RegExpExecArray | null;
  while ((match = inline.exec(input))) {
    push(input.slice(last, match.index));
    last = match.index + match[0].length;

    const [, escaped, strong, em, code, label, href] = match;
    if (escaped !== undefined) push(escaped);
    else if (strong !== undefined)
      out.push({ kind: "strong", children: parseInline(strong) });
    else if (em !== undefined)
      out.push({ kind: "em", children: parseInline(em) });
    else if (code !== undefined) out.push({ kind: "code", text: code });
    else if (label !== undefined && href !== undefined) {
      const target = safeHref(href);
      if (target) out.push({ kind: "link", href: target, children: parseInline(label) });
      else push(label);
    }
  }

  push(input.slice(last));
  return out;
}

/** An inline run with its markup removed — for meta descriptions and counts. */
export function inlineText(nodes: readonly Inline[]): string {
  return nodes
    .map((node) =>
      node.kind === "text" || node.kind === "code"
        ? node.text
        : inlineText(node.children),
    )
    .join("");
}

// --- Blocks ------------------------------------------------------------------

export type CalloutTone = "note" | "tip" | "warning" | "key";

export type Block =
  | { kind: "heading"; level: 2 | 3; id: string; content: Inline[] }
  | { kind: "paragraph"; content: Inline[] }
  | { kind: "list"; ordered: boolean; items: Inline[][] }
  | { kind: "quote"; content: Inline[]; cite?: string }
  | { kind: "figure"; src: string; alt: string; caption?: string }
  | { kind: "callout"; tone: CalloutTone; title?: string; paragraphs: Inline[][] }
  | { kind: "table"; head: Inline[][]; rows: Inline[][][] }
  | { kind: "divider" };

const BULLET = /^[-*]\s+/;
const NUMBER = /^\d+[.)]\s+/;
const FIGURE = /^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/;
const CALLOUT_TONES: readonly CalloutTone[] = ["note", "tip", "warning", "key"];

function isTone(value: string): value is CalloutTone {
  return (CALLOUT_TONES as readonly string[]).includes(value);
}

/** A table row: `| a | b |`, with the outer pipes optional. */
function cells(line: string): string[] {
  return line
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

/** A `| --- | --- |` alignment row, which carries nothing worth rendering. */
function isRule(line: string): boolean {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(line);
}

function parseBlock(raw: string): Block | null {
  const block = raw.trim();
  if (!block) return null;

  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  const first = lines[0];

  if (/^-{3,}$/.test(block) || /^\*{3,}$/.test(block)) return { kind: "divider" };

  if (first.startsWith("### ") || first.startsWith("## ")) {
    const level = first.startsWith("### ") ? 3 : 2;
    const text = first.slice(level === 3 ? 4 : 3).trim();
    return {
      kind: "heading",
      level,
      // Stable enough to link to, and derived from the words rather than the
      // position, so adding a section above one does not move its anchor.
      id: slugify(text) || "section",
      content: parseInline(text),
    };
  }

  const figure = FIGURE.exec(first);
  if (figure) {
    // Site paths only. `next/image` refuses a host that is not in
    // `images.remotePatterns`, and an editor pasting a URL from elsewhere
    // would otherwise take the whole page down with it at render.
    if (figure[2].startsWith("/"))
      return {
        kind: "figure",
        src: figure[2],
        alt: figure[1],
        // A caption may sit in the title slot or on the line below, because
        // both are what people try.
        caption: figure[3]?.trim() || lines.slice(1).join(" ") || undefined,
      };
  }

  if (first.startsWith(":::")) {
    const [tone, ...title] = first.slice(3).trim().split(/\s+/);
    const body = lines.slice(1).filter((line) => line !== ":::");
    return {
      kind: "callout",
      tone: isTone(tone) ? tone : "note",
      title: title.join(" ") || undefined,
      paragraphs: body.length ? body.map(parseInline) : [[]],
    };
  }

  if (first.startsWith(">")) {
    const quoted = lines.map((line) => line.replace(/^>\s?/, ""));
    const attributed = quoted[quoted.length - 1]?.startsWith("—");
    const cite = attributed ? quoted.pop()!.replace(/^—\s*/, "") : undefined;
    return { kind: "quote", content: parseInline(quoted.join(" ")), cite };
  }

  if (BULLET.test(first) || NUMBER.test(first)) {
    const ordered = NUMBER.test(first);
    const marker = ordered ? NUMBER : BULLET;
    return {
      kind: "list",
      ordered,
      // A wrapped continuation line joins the item above it rather than
      // becoming a bullet of its own.
      items: lines.reduce<Inline[][]>((items, line) => {
        if (marker.test(line)) items.push(parseInline(line.replace(marker, "")));
        else if (items.length)
          items[items.length - 1].push({ kind: "text", text: ` ${line}` });
        return items;
      }, []),
    };
  }

  if (first.startsWith("|")) {
    const rows = lines.filter((line) => !isRule(line)).map(cells);
    const [head, ...body] = rows;
    if (head)
      return {
        kind: "table",
        head: head.map(parseInline),
        rows: body.map((row) => row.map(parseInline)),
      };
  }

  // A soft-wrapped paragraph is one paragraph: the line breaks a writer types
  // to keep a line readable in the textarea are not breaks in the prose.
  return { kind: "paragraph", content: parseInline(lines.join(" ")) };
}

export function parseBlocks(body: readonly string[]): Block[] {
  return body.flatMap((entry) => {
    const block = parseBlock(entry);
    return block ? [block] : [];
  });
}

/**
 * Splits the editor's textarea into stored blocks.
 *
 * A blank line ends a block, which is how anybody separates paragraphs
 * already. Line breaks *inside* a block are kept, because a list, a table and
 * a callout all need them; the join back into running prose happens per block
 * in `parseBlock`, where it knows which kind it is looking at.
 */
export function toBlocks(value: string): string[] {
  return value
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+$/gm, "").trim())
    .filter(Boolean);
}

/** Stored blocks back into the text the editor edits. */
export function fromBlocks(body: readonly string[]): string {
  return body.join("\n\n");
}

// --- Derived -----------------------------------------------------------------

/** A block as prose, for structured data, descriptions and word counts. */
export function blockText(block: Block): string {
  switch (block.kind) {
    case "heading":
    case "paragraph":
    case "quote":
      return inlineText(block.content);
    case "list":
      return block.items.map(inlineText).join(" ");
    case "callout":
      return [block.title, ...block.paragraphs.map(inlineText)]
        .filter(Boolean)
        .join(" ");
    case "table":
      return [block.head, ...block.rows]
        .map((row) => row.map(inlineText).join(" "))
        .join(" ");
    case "figure":
      return block.caption ?? "";
    case "divider":
      return "";
  }
}

export function plainText(body: readonly string[]): string[] {
  return parseBlocks(body)
    .map(blockText)
    .filter(Boolean);
}

export function wordCount(body: readonly string[]): number {
  const words = plainText(body).join(" ").match(/[\p{L}\p{N}'’-]+/gu);
  return words ? words.length : 0;
}

/** Minutes, at the 220 words a minute that is the usual figure for prose. */
export function readingMinutes(body: readonly string[]): number {
  return Math.max(1, Math.round(wordCount(body) / 220));
}
