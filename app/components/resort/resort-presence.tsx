import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";
import { MapPin } from "../icons";
import { Link } from "../link";
import { CaribbeanMap } from "./caribbean-map";
import type { CaribbeanPin } from "@/app/lib/resorts";

/**
 * The resort among the others Multi Mulk represents in the region: the chart
 * on one side, and on the other the prose, the list of resorts — each a link
 * where it has a page — and the firm's own figures.
 *
 * The figures are Multi Mulk's, not the developer's. The reference this
 * layout follows carried the developer's jobs-created and years-in-business
 * numbers here; on this site they would describe a different company.
 */
export function ResortPresence({
  eyebrow,
  heading,
  body,
  pins,
  current,
  links,
  stats,
  seaLabel,
  islandLabels,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  pins: CaribbeanPin[];
  /** The resort whose page this is. */
  current: string;
  /** Resort name to the path of its page, for the ones that have one. */
  links: Record<string, string | undefined>;
  stats: { value: string; label: string }[];
  seaLabel: string;
  islandLabels: Record<string, string>;
}) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <div className="mx-auto w-full max-w-[520px] lg:max-w-none">
            <CaribbeanMap
              pins={pins}
              current={current}
              seaLabel={seaLabel}
              islandLabels={islandLabels}
            />
          </div>

          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-gold">
              {eyebrow}
            </p>
            <h2 className="mt-5 max-w-[560px] font-display text-[32px] leading-[1.2] text-ink sm:text-[44px]">
              <AnimatedTitle variant="section">{heading}</AnimatedTitle>
            </h2>
            <p className="mt-7 max-w-[600px] text-[13.5px] leading-[23px] text-ink/85">
              {body}
            </p>

            <ul className="mt-9 flex flex-col gap-3.5">
              {pins.map((pin) => {
                const href = links[pin.name];
                const isCurrent = pin.name === current;
                const label = (
                  <span
                    className={`text-[13.5px] ${isCurrent ? "font-bold text-ink" : "text-ink"}`}
                  >
                    <bdi>{pin.name}</bdi>
                  </span>
                );
                return (
                  <li key={pin.name} className="flex items-center gap-3">
                    <MapPin
                      className={`w-3 shrink-0 ${isCurrent ? "text-gold" : "text-ink/40"}`}
                    />
                    {href && !isCurrent ? (
                      <Link
                        href={href}
                        className="transition-colors hover:text-gold"
                      >
                        {label}
                      </Link>
                    ) : (
                      label
                    )}
                  </li>
                );
              })}
            </ul>

            {stats.length ? (
              <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-display text-[40px] leading-none text-ink sm:text-[48px]">
                      {stat.value}
                    </dd>
                    <dt className="mt-3 text-[10.5px] uppercase tracking-[0.12em] text-ink/60">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
