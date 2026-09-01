import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import type { Programme } from "@/app/lib/citizenship";
import { getDictionary } from "@/app/lib/i18n";

/** The closing band: one heading, one paragraph, one way forward. */
export async function CitizenshipCta({
  programme,
}: {
  programme: Programme;
}) {
  const t = await getDictionary();

  return (
    <section className="relative overflow-hidden bg-forest py-[86px] lg:py-[120px]">
      <Image
        src={programme.images.cta}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/80" />

      <Container className="relative">
        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
          <h2 className="font-display text-[32px] leading-[1.2] text-cream sm:text-[42px]">
            <AnimatedTitle align="center" variant="section">
              {t.citizenship.cta.heading}
            </AnimatedTitle>
          </h2>
          <span className="mt-6 block h-px w-9 bg-cream/60" />
          <p className="mt-6 text-[13.5px] leading-[23px] text-cream/85">
            {t.citizenship.cta.body}
          </p>
          <Link
            href="/contact-us"
            className="mt-9 rounded-full bg-cream px-9 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
          >
            {t.citizenship.cta.button}
          </Link>
        </div>
      </Container>
    </section>
  );
}
