/**
 * Burns the Multi Mulk mark into listing photography as Cloudinary delivers it.
 *
 * The problem this solves is a specific one. A client right-clicks a render,
 * picks "Search this image with Google Lens", and arrives at the developer's
 * own listing — the introduction, and the fee, gone. Cancelling the context
 * menu (`app/components/image-protection.tsx`) stops the gesture; it does not
 * stop the file, which is still one network-tab click away and identical to
 * the developer's original.
 *
 * A mark composited by Cloudinary is a different thing: the bytes that leave
 * the CDN carry it. Saved, copied, screenshotted or hotlinked, the mark comes
 * too, and the frame no longer matches the developer's original closely enough
 * for a reverse image search to be the one-click answer it is now.
 *
 * Centred rather than tucked into a corner, and that is deliberate: a corner
 * watermark is removed by cropping the corner. Low opacity keeps it out of the
 * way of a genuine buyer looking at a room.
 *
 * ## This is inert until configured
 *
 * `NEXT_PUBLIC_CLOUDINARY_WATERMARK_ID` is the public ID of the logo *within
 * the same Cloudinary account*, with `/` written as `:` — an asset at
 * `multimulk/brand/watermark` is `multimulk:brand:watermark`.
 *
 * Unset, every function here returns its input untouched and the site delivers
 * exactly what it does today. That default is load-bearing: Cloudinary fails a
 * transformation naming an overlay it cannot find, and it fails it by refusing
 * the whole URL. Guessing an ID here would not degrade to an unwatermarked
 * photograph, it would put a broken image on every listing on the site.
 */

/** Only Cloudinary delivery URLs can carry a transformation. */
const DELIVERY = /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//;

const overlay = process.env.NEXT_PUBLIC_CLOUDINARY_WATERMARK_ID;

/**
 * How the mark sits on the photograph.
 *
 * `w_0.4,fl_relative` scales it to 40% of the base image's width rather than a
 * fixed pixel size, so the mark is the same size on a thumbnail and on the
 * lightbox's full-width frame. `o_20` is faint enough to read past and heavy
 * enough to survive a screenshot.
 */
const PLACEMENT = "w_0.4,fl_relative,o_20,g_center";

/** True when there is an overlay asset to composite. */
export const watermarkConfigured = Boolean(overlay);

/**
 * Returns `src` with the watermark composited, or unchanged when there is
 * nothing to composite or the URL is not one Cloudinary serves.
 *
 * The transformation is inserted directly after `/upload/`, ahead of any
 * transformation already in the URL, so it composes with Next's own resizing
 * rather than replacing it.
 */
export function watermarked(src: string): string {
  if (!overlay || !DELIVERY.test(src)) return src;
  // Already carries the mark — `next/image` can hand a URL back through here.
  if (src.includes(`l_${overlay}`)) return src;

  return src.replace(
    DELIVERY,
    (upload) => `${upload}l_${overlay},${PLACEMENT}/fl_layer_apply/`,
  );
}
