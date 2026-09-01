import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import type { Programme } from "@/app/lib/citizenship";
import { getDictionary } from "@/app/lib/i18n";

/** Who the reader would be working with, and the work behind that claim. */
export async function CitizenshipAbout({
  programme,
}: {
  programme: Programme;
}) {
  const t = await getDictionary();
  const copy = t.citizenship.about;

  return (
    <section
      id="about"
      className="scroll-mt-[72px] bg-white py-[72px] lg:py-[104px]"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-[70px]">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
              {copy.eyebrow}
            </p>
            <h2 className="mt-5 max-w-[460px] font-display text-[30px] leading-[1.2] text-ink sm:text-[40px]">
              <AnimatedTitle variant="section">{copy.heading}</AnimatedTitle>
            </h2>
            <p className="mt-6 max-w-[540px] text-[13.5px] leading-[23px] text-ink/85">
              {copy.body}
            </p>
            <Link
              href="/about"
              className="mt-9 inline-block rounded-full border border-ink/25 px-8 py-3.5 text-[13px] text-ink transition-colors hover:border-ink"
            >
              {copy.link}
            </Link>
          </div>

          {/* Three of the programme's developments — the work, not a portrait. */}
          <div className="grid grid-cols-2 gap-3 self-center">
            <div className="relative col-span-2 aspect-[16/9] overflow-hidden">
              <Image
                src={programme.images.about[0]}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            {programme.images.about.slice(1, 3).map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
