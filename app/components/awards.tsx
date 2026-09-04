import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { awardItems } from "@/app/lib/content";
import { getDictionary } from "@/app/lib/i18n";
import { Diamond } from "./icons";

/**
 * Recognition Multi Mulk has received.
 *
 * Renders nothing while `awardItems` is empty, rather than an empty heading
 * over a blank row. The badges that used to fill it belonged to the reference
 * site this design came from.
 */
export async function Awards() {
  const t = await getDictionary();

  if (awardItems.length === 0) return null;

  return (
    <section className="bg-white pb-[72px] lg:pb-24">
      <Container>
        <div className="flex flex-col items-center text-center">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
            {t.awards.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[32px] leading-[1.28] text-ink sm:text-[40px]">
            <AnimatedTitle align="center" variant="section">
              {t.awards.heading}
            </AnimatedTitle>
          </h2>
          <Diamond className="mt-5 w-3 text-ink/45" />
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {awardItems.map((item, i) => (
            <li
              key={`${item.key}-${i}`}
              className="flex min-w-0 flex-col items-center"
            >
              <div className="flex h-12 w-full items-center justify-center">
                <Image
                  src={item.logo}
                  alt=""
                  width={140}
                  height={item.height}
                  unoptimized={item.logo.endsWith(".svg")}
                  style={{ height: item.height, width: "auto" }}
                  className="max-w-full object-contain"
                />
              </div>
              <p className="mt-5 text-center text-[9px] font-bold uppercase leading-[14px] tracking-[0.05em] text-gold">
                {t.awards.captions[item.key as keyof typeof t.awards.captions]}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
