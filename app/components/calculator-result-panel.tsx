"use client";

/**
 * The working estimate on `/calculator-result`: programme and family size
 * can still be adjusted, the total is always visible, and the line items stay
 * blurred until the lead form succeeds.
 */

import { useMemo, useState } from "react";
import { useI18n } from "@/app/lib/i18n/context";
import {
  programmeKey,
  type Programme,
} from "@/app/lib/programmes";
import {
  costAssumptions,
  costLines,
  costTotal,
} from "@/app/lib/tools/cost";
import { CalculatorResultForm } from "./calculator-result-form";
import { SelectMenu } from "./select-menu";

export function CalculatorResultPanel({
  programmes,
  token,
  initialProgramme,
  initialAdults,
  initialChildren,
}: {
  programmes: readonly Programme[];
  token: string;
  initialProgramme: string;
  initialAdults: string;
  initialChildren: string;
}) {
  const { t, locale, num } = useI18n();
  const [selected, setSelected] = useState(
    programmes.some((p) => programmeKey(p) === initialProgramme)
      ? initialProgramme
      : programmes[0]
        ? programmeKey(programmes[0])
        : "",
  );
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [unlocked, setUnlocked] = useState(false);

  const programme =
    programmes.find((p) => programmeKey(p) === selected) ?? programmes[0];

  const route = useMemo(
    () =>
      [...(programme?.routes ?? [])]
        .filter((r) => r.offered)
        .sort((a, b) => a.minimum.amount - b.minimum.amount)[0] ??
      programme?.routes[0],
    [programme],
  );

  const people = Number(adults) + Number(children);
  const lines = useMemo(() => {
    if (!route) return [];
    return [...costLines(route.minimum.amount, people)];
  }, [route, people]);
  const total = costTotal(lines);
  const currency = route?.minimum.currency ?? "USD";

  const money = (value: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      numberingSystem: "latn",
    }).format(value);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div className="border border-ink/12 bg-white p-7 lg:p-9">
        <h2 className="font-display text-[22px] leading-[1.3] text-ink">
          {t.tools.calculator.heading}
        </h2>
        <p className="mt-3 max-w-[520px] text-[13px] leading-[21px] text-ink/70">
          {t.tools.calculator.body}
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          <Field label={t.tools.calculator.programme}>
            <SelectMenu
              label={t.tools.calculator.programme}
              value={selected}
              onChange={setSelected}
              options={programmes.map(programmeKey)}
              format={(value) =>
                programmes.find((p) => programmeKey(p) === value)
                  ?.officialName ?? value
              }
              triggerClassName="rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink"
            />
          </Field>
          <Field label={t.tools.calculator.adults}>
            <SelectMenu
              label={t.tools.calculator.adults}
              value={adults}
              onChange={setAdults}
              options={["1", "2"]}
              triggerClassName="rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink"
            />
          </Field>
          <Field label={t.tools.calculator.children}>
            <SelectMenu
              label={t.tools.calculator.children}
              value={children}
              onChange={setChildren}
              options={["0", "1", "2", "3", "4"]}
              triggerClassName="rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink"
            />
          </Field>
        </div>

        <dl className="mt-9 border-t border-ink/15">
          <div
            className={
              unlocked
                ? ""
                : "pointer-events-none select-none blur-[5px]"
            }
            aria-hidden={!unlocked}
          >
            {lines.map((line) => (
              <div
                key={line.key}
                className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-3.5"
              >
                <dt className="text-[13px] text-ink/70">
                  {
                    t.tools.calculator.lines[
                      line.key as keyof typeof t.tools.calculator.lines
                    ]
                  }
                </dt>
                <dd className="num text-[13.5px] text-ink">
                  {money(line.value)}
                </dd>
              </div>
            ))}
          </div>

          <div className="flex items-baseline justify-between gap-6 py-5">
            <dt className="font-display text-[18px] text-ink">
              {t.tools.calculator.total}
            </dt>
            <dd className="num font-display text-[26px] leading-none text-ink">
              {money(total)}
            </dd>
          </div>
        </dl>

        {!unlocked ? (
          <p className="mt-1 text-[12px] leading-[19px] text-forest">
            {t.calculatorResult.unlockHint}
          </p>
        ) : null}

        <p className="mt-3 text-[11.5px] leading-[18px] text-ink/55">
          {t.tools.calculator.assumptions
            .replace("{tax}", `${costAssumptions.transferTaxRate * 100}%`)
            .replace("{legal}", money(costAssumptions.legalFees))
            .replace("{docs}", money(costAssumptions.documentation))
            .replace("{gov}", money(costAssumptions.governmentFeePerPerson))
            .replace("{people}", num(people))}
        </p>
        <p className="mt-3 text-[11.5px] leading-[18px] text-ink/55">
          {t.tools.calculator.caveat}
        </p>
      </div>

      <div>
        <h2 className="font-display text-[26px] leading-[1.24] text-ink sm:text-[32px]">
          {t.calculatorResult.formHeading}
        </h2>
        <p className="mt-4 max-w-[420px] text-[13.5px] leading-[23px] text-ink/80">
          {t.calculatorResult.formBody}
        </p>
        <div className="mt-8">
          <CalculatorResultForm
            token={token}
            programme={selected}
            adults={adults}
            children={children}
            onSent={() => setUnlocked(true)}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  // A `<div>`, not a `<label>`: SelectMenu's options sit in this wrapper, and
  // a label would re-activate the trigger after a pick — so the menu closes
  // and immediately opens again.
  return (
    <div className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.1em] text-ink/55">
        {label}
      </span>
      {children}
    </div>
  );
}
