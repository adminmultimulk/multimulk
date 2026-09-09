import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { scoreWeights } from "@/app/lib/due-diligence";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import { formatNumber } from "@/app/lib/i18n/format";

const weights = Object.entries(scoreWeights) as [
  keyof typeof scoreWeights,
  number,
][];

/** The heaviest factor sets the full bar, so the eight are read against each other. */
const heaviest = Math.max(...weights.map(([, weight]) => weight));

/**
 * The scoring model.
 *
 * The one section of the page that is Multi Mulk's own rather than a
 * restatement of programme rules, so it gets the dark band and is drawn rather
 * than tabulated: a column of bare numbers hides the thing the weights are
 * meant to show, which is that citizenship safety counts for four times what
 * delivery risk does. Still a table underneath — it is a table of figures, and
 * the bars are decoration a screen reader has no use for.
 */
export async function ProtectionScore() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = t.protection;

  return (
    <section className="bg-forest-deep py-[72px] lg:py-[110px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[415px_1fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[30px] leading-[1.2] text-cream sm:text-[42px]">
              <AnimatedTitle variant="section">{copy.scoreHeading}</AnimatedTitle>
            </h2>
            <hr className="mt-8 border-cream/20" />
            <p className="mt-8 text-[13px] leading-[22px] text-cream/80">
              {copy.scoreIntro}
            </p>
            <p className="mt-6 text-[12px] leading-[19px] text-cream/55">
              {copy.scoreCaveat}
            </p>
          </div>

          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-cream/25">
                <th
                  scope="col"
                  className="py-3 text-start text-[11px] font-normal uppercase tracking-[0.1em] text-cream/55"
                >
                  {copy.factorLabel}
                </th>
                <th
                  scope="col"
                  className="py-3 text-end text-[11px] font-normal uppercase tracking-[0.1em] text-cream/55"
                >
                  {copy.weightLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {weights.map(([factor, weight]) => (
                <tr key={factor} className="border-b border-cream/12">
                  <th
                    scope="row"
                    className="py-4 pe-6 text-start align-middle font-normal text-cream"
                  >
                    {copy.factors[factor]}
                  </th>
                  <td className="py-4 align-middle">
                    <div className="flex items-center justify-end gap-5">
                      <span
                        aria-hidden="true"
                        className="hidden h-[5px] w-full max-w-[340px] bg-cream/12 sm:block"
                      >
                        <span
                          className="block h-full bg-gold-light"
                          style={{ width: `${(weight / heaviest) * 100}%` }}
                        />
                      </span>
                      <span className="num shrink-0 text-cream">
                        {formatNumber(locale, weight)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
