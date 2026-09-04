"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { menus, navLinks, type MegaMenu, type NavKey } from "@/app/lib/content";
import { localeNames } from "@/app/lib/i18n/config";
import { useI18n } from "@/app/lib/i18n/context";
import { LanguageSwitcher } from "./language-switcher";
import { Link } from "./link";
import { MegaMenuPanel } from "./mega-menu";
import { Chevron, Close, Menu } from "./icons";

/** Grace period so the panel survives the cursor crossing the gap below the bar. */
const CLOSE_DELAY_MS = 120;
/** Must match the panel's transition duration so it unmounts only once closed. */
const EXIT_MS = 450;

/** The language control is the last item in the bar and is not a content menu. */
const LANGUAGE = "__language" as const;
type PanelId = NavKey | typeof LANGUAGE;

export function SiteNav() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<PanelId | null>(null);
  const [expanded, setExpanded] = useState<PanelId | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // `active` is what should be open; `rendered` is what is still in the DOM —
  // they differ while the panel plays its exit transition. `visible` drives the
  // open/closed classes and is flipped a frame after mount so the enter animates.
  const [rendered, setRendered] = useState<PanelId | null>(null);
  const [visible, setVisible] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const openMenu = (id: PanelId) => {
    cancelClose();
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setRendered(id);
    setActive(id);
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

  const renderedMenu: MegaMenu | undefined =
    rendered && rendered !== LANGUAGE ? menus[rendered] : undefined;
  // Language switching is a short list — it gets a compact anchored dropdown
  // rather than the full-bleed panel the content menus use.
  const showPanel = Boolean(renderedMenu);
  // Keep the bar clear over the hero; glass only while a menu is open, so the
  // panel still has a surface to sit on.
  const showBg = open || visible;

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        showBg ? "bg-forest/85 backdrop-blur-xl" : "bg-transparent"
      }`}
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-8 px-6 py-3 sm:px-10 lg:px-[72px] lg:py-3.5">
        <Link href="/" className="shrink-0 cursor-pointer" aria-label="Multi Mulk">
          <Image
            src="/logos/multi-mulk-light.png"
            alt={t.common.logoAlt}
            width={400}
            height={113}
            priority
            className="h-10 w-auto lg:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => {
            const isOpen = active === link.key;
            return (
              <div
                key={link.key}
                className="relative"
                onMouseEnter={() =>
                  link.hasMenu ? openMenu(link.key) : scheduleClose()
                }
              >
                {link.hasMenu ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => (isOpen ? closeMenu() : openMenu(link.key))}
                    className={`flex cursor-pointer items-center gap-1.5 border-b-2 pb-1.5 text-[13.5px] transition-colors ${
                      isOpen
                        ? "border-cream text-white"
                        : "border-transparent text-white/95 hover:text-white"
                    }`}
                  >
                    {t.nav[link.key]}
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
                    {t.nav[link.key]}
                  </Link>
                )}
              </div>
            );
          })}

          {/* Language, anchored to its own trigger rather than the wide panel.
              The dark glass skin is intentional: it matches the nav bar and the
              mega-menus, not the cream form controls. See language-switcher. */}
          <div
            className="relative"
            onMouseEnter={() => openMenu(LANGUAGE)}
          >
            <button
              type="button"
              aria-expanded={active === LANGUAGE}
              aria-haspopup="true"
              aria-label={t.common.chooseLanguage}
              onClick={() =>
                active === LANGUAGE ? closeMenu() : openMenu(LANGUAGE)
              }
              className={`flex cursor-pointer items-center gap-1.5 border-b-2 pb-1.5 text-[13.5px] transition-colors ${
                active === LANGUAGE
                  ? "border-cream text-white"
                  : "border-transparent text-white/95 hover:text-white"
              }`}
            >
              {localeNames[locale].short}
              <Chevron
                className={`w-2 shrink-0 transition-transform duration-200 ${
                  active === LANGUAGE ? "rotate-180" : ""
                }`}
              />
            </button>

            {rendered === LANGUAGE ? (
              /* Square-cornered glass, centred under the trigger and no wider
                 than the codes need — the same surface as the nav bar it hangs
                 from.
                 The offset is `left-1/2`, not `start-1/2`, on purpose: the
                 pairing has to be physical. `start-1/2` resolves to `right:50%`
                 under RTL while `-translate-x-1/2` stays physical, which pushed
                 the panel a full width off in Arabic and Urdu. Centring is the
                 same in both directions, so there is nothing to mirror. */
              <div
                className={`absolute left-1/2 top-full z-10 mt-2 w-[92px] origin-top overflow-hidden bg-forest/85 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  visible
                    ? "-translate-x-1/2 translate-y-0 opacity-100"
                    : "pointer-events-none -translate-x-1/2 -translate-y-1 opacity-0"
                }`}
              >
                <LanguageSwitcher onSelect={closeMenu} />
              </div>
            ) : null}
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact-us"
            className="cursor-pointer rounded-full border border-white/80 px-5 py-2 text-[13px] text-white transition-colors hover:bg-white hover:text-ink"
          >
            {t.common.getInTouch}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t.common.closeMenu : t.common.openMenu}
          aria-expanded={open}
          className="cursor-pointer text-white xl:hidden"
        >
          {open ? <Close className="w-7" /> : <Menu className="w-7" />}
        </button>
      </div>

      {/* Desktop mega menu */}
      {showPanel && renderedMenu && rendered && rendered !== LANGUAGE ? (
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
            {navLinks.map((link) => {
              const menu = link.hasMenu ? menus[link.key] : undefined;
              const isExpanded = expanded === link.key;
              return (
                <div key={link.key} className="border-b border-cream/10">
                  {menu ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded(isExpanded ? null : link.key)
                        }
                        className="flex w-full cursor-pointer items-center justify-between py-3.5 text-start text-[15px] text-cream"
                      >
                        {t.nav[link.key]}
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
                          <ul className="flex flex-col gap-2.5 pb-4 ps-3">
                            {mobileItems(menu, t).map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href ?? "#"}
                                  onClick={() => setOpen(false)}
                                  className="block cursor-pointer text-[13px] text-cream/75"
                                >
                                  {item.label}
                                </Link>
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
                      {t.nav[link.key]}
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Language, as its own collapsible row at the foot of the list. */}
            <div className="border-b border-cream/10">
              <button
                type="button"
                aria-expanded={expanded === LANGUAGE}
                onClick={() =>
                  setExpanded(expanded === LANGUAGE ? null : LANGUAGE)
                }
                className="flex w-full cursor-pointer items-center justify-between py-3.5 text-start text-[15px] text-cream"
              >
                {`${t.common.chooseLanguage} · ${localeNames[locale].short}`}
                <Chevron
                  className={`w-2.5 transition-transform duration-200 ${
                    expanded === LANGUAGE ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  expanded === LANGUAGE ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden pb-3">
                  <LanguageSwitcher variant="full" onSelect={() => setOpen(false)} />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact-us"
                className="cursor-pointer rounded-full border border-cream/70 px-6 py-3 text-center text-[13px] text-cream"
              >
                {t.common.getInTouch}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** Flattens a menu to the label/href pairs the mobile list renders. Entries
 *  without an href are pages that are not built yet. */
function mobileItems(
  menu: MegaMenu,
  t: ReturnType<typeof useI18n>["t"],
): { label: string; href?: string }[] {
  switch (menu.kind) {
    case "feature":
      return menu.cards.map((card) => ({
        label: t.menus.about[card.key],
        href: card.href,
      }));
    case "portfolio":
      return menu.cards.map((card) => ({ label: card.title, href: card.href }));
    case "programmes":
      return menu.cards.map((card) => ({
        label:
          card.key === "turkiye" ? t.places["Türkiye"] : t.places.Caribbean,
        href: card.href,
      }));
  }
}
