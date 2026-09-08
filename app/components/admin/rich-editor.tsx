"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { ArticleBody } from "@/app/components/article-body";
import {
  readingMinutes,
  toBlocks,
  wordCount,
} from "@/app/lib/rich-text";

/**
 * The body editor.
 *
 * A textarea, not a WYSIWYG surface. The body is stored as blocks of the
 * small Markdown-shaped grammar in `app/lib/rich-text.ts`, and a plain
 * textarea is the only editor that cannot desynchronise from it — every
 * contenteditable implementation of the same idea has a second model of the
 * document that has to be reconciled with the first, and that is where those
 * editors break. What makes this one comfortable to write in is everything
 * wrapped around the textarea: a toolbar that applies the grammar to the
 * selection, list continuation on Enter, the ordinary keyboard shortcuts, and
 * a preview rendered through the same components the published page uses.
 *
 * The value is submitted as a plain form field, so the surrounding form stays
 * a `<form action={…}>` with no client-side submit path.
 */
export function RichEditor({
  name,
  defaultValue,
  error,
  variant = "article",
  placeholder = "Write the piece.\n\nA blank line starts a new paragraph. Use the toolbar, or type ## for a heading and - for a bullet.",
}: {
  name: string;
  defaultValue: string;
  error?: string;
  /**
   * "article" is the full body editor. "prose" is the same grammar and the
   * same preview in a shorter box, without the tools that only make sense in
   * an article — a figure needs a path under `/public`, and a listing's
   * description is not where a comparison table belongs.
   */
  variant?: "article" | "prose";
  placeholder?: string;
}) {
  const full = variant === "article";
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const area = useRef<HTMLTextAreaElement>(null);

  const blocks = useMemo(() => toBlocks(value), [value]);
  const words = useMemo(() => wordCount(blocks), [blocks]);

  /**
   * Replaces the text and puts the caret back where the caller wants it.
   *
   * React re-renders before the browser paints, and setting `selectionStart`
   * on the old DOM value is overwritten by that render — so the caret is
   * restored after it, and the textarea is written to directly rather than
   * waiting a frame, which would blink the selection.
   */
  function apply(next: string, start: number, end = start) {
    setValue(next);
    const node = area.current;
    if (!node) return;
    node.value = next;
    node.focus();
    node.setSelectionRange(start, end);
  }

  /** Wraps the selection, or drops an empty pair with the caret inside it. */
  function surround(before: string, after = before, placeholder = "") {
    const node = area.current;
    if (!node) return;
    const { selectionStart: from, selectionEnd: to } = node;
    const selected = value.slice(from, to) || placeholder;
    apply(
      value.slice(0, from) + before + selected + after + value.slice(to),
      from + before.length,
      from + before.length + selected.length,
    );
  }

  /**
   * Prefixes every line the selection touches, and removes the prefix again if
   * they all already carry it — so the list button is a toggle, the way it is
   * in every editor a writer has used.
   */
  function prefixLines(prefix: string | ((index: number) => string)) {
    const node = area.current;
    if (!node) return;
    const from = value.lastIndexOf("\n", node.selectionStart - 1) + 1;
    const lineEnd = value.indexOf("\n", node.selectionEnd);
    const to = lineEnd === -1 ? value.length : lineEnd;

    const lines = value.slice(from, to).split("\n");
    const marks = lines.map((_, index) =>
      typeof prefix === "string" ? prefix : prefix(index),
    );
    const on = lines.every((line, index) => line.startsWith(marks[index]));

    const next = lines
      .map((line, index) =>
        on ? line.slice(marks[index].length) : marks[index] + line,
      )
      .join("\n");

    apply(value.slice(0, from) + next + value.slice(to), from, from + next.length);
  }

  /** Drops a whole block in below the caret, separated by blank lines. */
  function insertBlock(text: string, caretOffset = text.length) {
    const node = area.current;
    if (!node) return;
    const at = node.selectionEnd;
    const before = value.slice(0, at).replace(/\s+$/, "");
    const after = value.slice(at).replace(/^\s+/, "");
    const lead = before ? `${before}\n\n` : "";
    const next = lead + text + (after ? `\n\n${after}` : "\n");
    apply(next, lead.length + caretOffset);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const meta = event.metaKey || event.ctrlKey;

    if (meta && !event.shiftKey) {
      const key = event.key.toLowerCase();
      if (key === "b" || key === "i" || key === "k") {
        event.preventDefault();
        if (key === "b") surround("**", "**", "bold");
        else if (key === "i") surround("*", "*", "italic");
        else link();
        return;
      }
    }

    // Enter inside a list continues it, and Enter on an empty item ends it —
    // otherwise every bullet after the first has to be typed by hand.
    if (event.key === "Enter" && !event.shiftKey && !meta) {
      const node = event.currentTarget;
      const from = value.lastIndexOf("\n", node.selectionStart - 1) + 1;
      const line = value.slice(from, node.selectionStart);
      const item = /^(\s*)([-*]|(\d+)[.)])\s+(.*)$/.exec(line);
      if (!item) return;

      event.preventDefault();
      const [, indent, marker, number, content] = item;
      if (!content.trim()) {
        // An empty bullet means "I am done with this list".
        return apply(
          value.slice(0, from) + value.slice(node.selectionEnd),
          from,
        );
      }
      const next = number
        ? `${indent}${Number(number) + 1}. `
        : `${indent}${marker} `;
      apply(
        value.slice(0, node.selectionStart) +
          "\n" +
          next +
          value.slice(node.selectionEnd),
        node.selectionStart + 1 + next.length,
      );
    }
  }

  function link() {
    const node = area.current;
    if (!node) return;
    const selected = value.slice(node.selectionStart, node.selectionEnd);
    const href = window.prompt("Link to (a full https:// URL, or a path like /en/golden-visa)");
    if (!href) return;
    const label = selected || "link text";
    const from = node.selectionStart;
    apply(
      value.slice(0, from) +
        `[${label}](${href})` +
        value.slice(node.selectionEnd),
      from + 1,
      from + 1 + label.length,
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-md border bg-white ${
        error ? "border-red-400" : "border-ink/15"
      }`}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 bg-ink/[0.02] px-2 py-1.5">
        <Tool label="Heading" shortcut="## " onClick={() => prefixLines("## ")}>
          <span className="text-[11px] font-semibold">H2</span>
        </Tool>
        <Tool label="Subheading" shortcut="### " onClick={() => prefixLines("### ")}>
          <span className="text-[11px] font-semibold">H3</span>
        </Tool>

        <Divider />

        <Tool label="Bold" shortcut="⌘B" onClick={() => surround("**", "**", "bold")}>
          <span className="text-[12px] font-bold">B</span>
        </Tool>
        <Tool label="Italic" shortcut="⌘I" onClick={() => surround("*", "*", "italic")}>
          <span className="font-serif text-[12px] italic">I</span>
        </Tool>
        <Tool label="Link" shortcut="⌘K" onClick={link}>
          <Icon d="M9 13a4 4 0 0 0 5.7.4l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.5 1.5M11 7a4 4 0 0 0-5.7-.4L2.7 9.2a4 4 0 0 0 5.7 5.7L9.9 13" />
        </Tool>
        <Tool label="Code" onClick={() => surround("`", "`", "code")}>
          <Icon d="M7 6 3 10l4 4M13 6l4 4-4 4" />
        </Tool>

        <Divider />

        <Tool label="Bulleted list" onClick={() => prefixLines("- ")}>
          <Icon d="M7 5h10M7 10h10M7 15h10M3 5h.01M3 10h.01M3 15h.01" />
        </Tool>
        <Tool
          label="Numbered list"
          onClick={() => prefixLines((index) => `${index + 1}. `)}
        >
          <Icon d="M8 5h9M8 10h9M8 15h9M3 4h1v3M3 15h2v-2H3v-2h2" />
        </Tool>
        <Tool label="Quote" onClick={() => prefixLines("> ")}>
          <Icon d="M4 15V9a4 4 0 0 1 4-4M11 15V9a4 4 0 0 1 4-4" />
        </Tool>

        {full ? (
          <>
            <Divider />

            <Tool
              label="Image"
              // Caret lands after `/images/`, which is where the filename goes.
              onClick={() => insertBlock("![Describe the photograph](/images/)", 35)}
            >
              <Icon d="M3 4h14v12H3zM3 13l4-4 4 4 3-3 3 3" />
            </Tool>
            <Tool
              label="Table"
              onClick={() =>
                insertBlock(
                  "| Programme | Minimum | Timeline |\n| --- | --- | --- |\n|  |  |  |",
                  2,
                )
              }
            >
              <Icon d="M3 4h14v12H3zM3 8h14M3 12h14M8.5 4v12M13 4v12" />
            </Tool>
            <Tool
              label="Key point"
              onClick={() => insertBlock(":::key\n\n:::", 7)}
            >
              <Icon d="M10 3v10M6 9l4 4 4-4M4 17h12" />
            </Tool>
            <Tool label="Section break" onClick={() => insertBlock("---")}>
              <Icon d="M3 10h14" />
            </Tool>
          </>
        ) : null}

        <div className="ms-auto flex rounded-[5px] bg-ink/6 p-0.5">
          {(["write", "preview"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              className={`rounded-[3px] px-2.5 py-1 text-[11.5px] font-medium capitalize transition-colors ${
                tab === key ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* The textarea stays mounted while previewing — unmounting it would drop
          the caret, the undo stack and, on a form error, the field itself. */}
      <div className={tab === "write" ? "" : "hidden"}>
        <textarea
          ref={area}
          id={name}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`block w-full resize-y bg-white px-4 py-4 text-[14.5px] leading-[25px] text-ink outline-none placeholder:text-ink/30 ${
            full ? "min-h-[520px]" : "min-h-[180px]"
          }`}
          placeholder={placeholder}
        />
      </div>

      {tab === "preview" ? (
        <div className="bg-white px-4 py-6">
          {blocks.length ? (
            <div className="mx-auto max-w-[640px]">
              <ArticleBody body={blocks} />
            </div>
          ) : (
            <p className="py-10 text-center text-[13px] text-ink/45">
              Nothing to preview yet.
            </p>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/10 bg-ink/[0.02] px-3 py-1.5 text-[11.5px] text-ink/55">
        <span className="tabular-nums">
          {words.toLocaleString("en")} {words === 1 ? "word" : "words"}
        </span>
        {full ? (
          <>
            <span className="tabular-nums">
              {readingMinutes(blocks)} min read
            </span>
            <span className="tabular-nums">
              {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
            </span>
          </>
        ) : null}
        <span className="ms-auto hidden sm:block">
          ⌘B bold · ⌘I italic · ⌘K link
        </span>
      </div>
    </div>
  );
}

function Tool({
  label,
  shortcut,
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-[5px] text-ink/70 transition-colors hover:bg-ink/8 hover:text-ink"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-ink/12" />;
}

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[15px]"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}
