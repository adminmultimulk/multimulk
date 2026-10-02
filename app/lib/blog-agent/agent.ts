/**
 * The blog agent: one Claude conversation that researches, picks photography
 * and hands back a finished article.
 *
 * A manual loop over the Messages API rather than the SDK's tool runner,
 * because two of the four tools run on Anthropic's side (web search and web
 * fetch), and a long server-side research turn can stop on `pause_turn`,
 * which the runner does not resume. The other two run here: `search_images`
 * queries Pixabay and shows the model the photos, and `submit_article`
 * validates the piece and either accepts it or answers with what to fix.
 *
 * That last one is the editor. Nobody reads the post before it goes live, so
 * every rule the dashboard enforces on a human — a known topic, an unused
 * slug, a figure the page can render, a link that resolves — is checked here,
 * and a failure goes back to the model as a tool error rather than to the
 * site as a broken page.
 *
 * Nothing in this file writes to the database or Cloudinary; `publish.ts`
 * does that with what `runBlogAgent` returns.
 */

import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/app/lib/db";
import { checkBody, checkSlug, checkTopics, reservedArticleSlugs, slugify } from "@/app/lib/admin/validate";
import { topics, type Topic } from "@/app/lib/topics";
import { previewData, searchPhotos, type Photo } from "./pixabay";
import { AGENT_CATEGORIES, SYSTEM, brief, type RecentPiece } from "./prompt";

/**
 * Sonnet rather than Opus: a daily post is a cost that recurs, and the budget
 * below is what the business set for it. Per million tokens: input, a cache
 * write, a cache read, output — used for the running estimate.
 */
const MODEL = "claude-sonnet-5-5";
const PRICE = { input: 2, cacheWrite: 2.5, cacheRead: 0.2, output: 10, perSearch: 0.01 };

/**
 * What one post may cost, in US dollars. At half of it the model is told to
 * stop researching and submit; at all of it the run is abandoned rather than
 * allowed to keep spending.
 */
const BUDGET_USD = Number(process.env.BLOG_AGENT_BUDGET_USD) || 0.5;

/** Sources the agent may not read or cite. Subdomains are covered. */
const BLOCKED_DOMAINS = ["wikipedia.org", "wikiwand.com"];

/** Round trips before giving up. A normal run takes six to ten. */
const MAX_TURNS = 30;

/** A figure the model writes into the body, before it is copied to Cloudinary. */
export const PHOTO_FIGURE = /^!\[([^\]]*)\]\(photo:(\d+)(?:\s+"([^"]*)")?\)$/;

export type Draft = {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  category: (typeof AGENT_CATEGORIES)[number];
  topics: Topic[];
  cover: { photo: Photo; alt: string };
  /** Figures still read `photo:<id>`; `publish.ts` swaps in Cloudinary. */
  body: string[];
  /** Every photo the model saw, by id, so the body's figures can be resolved. */
  photos: Map<number, Photo>;
  sources: { title: string; url: string }[];
};

export type RunStats = {
  turns: number;
  inputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
  outputTokens: number;
  webSearches: number;
  webFetches: number;
  /** Rough, at list price; for the log, not the invoice. */
  estimatedUsd: number;
};

