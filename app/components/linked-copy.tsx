import { Fragment } from "react";
import { Link } from "./link";

/**
 * A sentence of dictionary copy with links in it.
 *
 * The copy marks a link as `[anchor text](key)` and the page supplies what
 * each key points at, so a translator moves the anchor to wherever it falls in
 * their sentence without touching a URL, and the paths stay in the route table
 * where a renamed slug is a compile error. A key the page does not supply
 * renders as plain text rather than as a broken link.
 */
export function LinkedCopy({
  text,
  links,
  className = "underline decoration-current/35 underline-offset-[3px] transition-colors hover:decoration-current",
}: {
  text: string;
  links: Readonly<Record<string, string>>;
  className?: string;
}) {
  const parts = text.split(/\[([^\]]+)\]\((\w+)\)/);
  // `split` with two capture groups yields text, anchor, key, text, …
  return (
    <>
      {parts.map((part, index) => {
        const slot = index % 3;
        if (slot === 0) return <Fragment key={index}>{part}</Fragment>;
        if (slot === 2) return null;
        const href = links[parts[index + 1]];
        return href ? (
          <Link key={index} href={href} className={className}>
            {part}
          </Link>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        );
      })}
    </>
  );
}

/** The same copy with the link markup removed — for metadata and JSON-LD. */
export function unlinkedCopy(text: string): string {
  return text.replace(/\[([^\]]+)\]\(\w+\)/g, "$1");
}
