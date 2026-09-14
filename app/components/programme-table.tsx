"use client";

import { useI18n } from "@/app/lib/i18n/context";
import { comparisonValueText, figureValue } from "@/app/lib/format-figure";
import type {
  ComparisonCell,
  ComparisonTableRow,
  ComparisonValue,
} from "@/app/lib/comparisons";
import type { Programme } from "@/app/lib/programmes";

/**
 * A generated comparison table.
 *
 * Nothing here is authored. Every cell is read from the programme records and
 * formatted at render, which is what keeps a threshold from saying one thing
 * on a comparison page and another on the programme's own — and what makes the
 * whole table free to render in a seventh language, since numbers and booleans
 * need no translating.
 */
export function ProgrammeTable({
  rows,
  recommended,
}: {
  rows: readonly ComparisonTableRow[];
  /** `category-slug` of the column carrying the practice's recommendation. */
  recommended?: string;
}) {
  const { t } = useI18n();
  const programmes = rows[0]?.cells.map((cell) => cell.programme) ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[13.5px] leading-[20px]">
        <caption className="sr-only">{t.compare.heading}</caption>
        <thead>
          <tr className="border-b border-ink/25">
            <th
              scope="col"
              className="w-[220px] py-4 pe-4 text-start text-[11px] font-normal uppercase tracking-[0.1em] text-ink/55"
            >
              {t.compare.factor}
            </th>
            {programmes.map((programme) => {
              const id = `${programme.category}-${programme.slug}`;
              return (
                <th
                  key={id}
                  scope="col"
                  className="py-4 pe-4 text-start font-display text-[17px] font-normal leading-[1.3] text-ink"
                >
                  {id === recommended ? (
                    <span className="mb-2 block font-sans text-[10.5px] uppercase tracking-[0.12em] text-gold">
                      {t.compare.recommended}
                    </span>
                  ) : null}
                  {programme.officialName}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, cells }) => (
            <tr key={key} className="border-b border-ink/10 align-top">
              <th
                scope="row"
                className="py-3.5 pe-4 text-start font-normal text-ink/70"
              >
                {t.compare.rows[key as keyof typeof t.compare.rows]}
              </th>
              {cells.map((cell) => (
                <Cell key={`${cell.programme.category}-${cell.programme.slug}`} cell={cell} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ cell }: { cell: ComparisonCell }) {
  const { t } = useI18n();
  const text = useCellText(cell.value);
  const unknown = cell.value.kind === "unknown";

  return (
    <td
      className={`py-3.5 pe-4 ${unknown ? "text-ink/40" : "text-ink"} ${
        cell.best ? "font-medium" : ""
      }`}
    >
      <span className={cell.best ? "num border-b-2 border-gold pb-0.5" : "num"}>
        {text}
      </span>
      {cell.best ? (
        <span className="sr-only"> — {t.compare.bestLabel}</span>
      ) : null}
    </td>
  );
}

/** Formats a cell; see `comparisonValueText`. */
function useCellText(value: ComparisonValue): string {
  const { t, locale } = useI18n();
  return comparisonValueText(locale, t, value);
}

/** The routes a programme recognises, and which of them we actually transact. */
export function ProgrammeRoutes({ programme }: { programme: Programme }) {
  const { t, locale } = useI18n();

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {programme.routes.map((route) => (
        <li
          key={route.key}
          className={`border p-5 ${
            route.offered ? "border-gold/50 bg-gold/5" : "border-ink/12"
          }`}
        >
          <p className="text-[12.5px] uppercase tracking-[0.1em] text-ink/55">
            {t.programmes.routes[route.key]}
          </p>
          <p className="num mt-2 font-display text-[26px] leading-none text-ink">
            {new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
              style: "currency",
              currency: route.minimum.currency,
              maximumFractionDigits: 0,
              numberingSystem: "latn",
            }).format(route.minimum.amount)}
          </p>
          <p className="mt-2 text-[12px] leading-[18px] text-ink/60">
            {route.offered
              ? t.programmes.offeredLabel
              : t.programmes.notOfferedLabel}
          </p>
        </li>
      ))}
    </ul>
  );
}

export { figureValue };
