import Image from "next/image";
import {
  parseBlocks,
  parseInline,
  type Block,
  type CalloutTone,
  type Inline,
} from "@/app/lib/rich-text";

type CalloutBlock = Extract<Block, { kind: "callout" }>;

/**
 * An article's prose.
 *
 * The body arrives as a list of blocks — one per paragraph, heading, list,
 * quote, figure, callout or table — written in the small Markdown-shaped
 * grammar `app/lib/rich-text.ts` defines. Parsing lives there; this file is
 * only the typography, so the dashboard's preview renders through exactly
 * these components and cannot show a writer something the page will not.
 *
 * Nothing here interpolates HTML. Every element below is constructed from a
 * parsed node, which is what makes it safe to let an editor write links and
 * emphasis into a database column.
 *
 * The migrated pieces' comparison tables stay a separate prop: those grids are
 * where most of the value in those articles sits, and they were extracted
 * before the body grammar could hold a table.
 */
export function ArticleBody({
  body,
  tables,
}: {
  body: readonly string[];
  tables?: readonly string[][][];
}) {
  const blocks = parseBlocks(body);

  return (
    <>
      <div className="mt-[7.2px] flex flex-col gap-[21.6px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink">
        {blocks.map((block, index) => (
          <BlockView key={index} block={block} />
        ))}
      </div>

      {tables?.length
        ? tables.map((table, index) => (
            <ComparisonTable key={index} rows={table} />
          ))
        : null}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "heading":
      return block.level === 2 ? (
        <h2
          id={block.id}
          className="mt-[14.4px] scroll-mt-24 font-display text-[22px] leading-[1.3] text-ink sm:text-[26px]"
        >
          <Rich nodes={block.content} />
        </h2>
      ) : (
        <h3
          id={block.id}
          className="mt-[7.2px] scroll-mt-24 font-display text-[17px] leading-[1.35] text-ink sm:text-[19px]"
        >
          <Rich nodes={block.content} />
        </h3>
      );

    case "paragraph":
      return (
        <p>
          <Rich nodes={block.content} />
        </p>
      );

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={`flex flex-col gap-[10.8px] ps-[21.6px] ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-ink/40`}
        >
          {block.items.map((item, index) => (
            <li key={index} className="ps-1">
              <Rich nodes={item} />
            </li>
          ))}
        </List>
      );
    }

    case "quote":
      return (
        <blockquote className="border-s-2 border-forest/40 ps-[21.6px]">
          <p className="font-display text-[18px] leading-[1.5] text-ink sm:text-[20px]">
            <Rich nodes={block.content} />
          </p>
          {block.cite ? (
            <cite className="mt-2 block text-[12.5px] not-italic text-ink/55">
              {block.cite}
            </cite>
          ) : null}
        </blockquote>
      );

    case "figure":
      return (
        <figure className="my-[7.2px]">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 843px"
              className="object-cover"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-[10.8px] text-[12.5px] leading-[18px] text-ink/55">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "callout":
      return <Callout block={block} />;

    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-[13.5px] leading-[20px]">
            <thead>
              <tr className="border-b border-ink/20">
                {block.head.map((cell, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="py-3 pe-4 text-start text-[11px] font-normal tracking-[0.08em] text-ink/60 uppercase"
                  >
                    <Rich nodes={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-ink/10 align-top">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`py-3 pe-4 ${cellIndex === 0 ? "text-ink" : "text-ink/80"}`}
                    >
                      <Rich nodes={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "divider":
      return <hr className="my-[14.4px] border-0 border-t border-ink/12" />;
  }
}

/**
 * A callout.
 *
 * Four tones rather than a free-form colour, because the point of the box is
 * that a reader learns what each one means across articles. `key` is the one
 * that earns its place on this site: the pieces are about money and
 * eligibility, and the sentence a reader must not skim needs somewhere to sit.
 */
const tones: Record<
  CalloutTone,
  { frame: string; label: string; heading: string }
> = {
  key: { frame: "border-forest/25 bg-forest/[0.04]", label: "text-forest", heading: "Key point" },
  note: { frame: "border-ink/15 bg-ink/[0.03]", label: "text-ink/55", heading: "Note" },
  tip: { frame: "border-emerald-600/25 bg-emerald-50/60", label: "text-emerald-800", heading: "Tip" },
  warning: { frame: "border-amber-600/30 bg-amber-50/70", label: "text-amber-800", heading: "Important" },
};

function Callout({ block }: { block: CalloutBlock }) {
  const tone = tones[block.tone];
  return (
    <aside className={`border-s-2 px-[21.6px] py-[18px] ${tone.frame}`}>
      <p
        className={`mb-2 text-[10.5px] font-medium tracking-[0.1em] uppercase ${tone.label}`}
      >
        {block.title ?? tone.heading}
      </p>
      <div className="flex flex-col gap-[10.8px]">
        {block.paragraphs.map((paragraph, index) => (
          <p key={index}>
            <Rich nodes={paragraph} />
          </p>
        ))}
      </div>
    </aside>
  );
}

/**
 * A single line of prose written in the body grammar.
 *
 * The one-line half of the same feature: a listing's highlight or its payment
 * plan is a sentence in a text box, not a body, and a lister who can bold a
 * word in the description expects to be able to bold one here. Rendered
 * through exactly the components above, so emphasis looks the same wherever it
 * is written and nothing here can produce markup the parser did not build.
 */
export function RichLine({ text }: { text: string }) {
  return <Rich nodes={parseInline(text)} />;
}

/** Inline emphasis and links. */
function Rich({ nodes }: { nodes: readonly Inline[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        switch (node.kind) {
          case "text":
            return node.text;
          case "strong":
            return (
              <strong key={index} className="font-semibold">
                <Rich nodes={node.children} />
              </strong>
            );
          case "em":
            return (
              <em key={index}>
                <Rich nodes={node.children} />
              </em>
            );
          case "code":
            return (
              <code
                key={index}
                className="rounded-[2px] bg-ink/6 px-1 py-0.5 font-mono text-[0.9em]"
              >
                {node.text}
              </code>
            );
          case "link": {
            const external = /^https?:/i.test(node.href);
            return (
              <a
                key={index}
                href={node.href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="underline decoration-ink/30 underline-offset-2 transition-colors hover:decoration-ink"
              >
                <Rich nodes={node.children} />
              </a>
            );
          }
        }
      })}
    </>
  );
}

/**
 * A migrated comparison grid.
 *
 * Wrapped in its own scroll container: these run to three and four columns of
 * prose, and on a phone the alternative is the whole page scrolling sideways.
 */
function ComparisonTable({ rows }: { rows: readonly string[][] }) {
  if (rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div className="mt-[28.8px] overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-[13.5px] leading-[20px]">
        <thead>
          <tr className="border-b border-ink/20 text-start">
            {header.map((cell, index) => (
              <th
                key={index}
                scope="col"
                className="py-3 pe-4 text-start text-[11px] font-normal tracking-[0.08em] text-ink/60 uppercase"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-ink/10 align-top">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`py-3 pe-4 ${cellIndex === 0 ? "text-ink" : "text-ink/80"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
