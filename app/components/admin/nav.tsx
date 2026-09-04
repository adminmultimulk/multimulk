"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

export type NavItem = { href: string; label: string; hint: string };

/**
 * The sidebar.
 *
 * A client component for one reason — marking the current section — and the
 * items themselves are decided on the server, by role, so a link to a page the
 * person cannot open never reaches the browser.
 */
export function AdminNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="grid gap-0.5">
      {items.map((item) => {
        // `/admin` would otherwise match every page beneath it.
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "rounded-md px-3 py-2 text-[13px] transition-colors",
              active
                ? "bg-forest text-white"
                : "text-ink/70 hover:bg-ink/5 hover:text-ink",
            )}
          >
            <span className="block font-medium">{item.label}</span>
            <span
              className={clsx(
                "block text-[11px] leading-[16px]",
                active ? "text-white/70" : "text-ink/45",
              )}
            >
              {item.hint}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
