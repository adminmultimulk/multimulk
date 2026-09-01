"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Chevron } from "./icons";

/** Panel height budget; below this it flips above the trigger. */
const PANEL_MAX_H = 320;

/**
 * The nearest ancestor that would crop the panel — anything that is not
 * `overflow: visible`. Returns null when the panel is free to overhang the
 * page, in which case the viewport is the only boundary that matters.
 */
function clippingAncestor(el: HTMLElement | null): HTMLElement | null {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    const overflow = style.overflow + style.overflowX + style.overflowY;
    if (/hidden|clip|auto|scroll/.test(overflow)) return node;
  }
  return null;
}

export type SelectMenuProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  /** Presentation only — `value` stays the raw option. */
  format?: (value: string) => string;
  /** Renders a hidden input so the value posts with a native form. */
  name?: string;
  required?: boolean;
  /** Wrapper (positioning context for the panel). */
  className?: string;
  /** The closed control itself, so each call site keeps its own skin. */
  triggerClassName?: string;
  /** Chevron tint, which differs over the dark hero and on white. */
  chevronClassName?: string;
  /** Widen the panel past the trigger, as the design does on narrow fields. */
  panelClassName?: string;
};

export function SelectMenu({
  label,
  value,
  onChange,
  options,
  format,
  name,
  required,
  className = "",
  triggerClassName = "",
  chevronClassName = "text-ink/60",
  panelClassName = "",
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<"down" | "up">("down");
  const [highlight, setHighlight] = useState(0);

  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const id = useId();
  const selected = Math.max(0, options.indexOf(value));
  const text = (option: string) => (format ? format(option) : option);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  }, []);

  const pick = (index: number) => {
    onChange(options[index]);
    close();
  };

  // Open toward whichever side has room — the hero bar sits at the bottom of
  // the viewport, so its menus have to rise.
  useLayoutEffect(() => {
    if (!open) return;
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;

    // Room is measured against whatever would actually clip the panel, not the
    // viewport. The hero is `overflow-hidden`, so once the page is scrolled
    // past it there is plenty of window below the trigger and none of it is
    // reachable: the panel would open downward and be sheared off at the
    // hero's edge, hiding the last options. Falls back to the viewport where
    // nothing clips, which is the case on the search page.
    const clip = clippingAncestor(trigger.current)?.getBoundingClientRect();
    const floor = Math.min(window.innerHeight, clip?.bottom ?? Infinity);
    const ceiling = Math.max(0, clip?.top ?? 0);

    const below = floor - rect.bottom;
    const above = rect.top - ceiling;
    const needed = Math.min(PANEL_MAX_H, options.length * 46 + 24);

    setDrop(below < needed && above > below ? "up" : "down");
    setHighlight(selected);
  }, [open, options.length, selected]);

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    list.current
      ?.querySelector(`[data-index="${highlight}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, highlight]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = options.length - 1;
    const step = (next: number) => {
      event.preventDefault();
      setHighlight(Math.min(last, Math.max(0, next)));
    };

    switch (event.key) {
      case "ArrowDown":
        return step(highlight + 1);
      case "ArrowUp":
        return step(highlight - 1);
      case "Home":
        return step(0);
      case "End":
        return step(last);
      case "Enter":
      case " ":
        event.preventDefault();
        return pick(highlight);
      case "Tab":
        return setOpen(false);
      case "Escape":
        event.preventDefault();
        return close();
      default:
        break;
    }

    if (event.key.length !== 1) return;
    // Type-ahead: keystrokes within a second build one search string.
    const now = Date.now();
    typed.current.text =
      (now - typed.current.at < 1000 ? typed.current.text : "") +
      event.key.toLowerCase();
    typed.current.at = now;
    const match = options.findIndex((option) =>
      text(option).toLowerCase().startsWith(typed.current.text),
    );
    if (match !== -1) setHighlight(match);
  };

  return (
    <div ref={wrapper} className={`relative ${className}`}>
      {name ? (
        <input type="hidden" name={name} value={value} required={required} />
      ) : null}

      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 text-start outline-none ${triggerClassName}`}
      >
        <span className="truncate">{text(value)}</span>
        <Chevron
          className={`w-2 shrink-0 transition-transform duration-300 ${
            open ? "-scale-y-100" : ""
          } ${chevronClassName}`}
        />
      </button>

      {open ? (
        <ul
          ref={list}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`${id}-option-${highlight}`}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          style={
            {
              maxHeight: PANEL_MAX_H,
              "--select-shift": drop === "up" ? "6px" : "-6px",
            } as CSSProperties
          }
          className={`absolute start-0 z-50 min-w-full origin-top overflow-y-auto bg-cream py-3 text-start shadow-[0_18px_44px_-14px_rgba(34,42,44,0.45)] outline-none animate-select-open ${
            drop === "up" ? "bottom-full mb-3 origin-bottom" : "top-full mt-3"
          } ${panelClassName}`}
        >
          {options.map((option, index) => {
            const isSelected = index === selected;
            return (
              <li
                key={option}
                id={`${id}-option-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onClick={() => pick(index)}
                onMouseEnter={() => setHighlight(index)}
                className={`cursor-pointer px-6 py-3 text-[13.5px] leading-[20px] transition-colors ${
                  isSelected ? "text-gold" : "text-ink"
                } ${index === highlight ? "bg-ink/[0.05]" : ""}`}
              >
                {text(option)}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
