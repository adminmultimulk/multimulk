"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Close } from "@/app/components/icons";
import { cn } from "@/lib/utils";

/**
 * A poster that opens its video in a modal.
 *
 * Two things it is buying beyond the presentation. The player is not loaded
 * until somebody asks for it, so the megabyte of YouTube JavaScript and its
 * requests to three Google domains are paid for by the people who press play
 * rather than by everyone who scrolls past — which matters on the Gulf and
 * Pakistani mobile connections much of this site's traffic arrives on, and it
 * keeps the player out of the largest-contentful-paint measurement Google
 * reads as a ranking signal. And a reader who never presses play is never seen
 * by Google at all, which is the thing cookie banners exist to ask about.
 *
 * Adapted from the 21st.dev component of the same name. Four things changed,
 * each because the original is a demo and this is a page people will use:
 *
 *  - `motion/react`, not `framer-motion`. They are the same library under two
 *    names; this repo already has the newer one, and installing the other
 *    would ship a second animation runtime to every visitor.
 *  - Escape closes it, the background stops scrolling while it is open, focus
 *    moves to the dialog and returns to the poster afterwards. A modal without
 *    these is a trap for anyone not using a mouse.
 *  - The close button got an `onClick`. In the original it only worked by
 *    letting the click bubble to the backdrop, which also meant a click
 *    anywhere on the frame closed the dialog mid-video.
 *  - `next/image` and the site's own palette, rather than a bare `<img>` and
 *    a `bg-primary` token this Tailwind theme does not define.
 */

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

interface HeroVideoProps {
  animationStyle?: AnimationStyle;
  /** An embed URL, already carrying whatever player parameters it needs. */
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  /** Announced on the poster button; also names the dialog and the iframe. */
  title: string;
  playLabel: string;
  closeLabel: string;
  className?: string;
  /** Passed to `next/image`; the poster is the largest thing in the section. */
  sizes?: string;
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "",
  title,
  playLabel,
  closeLabel,
  className,
  sizes,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const opener = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  // Someone who has asked their system for less movement gets the dialog
  // without the flight across the screen — but still gets the dialog.
  const selectedAnimation = reduceMotion
    ? animationVariants.fade
    : animationVariants[animationStyle];

  useEffect(() => {
    if (!isVideoOpen) return;

    dialog.current?.focus();

    // Captured now rather than read in the cleanup: the poster stays mounted
    // for the dialog's whole life, so this is the same element either way, and
    // reading a ref during cleanup is the pattern that breaks when it is not.
    const poster = opener.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsVideoOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    // The page behind a modal must not scroll. Padding replaces the width the
    // scrollbar was occupying, so the layout does not jump sideways as it is
    // removed — visible on desktop Windows and Linux, where the bar has width.
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      // Back to the poster that opened it, so a keyboard reader does not land
      // at the top of the document.
      poster?.focus();
    };
  }, [isVideoOpen]);

  return (
    <div className={cn("relative", className)}>
      <button
        ref={opener}
        type="button"
        onClick={() => setIsVideoOpen(true)}
        aria-label={`${playLabel}: ${title}`}
        className="group relative block w-full cursor-pointer overflow-hidden"
      >
        <Image
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1280}
          height={720}
          sizes={sizes}
          className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        <span className="absolute inset-0 bg-forest-deep/20 transition-colors duration-500 group-hover:bg-forest-deep/35" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-[72px] items-center justify-center rounded-full bg-cream/95 shadow-lg transition-transform duration-500 ease-out group-hover:scale-110 sm:size-20">
            {/* Nudged right: an optically centred play glyph sits a little off
                the geometric centre of its circle. */}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="ml-1 size-7 fill-forest sm:size-8"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/80 p-4 backdrop-blur-md"
          >
            <motion.div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              {...selectedAnimation}
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : { type: "spring", damping: 30, stiffness: 300 }
              }
              // The backdrop closes on click; the frame must not, or pressing
              // anything around the player dismisses the video being watched.
              onClick={(event) => event.stopPropagation()}
              className="relative mx-4 aspect-video w-full max-w-4xl outline-none md:mx-0"
            >
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                aria-label={closeLabel}
                className="absolute -top-12 right-0 cursor-pointer rounded-full bg-cream/15 p-2 text-cream ring-1 ring-cream/30 backdrop-blur-md transition-colors hover:bg-cream/25"
              >
                <Close className="size-5" />
              </button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl ring-1 ring-cream/30">
                <iframe
                  src={videoSrc}
                  title={title}
                  className="size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
