import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { aboutIntro } from "@/app/lib/about";
import { getDictionary } from "@/app/lib/i18n";

export async function AboutIntro() {
  const t = await getDictionary();
  const copy = t.about.intro;

  return (
    <section className="bg-white py-[72px] lg:py-[115px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[387px_1fr] lg:gap-[58px]">
          {/* The heading holds the top of the column and the figures the foot of it. */}
          <div className="flex flex-col justify-between gap-12">
            <h2 className="font-display text-[40px] leading-[1.12] text-ink sm:text-[54px] lg:text-[64px]">
              <AnimatedTitle variant="section">{copy.heading}</AnimatedTitle>
            </h2>

            <dl className="flex items-start gap-8 sm:gap-10">
              {aboutIntro.stats.map((stat) => (
                <div key={stat.key} className="max-w-[120px]">
                  <dt className="num font-display text-[34px] leading-[48px] text-ink sm:text-[40px]">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-[10.5px] uppercase leading-[16px] tracking-[0.1em] text-ink/70">
                    {copy.stats[stat.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="max-w-[850px] space-y-5 text-[13.5px] leading-[23px] text-ink/85">
              {copy.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <div className="relative mt-12 aspect-[850/470] w-full overflow-hidden">
              <Image
                src={aboutIntro.image}
                alt={copy.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
