"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/app/lib/i18n/context";

type NextLinkProps = ComponentProps<typeof NextLink>;

/**
 * `next/link` with the active locale prefixed onto app-relative hrefs, so no
 * call site has to know what language it is rendering in and no navigation can
 * drop the reader back into English.
 *
 * Absolute URLs, `#anchors`, `mailto:` and `tel:` are passed through untouched,
 * as is anything already carrying a locale segment — see `localeHref`.
 *
 * This is a Client Component so that it works identically inside the client
 * trees (the nav, the search filters) and the server ones; `next/link` is a
 * client boundary either way, so it costs nothing extra.
 */
export function Link({ href, ...props }: NextLinkProps) {
  const { href: localize } = useI18n();
  return (
    <NextLink
      href={typeof href === "string" ? localize(href) : href}
      {...props}
    />
  );
}
