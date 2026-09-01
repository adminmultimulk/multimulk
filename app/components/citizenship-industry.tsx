import { Container, SectionIntro } from "./container";
import type { Programme } from "@/app/lib/citizenship";
import { industryMarket, industryTimeline } from "@/app/lib/citizenship";
import { getDictionary } from "@/app/lib/i18n";
import { placeLabel } from "@/app/lib/i18n/units";

/**
 * The industry this programme belongs to: two figures, then every programme in
 * the order it opened.
 *
 * The point of the timeline is context — that the route being considered sits
 * inside a market four decades old — so the entries for the programme being
 * read are picked out in gold and the rest are left as the run they sit in.
 *
 * The rail scrolls sideways rather than wrapping, and follows the page's
 * direction, so under Arabic and Urdu it reads right to left with the earliest
 * year first, which is the correct reading order for those scripts.
 */
export async function CitizenshipIndustry({
  programme,
}: {
  programme: Programme;
}) {
  const t = await getDictionary();
  const copy = t.citizenship.industry;

  return (
    <section
      id="industry"
      className="scroll-mt-[72px] bg-mist py-[72px] lg:py-[104px]"
    >
      <Container>
        <SectionIntro
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
        />

        <dl className="mx-auto mt-12 grid max-w-[640px] grid-cols-2 gap-6 lg:mt-16">
          {[
            { value: industryMarket.size, label: copy.marketLabel },
            { value: industryMarket.growth, label: copy.growthLabel },
          ].map((figure) => (
            <div
              key={figure.label}
              className="border-t border-ink/15 pt-5 text-center"
            >
              <dt className="num font-display text-[36px] leading-none text-ink sm:text-[46px]">
                {figure.value}
              </dt>
              <dd className="mt-3 text-[10.5px] uppercase leading-[16px] tracking-[0.1em] text-ink/65">
                {figure.label}
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-14 text-center text-[11px] uppercase tracking-[0.12em] text-ink/55 lg:mt-20">
          {copy.timelineHeading}
        </h3>
      </Container>

      <ol className="mt-8 flex gap-0 overflow-x-auto px-6 pb-4 [scrollbar-width:none] sm:px-10 lg:justify-center lg:px-[72px] [&::-webkit-scrollbar]:hidden">
        {industryTimeline.map((entry, i) => {
          const here = entry.programmes.includes(programme.key);
          return (
            <li
              key={`${entry.year}-${entry.place}`}
              className="relative w-[142px] shrink-0 pt-9 text-center sm:w-[164px]"
            >
              {/* The rule runs behind the markers; its ends are trimmed so it
                  starts and stops at the first and last dot rather than in
                  mid-air. `start`/`end` keep that true when the list mirrors. */}
              <span
                className={`absolute top-[15px] h-px bg-ink/20 ${
                  i === 0 ? "start-1/2 end-0" : ""
                } ${i === industryTimeline.length - 1 ? "start-0 end-1/2" : ""} ${
                  i > 0 && i < industryTimeline.length - 1 ? "inset-x-0" : ""
                }`}
              />
              <span
                className={`absolute start-1/2 top-[11px] block h-2 w-2 -translate-x-1/2 rounded-full rtl:translate-x-1/2 ${
                  here ? "bg-gold" : "bg-ink/25"
                }`}
              />
              <p
                className={`num font-display text-[24px] leading-none ${
                  here ? "text-gold" : "text-ink/70"
                }`}
              >
                {entry.year}
              </p>
              <p
                className={`mt-2 px-2 text-[11.5px] leading-[17px] ${
                  here ? "text-ink" : "text-ink/60"
                }`}
              >
                {placeLabel(t, entry.place)}
                {/* What the gold says, for a reader who cannot see it. The
                    visible equivalent is the legend below, said once — the
                    Caribbean page highlights five of six entries, and a label
                    repeated under nearly every one stops carrying meaning. */}
                {here ? (
                  <span className="sr-only"> — {copy.thisProgramme}</span>
                ) : null}
              </p>
            </li>
          );
        })}
      </ol>

      <Container>
        <p
          aria-hidden="true"
          className="mt-2 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.1em] text-ink/55"
        >
          <span className="block h-2 w-2 rounded-full bg-gold" />
          {copy.thisProgramme}
        </p>
      </Container>
    </section>
  );
}
