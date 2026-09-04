"use client";

import {
  useActionState,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import { saveArticle } from "@/app/lib/admin/article-actions";
import { slugify } from "@/app/lib/admin/slug";
import { fromBlocks } from "@/app/lib/rich-text";
import { topics as allTopics } from "@/app/lib/topics";
import { Alert, Button, Field, Input, Select, Textarea } from "./ui";
import { RichEditor } from "./rich-editor";

export type ArticleDraft = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  topics: string[];
  category: string;
  source: string;
  image: string;
  hero: string;
  readMore: string;
  /** `YYYY-MM-DDTHH:mm`, in UTC. Empty means "the moment it goes live". */
  date: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  noindex: boolean;
  status: "DRAFT" | "PUBLISHED";
};

export const emptyArticle: ArticleDraft = {
  slug: "",
  title: "",
  excerpt: "",
  body: [],
  topics: [],
  category: "Blog",
  source: "",
  image: "",
  hero: "",
  readMore: "",
  date: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  noindex: false,
  status: "DRAFT",
};

const topicLabels: Record<string, string> = {
  citizenship: "Citizenship",
  residency: "Residency",
  "real-estate": "Real estate",
  turkiye: "Türkiye",
  news: "News",
};

/** What Google truncates at, near enough to be worth showing a writer. */
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 158;