const tools: Anthropic.Beta.BetaToolUnion[] = [
  // The research allowance, and most of the cost: every page read is carried
  // in the conversation for the rest of the run. A page is cut off at 8,000
  // tokens, which is the article and not the site's navigation around it.
  // Wikipedia is closed off: it is a summary of other sources, anyone can
  // edit it, and it is not what an investment firm should be citing.
  { type: "web_search_20260209", name: "web_search", max_uses: 5, blocked_domains: BLOCKED_DOMAINS },
  {
    type: "web_fetch_20260209",
    name: "web_fetch",
    max_uses: 4,
    max_content_tokens: 8000,
    blocked_domains: BLOCKED_DOMAINS,
  },
  {
    name: "search_images",
    description:
      "Search Pixabay stock photography (free for commercial use). Returns up to 6 landscape photos, each with its numeric id, size, tags and photographer, followed by the photo itself so you can judge it. Use concrete visual queries; run several searches to find better options.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: 'A short visual description, e.g. "Istanbul Bosphorus skyline dusk".',
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    eager_input_streaming: true,
  },
  {
    name: "submit_article",
    description:
      "Submit the finished article. It is validated; if anything is wrong you get a list of errors to fix, and you should submit again. On success the article is scheduled for publication and your work is done.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "The headline. Under 90 characters, specific, no clickbait." },
        slug: { type: "string", description: "URL slug: lowercase words joined by hyphens, under 70 characters." },
        excerpt: {
          type: "string",
          description: "The standfirst: one or two sentences (under 260 characters) shown on cards and under the headline.",
        },
        seo_title: { type: "string", description: "The <title> tag, under 60 characters." },
        seo_description: { type: "string", description: "Meta description, 120–160 characters." },
        category: { type: "string", enum: [...AGENT_CATEGORIES] },
        topics: {
          type: "array",
          items: { type: "string", enum: [...topics] },
          description: "One to three topics.",
        },
        cover: {
          type: "object",
          properties: {
            photo_id: { type: "integer", description: "A photo id returned by search_images." },
            alt: { type: "string", description: "Alt text describing the photo." },
          },
          required: ["photo_id", "alt"],
          additionalProperties: false,
        },
        body: {
          type: "array",
          items: { type: "string" },
          description: "The article body, one block per entry, in the grammar from your instructions. Two to four photo figures.",
        },
        sources: {
          type: "array",
          description: "Every source you relied on, as read with web_fetch or web_search.",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Publisher and page title, e.g. \"TurkStat — House Sales Statistics, August 2026\"." },
              url: { type: "string" },
            },
            required: ["title", "url"],
            additionalProperties: false,
          },
        },
      },
      required: ["title", "slug", "excerpt", "seo_title", "seo_description", "category", "topics", "cover", "body", "sources"],
      additionalProperties: false,
    },
    eager_input_streaming: true,
  },
];

