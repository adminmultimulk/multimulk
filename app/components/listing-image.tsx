import Image from "next/image";

/**
 * An image whose source the site does not control.
 *
 * The inventory that ships with the repository lives under `/public` and goes
 * through `next/image` like everything else. A listing created in the
 * dashboard points at Cloudinary — also optimised, because the host is
 * allow-listed in `next.config.ts` — but the field has always accepted any
 * URL, and `next/image` throws on a host it has not been told about. A
 * throwing image is a 500 on a live listing, so anything else is rendered as
 * a plain tag: unoptimised, and shown.
 */

const OPTIMISED = /^https:\/\/res\.cloudinary\.com\//;

export function ListingImage({
  src,
  alt,
  sizes,
  priority,
  className = "object-cover",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (src.startsWith("/") || OPTIMISED.test(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
