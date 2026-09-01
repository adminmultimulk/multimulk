"use client";

import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/app/lib/citizenship";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * The sticky in-page rail. It sits directly under the hero and pins to the top
 * of the viewport, so a reader part-way down a long programme page can still
 * see where they are and jump between sections.
 *
 * The active section is read from the DOM rather than from the hash: anchors
 * set the hash on click but scrolling does not, and it is scrolling that this
 * has to follow. The last section whose top has crossed the line just under
 * the rail is the one being read, which keeps the right label lit at both ends
 * — on the closing call to action, past every section, the rail still reads
 * FAQ rather than falling back to the first.
 *
 * `scroll-mt` on each section (set in the page) clears the rail's own height,
 * so a jump does not land with the heading hidden behind it.
 */

/** Just below the rail — where a section counts as the one being read. */
const LINE_PX = 140;

export function CitizenshipAnchors() {
  const { t } = useI18n();
  const [active, setActive] = useState<SectionId>(sections[0]);

  useEffect(() => {
    const nodes = sections.map((id) => document.getElementById(id));
    if (!nodes.some(Boolean)) return;

    // Coalesced into a frame: five rects is cheap, but not once per scroll event.
    let frame = 0;
    const read = () => {
      frame = 0;
      let current: SectionId = sections[0];
      nodes.forEach((node, i) => {
        if (node && node.getBoundingClientRect().top <= LINE_PX) {
          current = sections[i];
        }
      });
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav
      aria-label={t.citizenship.onThisPage}
      className="sticky top-0 z-40 border-b border-cream/10 bg-forest-deep/95 backdrop-blur-xl"
    >
      {/* The rail scrolls sideways rather than wrapping: five labels in a long
          language would otherwise push the page content down by a whole row. */}
      <ul className="mx-auto flex w-full max-w-[1440px] gap-7 overflow-x-auto px-6 [scrollbar-width:none] sm:px-10 lg:justify-center lg:px-[72px] [&::-webkit-scrollbar]:hidden">
        {sections.map((id) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={`block whitespace-nowrap border-b-2 py-4 text-[12px] uppercase tracking-[0.1em] transition-colors ${
                active === id
                  ? "border-gold-light text-cream"
                  : "border-transparent text-cream/60 hover:text-cream"
              }`}
            >
              {t.citizenship.anchors[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
