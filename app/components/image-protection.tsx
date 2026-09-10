"use client";

import { useEffect } from "react";

/**
 * Takes the browser's own image menu off the site's photography.
 *
 * The thing being prevented is specific: a reader right-clicks a development
 * render, picks "Search this image with Google Lens", and lands on the
 * developer's own listing. Every other item on that menu — open in new tab,
 * save, copy image address — leads the same place.
 *
 * What this is worth, stated plainly: it is friction, not protection. The file
 * is still in the network tab, still in the page source, still reachable with
 * JavaScript off, and still on screen to be photographed. Anyone who thinks to
 * open developer tools is past it in a second. It stops the casual right-click,
 * which is the common case, and nothing beyond that. A watermark burnt into the
 * delivered file is the part that actually survives being copied — see
 * `app/lib/cloudinary.ts`.
 *
 * One listener on the document rather than a handler per image: `ListingImage`
 * and the `next/image` wrappers around it render on the server, and giving them
 * an `onContextMenu` would pull the whole tree over to the client for a
 * two-line effect.
 */
export function ImageProtection() {
  useEffect(() => {
    const isImage = (target: EventTarget | null) =>
      target instanceof Element && target.closest("img") !== null;

    const block = (event: Event) => {
      if (isImage(event.target)) event.preventDefault();
    };

    // `dragstart` is the other one-gesture route out: dragging a photograph to
    // the desktop copies the original file, menu or no menu.
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);

    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);

  return null;
}
