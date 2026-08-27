"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { menus, nav, type MegaMenu } from "@/app/lib/content";
import { MegaMenuPanel } from "./mega-menu";
import { Chevron, Close, Menu } from "./icons";

/** Grace period so the panel survives the cursor crossing the gap below the bar. */
const CLOSE_DELAY_MS = 120;
/** Must match the panel's transition duration so it unmounts only once closed. */
const EXIT_MS = 450;
/** Past this, the glass background comes on so the bar stays readable. */
const SCROLL_BG_PX = 8;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // `active` is what should be open; `rendered` is what is still in the DOM —
  // they differ while the panel plays its exit transition. `visible` drives the
  // open/closed classes and is flipped a frame after mount so the enter animates.
  const [rendered, setRendered] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const openMenu = (label: string) => {
    cancelClose();
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setRendered(label);
    setActive(label);
    // Flip to the open state a frame later so the transition has a from-state.
    requestAnimationFrame(() => setVisible(true));
  };

  const closeMenu = () => {
    cancelClose();
    setActive(null);
    setVisible(false);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => setRendered(null), EXIT_MS);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(closeMenu, CLOSE_DELAY_MS);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_BG_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelClose();
        setActive(null);
        setVisible(false);
        if (exitTimer.current) clearTimeout(exitTimer.current);
        exitTimer.current = setTimeout(() => setRendered(null), EXIT_MS);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderedMenu: MegaMenu | undefined = rendered
    ? menus[rendered]
    : undefined;
  // Language switching is a short list — it gets a compact anchored dropdown
  // rather than the full-bleed panel the content menus use.
  const showPanel = renderedMenu && renderedMenu.kind !== "languages";
  // Keep the bar clear over the hero; glass only after scroll, or while a
  // menu is open so the panel still has a surface to sit on.
  const showBg = scrolled || open || visible;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        showBg ? "bg-forest/85 backdrop-blur-xl" : "bg-transparent"
      }`}
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-8 px-6 py-3 sm:px-10 lg:px-[72px] lg:py-3.5">
        <Link href="/" className="shrink-0 cursor-pointer" aria-label="Multi Mulk">
          <Image
            src="/logos/multi-mulk-light.png"
            alt="Multi Mulk — Global Solutions for Global Citizens"
            width={400}
            height={113}
            priority
            className="h-10 w-auto lg:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {nav.links.map((link) => {
            const isOpen = active === link.label;
            const menu = link.hasMenu ? menus[link.label] : undefined;
            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.hasMenu ? openMenu(link.label) : scheduleClose()
                }
              >
                {link.hasMenu ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => (isOpen ? closeMenu() : openMenu(link.label))}
                    className={`flex cursor-pointer items-center gap-1.5 border-b-2 pb-1.5 text-[13.5px] transition-colors ${
                      isOpen
                        ? "border-cream text-white"
                        : "border-transparent text-white/95 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <Chevron
                      className={`w-2 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href ?? "#"}
                    className="flex cursor-pointer items-center border-b-2 border-transparent pb-1.5 text-[13.5px] text-white/95 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                )}

                {rendered === link.label && menu?.kind === "languages" ? (
                  <div
                    className={`absolute right-0 top-full z-10 mt-3 min-w-[92px] origin-top rounded-md border border-white/10 bg-forest/90 py-2 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      visible
                        ? "translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none -translate-y-1 scale-95 opacity-0"
                    }`}
                  >
                    <MegaMenuPanel menu={menu} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {nav.actions.map((action) => (
            <Link
              key={action}
              href="/contact-us"
              className="cursor-pointer rounded-full border border-white/80 px-5 py-2 text-[13px] text-white transition-colors hover:bg-white hover:text-ink"
            >
              {action}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="cursor-pointer text-white xl:hidden"
        >
          {open ? <Close className="w-7" /> : <Menu className="w-7" />}
        </button>
      </div>

      {/* Desktop mega menu */}
      {showPanel && renderedMenu ? (
        <div
          onMouseEnter={cancelClose}
          className={`hidden transition-[grid-template-rows,opacity] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] xl:grid ${
            visible
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-white/10">
              {/* Keyed so switching menus replays the staggered entrance. */}
              <div
                key={rendered}
                className="mx-auto w-full max-w-[1440px] px-12 py-9"
              >
                <MegaMenuPanel menu={renderedMenu} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile menu */}
      {open ? (
        <div className="max-h-[calc(100svh-72px)] overflow-y-auto border-t border-white/15 xl:hidden">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-6 py-6 sm:px-10">
            {nav.links.map((link) => {
              const menu = link.hasMenu ? menus[link.label] : undefined;
              const isExpanded = expanded === link.label;
              return (
                <div key={link.label} className="border-b border-cream/10">
                  {menu ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded(isExpanded ? null : link.label)
                        }
                        className="flex w-full cursor-pointer items-center justify-between py-3.5 text-left text-[15px] text-cream"
                      >
                        {link.label}
                        <Chevron
                          className={`w-2.5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="flex flex-col gap-2.5 pb-4 pl-3">
                            {mobileItems(menu).map((item) => (
                              <li key={item}>
                                <a
                                  href="#"
                                  className="block cursor-pointer text-[13px] text-cream/75"
                                >
                                  {item}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href ?? "#"}
                      onClick={() => setOpen(false)}
                      className="block cursor-pointer py-3.5 text-[15px] text-cream"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              );
            })}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {nav.actions.map((action) => (
                <Link
                  key={action}
                  href="/contact-us"
                  className="cursor-pointer rounded-full border border-cream/70 px-6 py-3 text-center text-[13px] text-cream"
                >
                  {action}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function mobileItems(menu: MegaMenu): string[] {
  switch (menu.kind) {
    case "feature":
    case "portfolio":
      return menu.cards.map((c) => c.title);
    case "programmes":
      return menu.cards.map((c) => c.country);
    case "languages":
      return menu.items;
  }
}
