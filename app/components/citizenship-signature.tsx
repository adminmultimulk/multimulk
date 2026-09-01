import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import type { Programme } from "@/app/lib/citizenship";
import { getDictionary } from "@/app/lib/i18n";

/**
 * The mid-page pitch: why this programme, in one paragraph, with the enquiry
 * form one click away. It sits between the gallery and the developments so a
 * reader who has seen the photography and is ready to act does not have to
 * scroll the rest of the page to find out how.
 */
export async function CitizenshipSignature({
  programme,
}: {
  programme: Programme;
}) {
  const t = await getDictionary();
  const copy = t.citizenship[programme.key].signature;

  return (
    <section className="bg-forest">
      <Container className="lg:px-0">
        <div className="grid items-stretch lg:grid-cols-2">
          <div className="relative order-last min-h-[280px] lg:order-first lg:min-h-[520px]">
            <Image
              src={programme.images.signature}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-[64px] sm:px-10 lg:px-[72px] lg:py-[96px]">
            <h2 className="max-w-[520px] font-display text-[30px] leading-[1.2] text-cream sm:text-[38px]">
              <AnimatedTitle variant="section">{copy.heading}</AnimatedTitle>
            </h2>
            <span className="mt-6 block h-px w-9 bg-gold-light" />
            <p className="mt-6 max-w-[520px] text-[13.5px] leading-[23px] text-cream/85">
              {copy.body}
            </p>
            <a
              href="#enquire"
              className="mt-9 self-start rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
            >
              {copy.button}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