type Submission = {
  title?: unknown;
  slug?: unknown;
  excerpt?: unknown;
  seo_title?: unknown;
  seo_description?: unknown;
  category?: unknown;
  topics?: unknown;
  cover?: { photo_id?: unknown; alt?: unknown };
  body?: unknown;
  sources?: unknown;
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/**
 * Checks a submission and builds the draft, or lists what is wrong with it.
 *
 * The input is validated here rather than trusted: with eager input streaming
 * the API passes the model's JSON through without checking it against the
 * schema, so a missing field arrives as `undefined`, not as a 400.
 */
async function review(
  input: Submission,
  photos: Map<number, Photo>,
  linkable: Set<string>,
): Promise<{ draft: Draft } | { errors: string[] }> {
  const errors: string[] = [];

  const title = text(input.title);
  if (!title) errors.push("title is empty.");
  if (title.length > 200) errors.push("title is over 200 characters.");

  const slug = slugify(text(input.slug) || title);
  const slugError = checkSlug(slug);
  if (slugError) errors.push(`slug: ${slugError}`);
  else if (reservedArticleSlugs.has(slug) || (await prisma.article.findUnique({ where: { slug }, select: { id: true } })))
    errors.push(`slug "${slug}" is already used by another article; choose a different one.`);

  const excerpt = text(input.excerpt);
  if (excerpt.length < 40 || excerpt.length > 320) errors.push("excerpt must be 40–320 characters.");

  const seoTitle = text(input.seo_title);
  if (!seoTitle || seoTitle.length > 120) errors.push("seo_title must be 1–120 characters.");
  const seoDescription = text(input.seo_description);
  if (!seoDescription || seoDescription.length > 320) errors.push("seo_description must be 1–320 characters.");

  const category = text(input.category);
  if (!(AGENT_CATEGORIES as readonly string[]).includes(category))
    errors.push(`category must be one of: ${AGENT_CATEGORIES.join(", ")}.`);

  const chosenTopics = Array.isArray(input.topics) ? input.topics.map(String) : [];
  const topicError = checkTopics(chosenTopics);
  if (topicError) errors.push(`topics: ${topicError}`);

  const coverId = Number(input.cover?.photo_id);
  const coverPhoto = photos.get(coverId);
  if (!coverPhoto) errors.push(`cover.photo_id ${input.cover?.photo_id} is not a photo returned by search_images.`);
  const coverAlt = text(input.cover?.alt) || coverPhoto?.alt || title;

  const body = Array.isArray(input.body) ? input.body.map((block) => String(block).trim()).filter(Boolean) : [];
  let figures = 0;
  for (const block of body) {
    if (!block.startsWith("![")) continue;
    const figure = PHOTO_FIGURE.exec(block.split("\n")[0]);
    if (!figure) {
      errors.push(`Figure is not in the form ![Alt](photo:ID "Caption"): ${block.slice(0, 120)}`);
      continue;
    }
    figures++;
    const id = Number(figure[2]);
    if (!photos.has(id)) errors.push(`Figure photo:${id} is not a photo returned by search_images.`);
    if (id === coverId) errors.push(`Figure photo:${id} is the cover photo; use a different photo inline.`);
  }
  if (figures < 2 || figures > 4) errors.push(`The body has ${figures} figures; place two to four.`);

  // A path that is not on the site is a 404 on a page nobody proofread.
  for (const [, href] of body.join("\n").matchAll(/\]\((\/[^)\s]*)/g)) {
    const path = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (!linkable.has(path)) errors.push(`Internal link ${href} is not a page on the site; use a path from the list.`);
  }

  for (const [, href] of body.join("\n").matchAll(/\]\((https?:\/\/[^)\s]+)/g)) {
    const host = URL.canParse(href) ? new URL(href).hostname : "";
    if (BLOCKED_DOMAINS.some((domain) => host.endsWith(domain)))
      errors.push(`The body links to ${href}; link the original publisher instead.`);
  }

  // The dashboard's own body rules, with figures stood in for by a local path
  // because they are not on Cloudinary yet.
  const bodyError = checkBody(body.map((block) => block.replace(/\(photo:\d+/, "(/placeholder.jpg")));
  if (bodyError) errors.push(`body: ${bodyError}`);

  const words = body.filter((block) => !block.startsWith("![")).join(" ").split(/\s+/).length;
  if (words < 700) errors.push(`The body is about ${words} words; it should be 900–1,400.`);

  const sources = (Array.isArray(input.sources) ? input.sources : [])
    .map((source: { title?: unknown; url?: unknown }) => ({ title: text(source?.title), url: text(source?.url) }))
    .filter((source) => source.title && source.url);
  if (sources.length < 2) errors.push("List at least two sources.");
  for (const source of sources)
    if (!/^https:\/\//.test(source.url) || !URL.canParse(source.url)) errors.push(`Source URL must be a full https URL: ${source.url}`);
    else if (BLOCKED_DOMAINS.some((domain) => new URL(source.url).hostname.endsWith(domain)))
      errors.push(`${source.url} is not an acceptable source; cite the original publisher instead.`);

  if (errors.length) return { errors };

  return {
    draft: {
      title,
      slug,
      excerpt,
      seoTitle,
      seoDescription,
      category: category as Draft["category"],
      topics: chosenTopics as Topic[],
      cover: { photo: coverPhoto!, alt: coverAlt },
      body,
      photos,
      sources,
    },
  };
}

async function imageResults(
  query: string,
  photos: Map<number, Photo>,
): Promise<Anthropic.Beta.BetaToolResultBlockParam["content"]> {
  const found = await searchPhotos(query);
  if (!found.length) return [{ type: "text", text: `No photos found for "${query}". Try a broader query.` }];

  const previews = await Promise.all(found.map(previewData));
  const content: Anthropic.Beta.BetaToolResultBlockParam["content"] = [];
  found.forEach((photo, index) => {
    photos.set(photo.id, photo);
    content.push({
      type: "text",
      text: `Photo ${photo.id} — ${photo.width}×${photo.height} — "${photo.alt || "no description"}" — by ${photo.photographer}`,
    });
    const preview = previews[index];
    if (preview)
      content.push({
        type: "image",
        source: { type: "base64", media_type: preview.mediaType, data: preview.data },
      });
  });
  return content;
}

export async function runBlogAgent({
  publishAt,
  recent,
  internalPaths,
  linkable,
  deadline,
  log = console.log,
}: {
  publishAt: Date;
  recent: RecentPiece[];
  /** The paths offered to the model. */
  internalPaths: string[];
  /** Every path a link may point at, which is wider: any article, too. */
  linkable: Set<string>;
  /**
   * Epoch ms the run must be over by — the cron's function is stopped at
   * Vercel's limit, and a run cut off there publishes nothing. Ninety seconds
   * out the model is told to submit, as it is at half the budget.
   */
  deadline?: number;
  log?: (line: string) => void;
}): Promise<{ draft: Draft; stats: RunStats }> {
  const client = new Anthropic();
  const photos = new Map<number, Photo>();
  const stats: RunStats = {
    turns: 0,
    inputTokens: 0,
    cacheWriteTokens: 0,
    cacheReadTokens: 0,
    outputTokens: 0,
    webSearches: 0,
    webFetches: 0,
    estimatedUsd: 0,
  };

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: brief({ publishAt, recent, internalPaths }) },
  ];

  while (stats.turns < MAX_TURNS) {
    stats.turns++;

    const response = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 64000,
        // On a safety decline the API reruns the turn on a fallback model
        // instead of ending the run with nothing.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        thinking: { type: "adaptive" },
        output_config: { effort: "medium" },
        // Caches the conversation so far; each turn re-reads it at a tenth
        // of the price instead of paying for the whole history again.
        cache_control: { type: "ephemeral" },
        system: SYSTEM,
        tools,
        messages,
      }, deadline ? { timeout: Math.max(20_000, deadline - Date.now()) } : undefined)
      .finalMessage();

    const usage = response.usage;
    stats.inputTokens += usage.input_tokens;
    stats.cacheWriteTokens += usage.cache_creation_input_tokens ?? 0;
    stats.cacheReadTokens += usage.cache_read_input_tokens ?? 0;
    stats.outputTokens += usage.output_tokens;
    stats.webSearches += usage.server_tool_use?.web_search_requests ?? 0;
    stats.webFetches += usage.server_tool_use?.web_fetch_requests ?? 0;
    stats.estimatedUsd =
      (stats.inputTokens * PRICE.input +
        stats.cacheWriteTokens * PRICE.cacheWrite +
        stats.cacheReadTokens * PRICE.cacheRead +
        stats.outputTokens * PRICE.output) /
        1e6 +
      stats.webSearches * PRICE.perSearch;

    for (const block of response.content) {
      if (block.type === "server_tool_use") log(`  ${block.name}: ${JSON.stringify(block.input)}`);
    }

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "refusal")
      throw new Error(`The model declined (${response.stop_details?.category ?? "no category"}).`);
    if (response.stop_reason === "max_tokens")
      throw new Error("The model ran out of output tokens mid-turn.");
    // A long server-side research turn: send it back as it is and the API
    // carries on where it stopped.
    if (response.stop_reason === "pause_turn") continue;

    if (stats.estimatedUsd >= BUDGET_USD)
      throw new Error(`Stopped at ~$${stats.estimatedUsd.toFixed(2)}, over the $${BUDGET_USD} budget, with nothing accepted.`);
    const left = deadline ? deadline - Date.now() : Infinity;
    if (left < 20_000) throw new Error("Out of time with nothing accepted.");
    const wrapUp =
      stats.estimatedUsd >= BUDGET_USD / 2 || left < 90_000
        ? "Budget note: the research budget is spent. Do not search or fetch anything more; write with what you have and call submit_article now."
        : null;

    const calls = response.content.filter(
      (block): block is Anthropic.Beta.BetaToolUseBlock => block.type === "tool_use",
    );
    if (!calls.length) {
      messages.push({
        role: "user",
        content: wrapUp ?? "You have not submitted yet. Finish the research you need, then call submit_article.",
      });
      continue;
    }

    let accepted: Draft | null = null;
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const call of calls) {
      try {
        if (call.name === "search_images") {
          const query = text((call.input as { query?: unknown }).query);
          log(`  search_images: ${query}`);
          results.push({ type: "tool_result", tool_use_id: call.id, content: await imageResults(query, photos) });
        } else if (call.name === "submit_article") {
          const outcome = await review(call.input as Submission, photos, linkable);
          if ("draft" in outcome) {
            accepted = outcome.draft;
            log(`  submit_article: accepted "${outcome.draft.title}"`);
            results.push({ type: "tool_result", tool_use_id: call.id, content: "Accepted." });
          } else {
            log(`  submit_article: ${outcome.errors.length} problem(s)\n    - ${outcome.errors.join("\n    - ")}`);
            results.push({
              type: "tool_result",
              tool_use_id: call.id,
              is_error: true,
              content: `Not accepted. Fix these and submit again:\n- ${outcome.errors.join("\n- ")}`,
            });
          }
        } else {
          results.push({ type: "tool_result", tool_use_id: call.id, is_error: true, content: `Unknown tool ${call.name}.` });
        }
      } catch (error) {
        results.push({
          type: "tool_result",
          tool_use_id: call.id,
          is_error: true,
          content: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (accepted) return { draft: accepted, stats };
    messages.push({
      role: "user",
      content: wrapUp ? [...results, { type: "text", text: wrapUp }] : results,
    });
  }

  throw new Error(`No article was accepted after ${MAX_TURNS} turns.`);
}
