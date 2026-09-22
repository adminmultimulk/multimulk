import { ArticleBody } from "./article-body";
import { Container, SectionIntro } from "./container";
import { DistanceIcon } from "./distance-icon";
import { Foundation } from "./icons";
import { ListingImage } from "./listing-image";
import { PropertyGallery } from "./property-gallery";
import type { Dictionary } from "@/app/lib/i18n";
import { interpolate, lookup } from "@/app/lib/i18n/format";
import { toBlocks } from "@/app/lib/rich-text";
import { groupDistances, type Story } from "@/app/lib/story";

/**
 * The story of a development, section by section — see `app/lib/story.ts`.
 *
 * Shared by the development page and the page of every unit in it, because
 * the questions it answers are asked on both: a reader who arrives at a
 * two-bedroom from the search page wants to know what the building stands on
 * and how far the airport is just as much as one who arrived at the scheme.
 *
 * Each section is omitted rather than empty when its fields were left blank.
 * The four are ordered from the building outward — the architecture and the
 * ground, then what is within reach of the door, then the district and its
 * market — which is the order the developer's own sheet lists them in, and
 * the order a buyer's questions arrive in.
 *
 * The backgrounds alternate from `first`, so the sequence continues whatever
 * colour the section above happened to end on.
 */
export function PropertyStory({
  story,
  name,
  t,
  first = "white",
}: {
  story: Story;
  /** The development's name, for the distances heading. */
  name: string;
  t: Dictionary;
  first?: "white" | "mist";
}) {
  const copy = t.property;
  const groups = groupDistances(story.distances);

  // Which of the four sections are present, so the backgrounds can alternate
  // over the ones that are actually drawn.
  const sections = [
    Boolean(story.architecture || story.earthquake),
    groups.length > 0,
    Boolean(story.areaOverview || story.areaGallery.length),
    Boolean(story.marketPerformance || story.marketChart),
  ];
  let drawn = 0;
  const tone = () => {
    const even = drawn % 2 === 0;
    drawn += 1;
    return (first === "white") === even ? "bg-white" : "bg-mist";
  };

  return (
    <>
      {/* The building and the ground. The two are one section because they
          are one argument — what it is like to live in, and why it will still
          be standing — and because the earthquake copy is a paragraph, which
          set beside the architecture reads as the structural footnote it is
          rather than a section on its own. */}
      {sections[0] ? (
        <section className={`${tone()} py-16 lg:py-24`}>
          <Container>
            <div
              className={`grid gap-12 ${
                story.architecture && story.earthquake
                  ? "lg:grid-cols-[1.1fr_1fr] lg:gap-20"
                  : ""
              }`}
            >
              {story.architecture ? (
                <div>
                  <h2 className="max-w-[460px] font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                    {copy.architecture}
                  </h2>
                  <span className="mt-5 block h-px w-7 bg-gold" />
                  <div className="mt-6 max-w-[560px]">
                    <ArticleBody body={toBlocks(story.architecture)} />
                  </div>
                </div>
              ) : null}

              {story.earthquake ? (
                <div className="self-start rounded-sm border border-forest/15 bg-sand/35 p-8 sm:p-10">
                  <div className="flex items-center gap-3">
                    <Foundation className="w-7 shrink-0 text-forest" />
                    <h2 className="font-display text-[24px] leading-[1.25] text-ink sm:text-[28px]">
                      {copy.earthquake}
                    </h2>
                  </div>
                  <span className="mt-5 block h-px w-7 bg-gold" />
                  <div className="mt-4">
                    <ArticleBody body={toBlocks(story.earthquake)} />
                  </div>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {/* What is within reach. One card per group, each row a place and how
          far it is — the distance and the time both, where the sheet gave
          both, since "6 km" and "15–20 min" answer different questions on an
          İstanbul road. */}
      {sections[1] ? (
        <section className={`${tone()} py-16 lg:py-24`}>
          <Container>
            <SectionIntro
              eyebrow={copy.distancesEyebrow}
              heading={interpolate(copy.distancesHeading, { project: name })}
            />
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map(({ group, rows }) => (
                <li
                  key={group}
                  className="rounded-sm border border-ink/10 bg-white p-6 sm:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mist text-gold">
                      <DistanceIcon group={group} className="w-5" />
                    </span>
                    <h3 className="font-display text-[19px] leading-[1.3] text-ink">
                      {lookup(copy.distanceGroups, group)}
                    </h3>
                  </div>
                  <ul className="mt-5 flex flex-col">
                    {rows.map((row) => (
                      <li
                        key={row.name}
                        className="flex items-baseline justify-between gap-4 border-t border-ink/10 py-2.5 text-[13px] leading-[19px]"
                      >
                        <span className="text-ink">{row.name}</span>
                        {/* Figures, so the numerals follow the reader's
                            locale and hold their order right-to-left. */}
                        <span className="num shrink-0 text-end text-ink/60">
                          {[row.distance, row.time].filter(Boolean).join(" · ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* The district. Photography first, because the overview runs to several
          screens of headed prose and a reader should see the place before
          reading about it; then the prose in a reading column. */}
      {sections[2] ? (
        <section className={`${tone()} py-16 lg:py-24`}>
          <Container>
            <SectionIntro
              eyebrow={copy.areaEyebrow}
              heading={copy.areaOverview}
            />
            {story.areaGallery.length ? (
              <div className="mt-12">
                <PropertyGallery
                  images={story.areaGallery}
                  label={copy.areaOverview}
                  variant="collage"
                />
              </div>
            ) : null}
            {story.areaOverview ? (
              <div className="mx-auto mt-12 max-w-[760px]">
                <ArticleBody body={toBlocks(story.areaOverview)} />
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      {/* The market. The chart the prose refers to sits beside it rather than
          above it, so a figure in the text and the line it describes are on
          screen together. Shown whole and uncropped — it is a chart, and the
          axis it would lose to a crop is the point of it. */}
      {sections[3] ? (
        <section className={`${tone()} py-16 lg:py-24`}>
          <Container>
            <div
              className={`grid gap-12 ${
                story.marketChart && story.marketPerformance
                  ? "lg:grid-cols-[1fr_1fr] lg:gap-20"
                  : ""
              }`}
            >
              <div>
                <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
                  {copy.marketEyebrow}
                </p>
                <h2 className="mt-5 max-w-[460px] font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                  {copy.marketPerformance}
                </h2>
                {story.marketPerformance ? (
                  <div className="mt-6 max-w-[560px]">
                    <ArticleBody body={toBlocks(story.marketPerformance)} />
                  </div>
                ) : null}
              </div>

              {story.marketChart ? (
                <div className="self-start rounded-sm border border-ink/10 bg-white p-3 lg:sticky lg:top-28">
                  <div className="relative aspect-[4/3] w-full">
                    <ListingImage
                      src={story.marketChart}
                      alt={copy.marketPerformance}
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
