"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { EnquireButton } from "../enquire-button";
import type { EnquiryContext } from "../enquiry";
import { useI18n } from "@/app/lib/i18n/context";

export type CaseSlide = {
  image: string;
  heading: string;
  body: string;
};

/** How long a frame holds before the next one, when nobody is reading it. */
const HOLD_MS = 8000;

/**
 * Full-bleed frames, one point of the reasoning on each: the photograph
 * behind, the heading and the paragraph centred over it, and the enquiry
 * button beneath — the way a development page walks a buyer through its
 * views. A segmented line along the bottom is the position and the control:
 * one segment a frame, the current one lit.
 *
 * The frames advance on their own and stop while the pointer is over them,
 * because a paragraph is read rather than glanced at. The photograph
 * crossfades and the copy lifts in; under reduced motion both simply swap.
 */
export function CaseSlides({
  slides,
  enquiry,
  name,
}: {
  slides: CaseSlide[];
  enquiry: EnquiryContext;
  /** The engagement, for the photographs' alt text. */
  name: string;
}) {
  const { t, fill, num } = useI18n();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held || slides.length < 2) return;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      HOLD_MS,
    );
    return () => clearTimeout(timer);
  }, [index, held, slides.length]);

  if (!slides.length) return null;
  const slide = slides[index];

  return (
    <section
      className="relative flex min-h-[640px] items-center overflow-hidden bg-forest lg:min-h-[82svh]"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.image}
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Image
            src={slide.image}
            alt={`${name} — ${slide.heading}`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      {/* Shade for the type: a wash over the whole frame and a heavier one
          low down, where the paragraph and the button sit. The İstanbul
          strait and the resort aerials are daylight frames. */}
      <div className="absolute inset-0 bg-forest-deep/55" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-forest-deep/75 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 pb-24 pt-20 text-center sm:px-10 lg:px-[72px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="flex max-w-[820px] flex-col items-center"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-cream/75">
              {fill(t.resort.slide, {
                index: num(index + 1),
                count: num(slides.length),
              })}
            </p>
            <h2 className="mt-5 font-display text-[36px] leading-[1.1] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)] sm:text-[52px] lg:text-[64px]">
              {slide.heading}
            </h2>
            <p
              dir="auto"
              className="mt-7 max-w-[720px] text-[14.5px] leading-[24px] text-cream [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] sm:text-[15.5px] sm:leading-[26px]"
            >
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>

        <EnquireButton
          context={enquiry}
          className="mt-10 rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
        />
      </div>

      {/* The position line: a segment a frame, each a control. */}
      {slides.length > 1 ? (
        <ol className="absolute inset-x-6 bottom-8 flex gap-3 sm:inset-x-10 lg:inset-x-[72px]">
          {slides.map((s, i) => (
            <li key={s.image} className="flex-1">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={s.heading}
                aria-current={i === index}
                className="block w-full py-3"
              >
                <span
                  className={`block h-px w-full transition-colors duration-500 ${
                    i === index ? "bg-white" : "bg-white/30 hover:bg-white/60"
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
