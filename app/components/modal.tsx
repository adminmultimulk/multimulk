"use client";

/**
 * The shell every dialog on the site shares: the backdrop, the panel, the
 * close button, and the behaviour a modal owes a keyboard.
 *
 * Extracted when the brochure dialog joined the enquiry one. What is here is
 * the part neither of them is about — trapping Tab, restoring focus, keeping
 * the page behind still — so each dialog file is only its own content.
 */

import { useEffect, useRef } from "react";
import { useI18n } from "@/app/lib/i18n/context";
import { Close } from "./icons";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  onClose,
  labelledBy,
  className = "max-w-[1020px] p-6 sm:p-10 lg:p-14",
  children,
}: {
  onClose: () => void;
  /** The id of the heading inside, which names the dialog. */
  labelledBy: string;
  /** Width and padding; everything else about the panel is fixed. */
  className?: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);
  const pressedBackdrop = useRef(false);

  // The page behind must not scroll while the dialog is over it, and whatever
  // was focused before — the button that opened this — gets it back.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const scroll = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    return () => {
      document.body.style.overflow = scroll;
      opener?.focus();
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    // A select menu inside a form handles Escape itself, closing its own
    // panel and calling `preventDefault`. Without this check that keystroke
    // would carry on and take the whole dialog with it.
    if (event.key === "Escape" && !event.defaultPrevented) {
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panel.current) return;

    // `offsetParent` filters out anything the layout is currently hiding —
    // a form's honeypot, and every field once it says "Thank You".
    const stops = [
      ...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ].filter((el) => el.offsetParent !== null);
    if (stops.length === 0) return;

    const first = stops[0];
    const last = stops[stops.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === panel.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      onKeyDown={onKeyDown}
      // The press has to have started on the backdrop as well as ended there.
      // Selecting text in a message field and releasing past the panel's edge
      // is a click on the backdrop by every other measure, and it would
      // otherwise throw away a form somebody had just filled in.
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && pressedBackdrop.current) {
          onClose();
        }
      }}
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto overscroll-contain bg-forest-deep/75 p-4 py-8 sm:p-8"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`animate-select-open relative my-auto w-full bg-mist shadow-[0_40px_90px_-24px_rgba(7,31,19,0.65)] outline-none ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="absolute end-4 top-4 p-2 text-ink/50 transition-colors hover:text-ink sm:end-6 sm:top-6"
        >
          <Close className="w-4" />
        </button>

        {children}
      </div>
    </div>
  );
}
