"use client";

/**
 * Keeps what somebody typed, until they save it.
 *
 * A listing is a long form — prose, a gallery, floor plans, terms — and it is
 * filled in over a coffee, on a train, with a phone ringing. Losing all of it
 * to a refresh, a back button or a laptop closing is the one failure this
 * dashboard cannot answer for, because nothing on the server ever saw the
 * work.
 *
 * The draft lives in `localStorage`, not in a cookie. A cookie is capped at
 * about 4KB — one Cloudinary URL is a tenth of that and a gallery has twenty —
 * and every cookie is sent up with every request to the site, so a half-typed
 * brochure would ride along on every page load for no reason. `localStorage`
 * is the same promise (this browser, until cleared) with room to keep it.
 *
 * Two rules make restoring safe rather than surprising:
 *
 *   - A draft is only restored onto the same starting point it was taken from.
 *     The values the server rendered are fingerprinted and stored with it, so
 *     a draft is thrown away rather than restored if the listing has since
 *     been saved — by this browser or by a colleague. That is also what clears
 *     the draft after a successful save: the form comes back holding what was
 *     just written, the fingerprint no longer matches, and the draft is gone.
 *   - A draft identical to the server's values is not a draft. Nothing is
 *     stored until something actually differs, and the notice is only shown
 *     when there was something to bring back.
 */

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A value's contents, independent of the order its keys were written in.
 *
 * `JSON.stringify` is order-sensitive, and the two objects compared here are
 * built by different code — the server renders the listing, the form reads
 * itself back — so a plain stringify of identical values did not match. Which
 * meant a form edited and then put back as it was still counted as a draft,
 * and came back announcing changes that were not there. Keys are sorted, so
 * only the contents decide.
 */
function fingerprint<T>(value: T): string {
  return JSON.stringify(value, (_key, entry: unknown) =>
    entry && typeof entry === "object" && !Array.isArray(entry)
      ? Object.fromEntries(
          Object.entries(entry as Record<string, unknown>).sort(([a], [b]) =>
            a < b ? -1 : a > b ? 1 : 0,
          ),
        )
      : entry,
  );
}

type Stored<T> = {
  /** The server's values at the moment the draft was taken. */
  base: string;
  savedAt: number;
  values: T;
};

/** Private browsing, a full disk, a locked-down browser: never worth a crash. */
function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // A quota error means this draft is not kept. The form still works.
  }
}

function forget(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // As above.
  }
}

export function useFormDraft<T>({
  key,
  initial,
  fromForm,
}: {
  /** Stable per listing — `property:new`, or the row's id. */
  key: string;
  /** What the server rendered the form with. */
  initial: T;
  /** The form's current state, in the same shape as `initial`. */
  fromForm: (form: FormData) => T;
}) {
  const form = useRef<HTMLFormElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Set between submitting and the action answering, so an unload mid-save
   *  does not write the draft back after `clear` removed it. */
  const submitting = useRef(false);
  /** What was actually sent, kept until the server has accepted it. */
  const submitted = useRef<T | null>(null);

  const [values, setValues] = useState(initial);
  /**
   * The same values, but re-read on every change rather than only on arrival.
   * `values` seeds the fields and must not move under them; this is what the
   * preview beside the form renders, so it follows the typing.
   */
  const [live, setLive] = useState(initial);
  /**
   * Bumped to remount the fields. Every control in this form is uncontrolled
   * from a `defaultValue`, which is what lets the upload boxes and the amenity
   * picker hold their own state — so restoring is a remount with different
   * defaults rather than a hundred writes into the DOM.
   */
  const [version, setVersion] = useState(0);
  const [restoredAt, setRestoredAt] = useState<number | null>(null);

  const base = fingerprint(initial);

  /**
   * A callback ref rather than a ref object handed back to the caller: the
   * form's own element is this hook's business, and a ref that leaves here
   * makes every value it is returned alongside look like a ref to the compiler.
   */
  const formRef = useCallback((node: HTMLFormElement | null) => {
    form.current = node;
  }, []);

  const persist = useCallback(
    (next: T) => {
      // Back to what the server holds is not a draft, it is a clean form.
      if (fingerprint(next) === base) forget(key);
      else write(key, JSON.stringify({ base, savedAt: Date.now(), values: next }));
    },
    [base, key],
  );

  const save = useCallback(() => {
    const node = form.current;
    if (!node || submitting.current) return;
    const next = fromForm(new FormData(node));
    setLive(next);
    persist(next);
  }, [fromForm, persist]);

  /**
   * Debounced: a paragraph is one write rather than one per keystroke, and a
   * quarter of a second is short enough that the preview reads as live and
   * long enough that a fast typist is not re-rendering it per character.
   */
  const touch = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 250);
  }, [save]);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    forget(key);
    setRestoredAt(null);
  }, [key]);

  /** "Throw my changes away and give me back what is saved." */
  const discard = useCallback(() => {
    clear();
    setValues(initial);
    setLive(initial);
    setVersion((current) => current + 1);
  }, [clear, initial]);

  useEffect(() => {
    const raw = read(key);
    if (!raw) return;

    let stored: Stored<T> | null = null;
    try {
      stored = JSON.parse(raw) as Stored<T>;
    } catch {
      stored = null;
    }

    // Unreadable, from an older shape of this form, or taken from a version of
    // the listing that has since been saved over.
    if (!stored || stored.base !== base || !stored.values) {
      forget(key);
      return;
    }
    if (fingerprint(stored.values) === base) {
      forget(key);
      return;
    }

    /*
     * One read of an external store, once, on arrival — and it cannot happen
     * any earlier: `localStorage` does not exist while this renders on the
     * server, and restoring during the first client render would hydrate the
     * form with values the server's HTML does not have. So: one extra render,
     * deliberately, and never again for the life of the form.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(stored.values);
    setLive(stored.values);
    setRestoredAt(stored.savedAt);
    setVersion((current) => current + 1);
    // Only on arrival at the form; later changes are the point of the draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  /**
   * The last word before the tab goes. `pagehide` fires where `beforeunload`
   * is unreliable (Safari, bfcache) and covers the changes no keystroke
   * followed — an uploaded photograph, a debounce still counting down.
   */
  useEffect(() => {
    const flush = () => save();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, [save]);

  /**
   * Submitting hands the work to the server; the draft is no longer needed —
   * but what was sent is kept, because it may be coming straight back.
   */
  const onSubmit = useCallback(() => {
    const node = form.current;
    submitted.current = node ? fromForm(new FormData(node)) : null;
    submitting.current = true;
    clear();
  }, [clear, fromForm]);

  /**
   * The server sent it back.
   *
   * React resets an uncontrolled form when its action completes, and it does
   * not ask first whether the action succeeded — so a listing rejected over a
   * missing longitude came back with every box blank and an error message
   * about a form that no longer had anything in it. That is the whole of "I
   * can never save a property": not the validation, the twenty minutes of
   * typing that went with it.
   *
   * So the fields are remounted from what was actually submitted, which is
   * newer than the reset and immune to it, and the draft is taken again — a
   * rejected save is exactly when a refresh would hurt most.
   */
  const rejected = useCallback(() => {
    submitting.current = false;
    const sent = submitted.current;
    if (!sent) {
      save();
      return;
    }
    setValues(sent);
    setLive(sent);
    setVersion((current) => current + 1);
    persist(sent);
  }, [persist, save]);

  return {
    formRef,
    values,
    live,
    version,
    restoredAt,
    touch,
    onSubmit,
    rejected,
    discard,
  };
}
