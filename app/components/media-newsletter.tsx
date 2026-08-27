import Image from "next/image";
import Link from "next/link";
import { mediaNewsletter } from "@/app/lib/media";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";

/**
 * Closing band: an inset image with the invitation centred over it. The design
 * lays the type straight onto the photograph; a scrim is added here so it
 * stays legible whichever image is swapped in.
 */
export function MediaNewsletter() {
  return (
    <section className="bg-white pb-[72px] lg:pb-[144px]">
      <Container>
        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden lg:aspect-[1249/685] lg:min-h-0">
          <Image
            src={mediaNewsletter.image}
            alt=""
            fill
            sizes="(max-width: 1440px) 100vw, 1296px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-deep/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />

          <div className="relative flex flex-col items-center px-6 text-center">
            <h2 className="max-w-[760px] font-display text-[28px] leading-[1.4] text-white sm:text-[34px] lg:text-[40px]">
              <AnimatedTitle align="center" variant="section">
                {mediaNewsletter.heading}
              </AnimatedTitle>
            </h2>
            <p className="mt-[14.4px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-white/90">
              {mediaNewsletter.body}
            </p>
            <Link
              href={mediaNewsletter.href}
              className="mt-[28.8px] rounded-full border border-white/85 px-[28.8px] py-3 text-[13.8px] text-white transition-colors hover:bg-white hover:text-ink"
            >
              {mediaNewsletter.cta}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