export function ArticleForm({
  article,
  origin,
}: {
  article: ArticleDraft;
  /** The production host, for the URL and search previews. */
  origin: string;
}) {
  const [state, action, pending] = useActionState(saveArticle, {});
  const errors = state.fieldErrors ?? {};

  const [title, setTitle] = useState(article.title);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [seoTitle, setSeoTitle] = useState(article.seoTitle);
  const [seoDescription, setSeoDescription] = useState(article.seoDescription);
  const [image, setImage] = useState(article.image);
  const [hero, setHero] = useState(article.hero);
  const [date, setDate] = useState(article.date);
  const [category, setCategory] = useState(article.category);

  // The slug follows the headline until somebody edits it, and then stops —
  // a published URL must not move because a typo was fixed in the title.
  const [slug, setSlug] = useState(article.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(article.slug));

  const dirty = useUnsavedGuard(pending);

  const shownTitle = seoTitle || title || "Untitled";
  const shownDescription = seoDescription || excerpt;

  return (
    <form
      action={action}
      onInput={dirty}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      {article.id ? <input type="hidden" name="id" value={article.id} /> : null}

      <div className="grid min-w-0 gap-6">
        {state.error ? <Alert>{state.error}</Alert> : null}

        <Card>
          <Field label="Headline" name="title" error={errors.title} required>
            <Input
              id="title"
              name="title"
              value={title}
              error={errors.title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              required
            />
          </Field>

          <Field
            label="URL slug"
            name="slug"
            error={errors.slug}
            hint={
              <>
                {origin}/en/knowledge/<b className="font-medium text-ink/75">{slug || "…"}</b>
                {article.status === "PUBLISHED"
                  ? " — changing this on a live piece breaks every link to it."
                  : null}
              </>
            }
            required
          >
            <Input
              id="slug"
              name="slug"
              value={slug}
              error={errors.slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              required
            />
          </Field>

          <Field
            label="Standfirst"
            name="excerpt"
            error={errors.excerpt}
            hint="One paragraph. It is the card copy on the index, and — unless the SEO panel overrides it — the description search engines show."
            required
          >
            <Textarea
              id="excerpt"
              name="excerpt"
              value={excerpt}
              error={errors.excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={3}
              required
            />
            <Counter value={excerpt} limit={DESCRIPTION_LIMIT} />
          </Field>
        </Card>

        <div className="grid gap-1.5">
          <label htmlFor="body" className="text-[13px] font-medium text-ink">
            Body <span className="text-red-600">*</span>
          </label>
          <RichEditor
            name="body"
            defaultValue={fromBlocks(article.body)}
            error={errors.body}
          />
          {errors.body ? (
            <p id="body-error" className="text-[12px] text-red-700">
              {errors.body}
            </p>
          ) : null}
          <Syntax />
        </div>

        <Card
          title="Search appearance"
          hint="Both fields fall back to the headline and standfirst above. Fill them in when the piece needs to read differently in a results list than it does on the page."
        >
          <div className="rounded-md border border-ink/10 bg-ink/[0.02] p-4">
            <p className="text-[12px] text-ink/50">
              {origin}/en/knowledge/{slug || "…"}
            </p>
            <p className="mt-0.5 truncate text-[16px] leading-[22px] text-[#1a0dab]">
              {shownTitle}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-[18px] text-ink/70">
              {shownDescription || "No description yet."}
            </p>
          </div>

          <Field
            label="Title tag"
            name="seoTitle"
            error={errors.seoTitle}
            hint="Leave empty to use the headline."
          >
            <Input
              id="seoTitle"
              name="seoTitle"
              value={seoTitle}
              error={errors.seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
              placeholder={title || "The headline"}
            />
            <Counter value={shownTitle} limit={TITLE_LIMIT} />
          </Field>

          <Field
            label="Meta description"
            name="seoDescription"
            error={errors.seoDescription}
            hint="Leave empty to use the standfirst."
          >
            <Textarea
              id="seoDescription"
              name="seoDescription"
              value={seoDescription}
              error={errors.seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              rows={2}
              placeholder={excerpt || "The standfirst"}
            />
            <Counter value={shownDescription} limit={DESCRIPTION_LIMIT} />
          </Field>

          <Field
            label="Canonical URL"
            name="canonicalUrl"
            error={errors.canonicalUrl}
            hint="Only for a piece that first ran somewhere else. It tells search engines the original is the one to rank."
          >
            <Input
              id="canonicalUrl"
              name="canonicalUrl"
              defaultValue={article.canonicalUrl}
              error={errors.canonicalUrl}
              placeholder="https://…"
            />
          </Field>

          <Check
            name="noindex"
            defaultChecked={article.noindex}
            label="Keep out of search results"
            hint="The page stays readable at its URL. For something linked from a campaign rather than found."
          />
        </Card>
      </div>

      <aside className="grid gap-4 lg:sticky lg:top-6">
        <Card>
          <div className="grid gap-3">
            <Schedule
              date={date}
              onChange={setDate}
              error={errors.date}
              published={article.status === "PUBLISHED"}
            />

            <div className="grid gap-2 border-t border-ink/10 pt-3">
              <Button type="submit" name="intent" value="publish" disabled={pending}>
                {article.status === "PUBLISHED"
                  ? "Save and keep live"
                  : isFuture(date)
                    ? "Schedule"
                    : "Publish"}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="draft"
                variant="secondary"
                disabled={pending}
              >
                {article.status === "PUBLISHED"
                  ? "Save and take offline"
                  : "Save as draft"}
              </Button>
              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/admin/articles"
                  className="text-[12px] text-ink/55 underline underline-offset-2 hover:text-ink"
                >
                  Cancel
                </Link>
                {article.status === "PUBLISHED" ? (
                  <Link
                    href={`/en/knowledge/${slug}`}
                    target="_blank"
                    className="text-[12px] text-ink/55 underline underline-offset-2 hover:text-ink"
                  >
                    View live
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Topics">
          <fieldset>
            <legend className="sr-only">Topics</legend>
            <div className="grid gap-2">
              {allTopics.map((topic) => (
                <label
                  key={topic}
                  className="flex items-center gap-2 text-[13px] text-ink/80"
                >
                  <input
                    type="checkbox"
                    name="topics"
                    value={topic}
                    defaultChecked={article.topics.includes(topic)}
                    className="size-4 accent-[#12402a]"
                  />
                  {topicLabels[topic] ?? topic}
                </label>
              ))}
            </div>
            {errors.topics ? (
              <p className="mt-2 text-[12px] text-red-700">{errors.topics}</p>
            ) : (
              <p className="mt-2 text-[12px] leading-[17px] text-ink/55">
                What the Knowledge Centre filters on, and how the related rail
                finds neighbours.
              </p>
            )}
          </fieldset>
        </Card>

        <Card title="Images">
          <Field
            label="Card"
            name="image"
            error={errors.image}
            hint="Roughly 3:2. A path under /public."
          >
            <Input
              id="image"
              name="image"
              value={image}
              error={errors.image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="/images/…"
            />
            <Thumb src={image} ratio="3/2" />
          </Field>

          <Field
            label="Banner"
            name="hero"
            error={errors.hero}
            hint="Roughly 8:3, for the top of the article. Falls back to the card image."
          >
            <Input
              id="hero"
              name="hero"
              value={hero}
              error={errors.hero}
              onChange={(event) => setHero(event.target.value)}
              placeholder="/images/…"
            />
            <Thumb src={hero} ratio="8/3" />
          </Field>
        </Card>

        <Card title="Filing">
          <Field label="Kind" name="category">
            <Select
              id="category"
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="Blog">Blog — our own writing</option>
              <option value="Press Media">Press — coverage elsewhere</option>
            </Select>
          </Field>

          {category === "Press Media" ? (
            <Field
              label="Publication"
              name="source"
              hint="The outlet the piece ran in."
            >
              <Input id="source" name="source" defaultValue={article.source} />
            </Field>
          ) : (
            <input type="hidden" name="source" value="" />
          )}

          <Field
            label="“Read more” link"
            name="readMore"
            error={errors.readMore}
            hint="The original coverage, or a related page. The button is hidden without it."
          >
            <Input
              id="readMore"
              name="readMore"
              defaultValue={article.readMore}
              error={errors.readMore}
              placeholder="https://…"
            />
          </Field>
        </Card>
      </aside>
    </form>
  );
}

// --- Pieces ------------------------------------------------------------------

/**
 * The whole grammar, folded away.
 *
 * The toolbar covers all of it and most people will never open this. It is
 * here for the writer who would rather type than reach for the mouse, and
 * because a format nobody can look up is a format people avoid using.
 */
function Syntax() {
  const rows: [string, string][] = [
    ["## Heading", "A section heading. ### for a subheading."],
    ["**bold**  *italic*", "Emphasis. ⌘B and ⌘I do the same."],
    ["[text](/en/golden-visa)", "A link. ⌘K wraps the selection in one."],
    ["- item", "A bulleted list, one item per line. Enter continues it."],
    ["1. item", "A numbered list."],
    ["> Quoted line", "A pull quote. A last line of “> — Name” credits it."],
    ["![Alt](/images/x.jpg)", "A photograph. Paths under /public only."],
    ["| a | b |", "A table, one row per line."],
    [":::key", "A highlighted box: key, note, tip or warning."],
    ["---", "A break between sections."],
  ];

  return (
    <details className="rounded-md border border-ink/10 bg-white px-4 py-2.5">
      <summary className="cursor-pointer text-[12.5px] text-ink/60 select-none hover:text-ink">
        Formatting
      </summary>
      <dl className="mt-3 grid gap-y-1.5 text-[12px] sm:grid-cols-[190px_1fr]">
        {rows.map(([mark, meaning]) => (
          <div key={mark} className="contents">
            <dt className="font-mono text-[11.5px] text-ink/80">{mark}</dt>
            <dd className="mb-2 text-ink/55 sm:mb-0">{meaning}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[12px] leading-[18px] text-ink/50">
        A blank line starts a new block. Everything else is a paragraph.
      </p>
    </details>
  );
}

function Card({
  title,
  hint,
  children,
}: {
  title?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
      {title ? (
        <div>
          <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
          {hint ? (
            <p className="mt-1 text-[12px] leading-[18px] text-ink/55">{hint}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** How much room is left before search engines start truncating. */
function Counter({ value, limit }: { value: string; limit: number }) {
  const over = value.length > limit;
  return (
    <p
      className={`text-end text-[11px] tabular-nums ${
        over ? "text-amber-700" : "text-ink/40"
      }`}
    >
      {value.length}/{limit}
      {over ? " — will be cut short" : ""}
    </p>
  );
}

function Check({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex gap-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 accent-[#12402a]"
      />
      <span>
        <span className="block text-[13px] text-ink">{label}</span>
        <span className="block text-[12px] leading-[17px] text-ink/55">
          {hint}
        </span>
      </span>
    </label>
  );
}

function isFuture(date: string): boolean {
  return Boolean(date) && Date.parse(`${date}:00Z`) > Date.now();
}

/**
 * False while rendering on the server and on the first client pass, true
 * afterwards — the hook for anything that depends on the reader's own machine,
 * here their clock. `useSyncExternalStore` rather than a flag set in an effect
 * because it is the one form of this React can hydrate without a mismatch.
 */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * When the piece is filed.
 *
 * Stored and edited in UTC, because the alternative — a local time that the
 * server has to reconstruct from a timezone the form does not know — is how
 * scheduling quietly publishes things three hours early. The line underneath
 * shows the same instant in the editor's own clock, and is rendered after
 * mount so the server and the browser are never asked to agree on it.
 */
function Schedule({
  date,
  onChange,
  error,
  published,
}: {
  date: string;
  onChange: (value: string) => void;
  error?: string;
  published: boolean;
}) {
  const at = date ? new Date(`${date}:00Z`) : null;
  const local =
    useMounted() && at && !Number.isNaN(at.getTime())
      ? at.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
      : null;

  const scheduled = isFuture(date);

  return (
    <Field
      label="Publication date"
      name="date"
      error={error}
      hint={
        local
          ? `${local} where you are. Leave empty to file it under the moment it goes live.`
          : "UTC. Leave empty to file it under the moment it goes live — or set a future time to schedule it."
      }
    >
      <Input
        id="date"
        name="date"
        type="datetime-local"
        value={date}
        error={error}
        onChange={(event) => onChange(event.target.value)}
      />
      {scheduled ? (
        <p className="rounded-[4px] bg-amber-50 px-2 py-1 text-[11.5px] text-amber-800">
          {published
            ? "Scheduled — it will appear on the site within a few minutes of this time."
            : "Publishing this will schedule it rather than put it live now."}
        </p>
      ) : null}
    </Field>
  );
}

/** Shows whether the path in the field actually resolves to a photograph. */
function Thumb({ src, ratio }: { src: string; ratio: string }) {
  if (!src.startsWith("/")) return null;
  return (
    <span
      className="block overflow-hidden rounded-[4px] border border-ink/10 bg-ink/5"
      style={{ aspectRatio: ratio }}
    >
      {/* Deliberately not `next/image`: this is an unvalidated path being
          typed, and the optimiser answers a bad one with a 400 in the console
          rather than the broken-image icon that tells the editor what is
          wrong. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-full object-cover" />
    </span>
  );
}

/**
 * Warns before a half-written article is thrown away by a closed tab.
 *
 * Armed by the first keystroke and disarmed while the action is running, so
 * the redirect that follows a successful save does not trip it.
 */
function useUnsavedGuard(pending: boolean): () => void {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched || pending) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [touched, pending]);

  return () => setTouched(true);
}
