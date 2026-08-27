"use client";

import { useMemo, useState } from "react";
import {
  bedroomOptions,
  currencies,
  locations,
  priceCeilings,
  propertyTypes,
  units,
  CBI_THRESHOLD_USD,
  type Currency,
} from "@/app/lib/properties";
import { Search } from "./icons";
import { SelectMenu } from "./select-menu";
import { UnitCard } from "./unit-card";

export type InitialFilters = {
  query: string;
  types: string[];
  bedrooms: string[];
  currency: Currency;
  maxPrice: string;
  location: string;
  cbiOnly: boolean;
};

/** "The Beach Vista 2 Bedroom" + "2" -> true; "Studio" only matches Studio. */
function matchesBedroom(unitBedroom: string, selected: string[]) {
  if (selected.length === 0) return true;
  return selected.some((value) =>
    value === "Studio"
      ? unitBedroom.toLowerCase().includes("studio")
      : unitBedroom.startsWith(value),
  );
}

function matchesLocation(
  unitLocation: string,
  unitCountry: string,
  selected: string,
) {
  if (selected === "Any") return true;
  return unitLocation === selected || unitCountry === selected;
}

export function PropertySearch({ initial }: { initial: InitialFilters }) {
  const [query, setQuery] = useState(initial.query);
  const [types, setTypes] = useState<string[]>(initial.types);
  const [bedrooms, setBedrooms] = useState<string[]>(initial.bedrooms);
  const [currency, setCurrency] = useState<Currency>(initial.currency);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [location, setLocation] = useState(initial.location);
  const [cbiOnly, setCbiOnly] = useState(initial.cbiOnly);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ceiling = maxPrice === "Any" ? null : Number(maxPrice);

    return units.filter((unit) => {
      if (q && !unit.title.toLowerCase().includes(q)) return false;
      if (types.length && !types.includes(unit.type)) return false;
      if (!matchesBedroom(unit.bedroom, bedrooms)) return false;
      if (!matchesLocation(unit.location, unit.country, location)) return false;
      if (ceiling !== null && unit.prices[currency] > ceiling) return false;
      if (cbiOnly && !unit.cbiEligible) return false;
      return true;
    });
  }, [query, types, bedrooms, location, maxPrice, currency, cbiOnly]);

  const toggle = (
    value: string,
    list: string[],
    set: (next: string[]) => void,
  ) =>
    set(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );

  const reset = () => {
    setQuery("");
    setTypes([]);
    setBedrooms([]);
    setMaxPrice("Any");
    setLocation("Any");
    setCbiOnly(false);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[299px_1fr] lg:gap-[58px]">
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="bg-mist p-7">
          <h2 className="font-display text-[22px] leading-[30px] text-ink">
            Find the Finest Residences
          </h2>
          <p className="mt-2 text-[12px] text-ink/70">
            Showing <span className="text-gold">{results.length}</span>{" "}
            {results.length === 1 ? "Unit" : "Units"}
          </p>

          <Field label="Search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 w-4 -translate-y-1/2 text-ink/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Residence name"
                className="w-full rounded-sm border border-transparent bg-white py-2.5 pl-9 pr-3 text-[13px] text-ink outline-none placeholder:text-ink/40 focus:border-gold"
              />
            </div>
          </Field>

          <Field label="Property Type">
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {propertyTypes.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-2 text-[13px] text-ink"
                >
                  <input
                    type="checkbox"
                    checked={types.includes(type)}
                    onChange={() => toggle(type, types, setTypes)}
                    className="h-4 w-4 shrink-0 appearance-none rounded-[2px] border border-ink/25 bg-white checked:border-gold checked:bg-gold"
                  />
                  {type}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Bedroom">
            <div className="flex flex-wrap gap-1">
              {bedroomOptions.map((option) => {
                const on = bedrooms.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(option, bedrooms, setBedrooms)}
                    className={`flex-1 rounded-sm border px-2 py-2 text-[13px] transition-colors ${
                      on
                        ? "border-gold bg-gold text-white"
                        : "border-ink/15 bg-white text-ink hover:border-gold"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="mt-5 grid grid-cols-[86px_1fr] gap-3">
            <Select
              label="Currency"
              value={currency}
              onChange={(v) => setCurrency(v as Currency)}
              options={currencies}
            />
            <Select
              label="Starting From"
              value={maxPrice}
              onChange={setMaxPrice}
              options={[
                "Any",
                ...priceCeilings[currency].map((n) => String(n)),
              ]}
              format={(v) =>
                v === "Any" ? "Any" : Number(v).toLocaleString("en-US")
              }
            />
          </div>

          <Select
            label="Location"
            value={location}
            onChange={setLocation}
            options={["Any", ...locations]}
            className="mt-5"
          />

          <label className="mt-6 flex cursor-pointer items-start gap-2.5 border-t border-ink/10 pt-5 text-[13px] text-ink">
            <input
              type="checkbox"
              checked={cbiOnly}
              onChange={() => setCbiOnly((v) => !v)}
              className="mt-0.5 h-4 w-4 shrink-0 appearance-none rounded-[2px] border border-ink/25 bg-white checked:border-gold checked:bg-gold"
            />
            <span>
              Citizenship eligible only
              <span className="mt-0.5 block text-[11px] text-ink/55">
                From USD {CBI_THRESHOLD_USD.toLocaleString("en-US")} — the
                Türkiye CBI property threshold
              </span>
            </span>
          </label>

          <button
            type="button"
            onClick={reset}
            className="mt-5 w-full rounded-full border border-ink/25 py-2.5 text-[12.5px] text-ink transition-colors hover:border-ink"
          >
            Reset All
          </button>
        </div>
      </aside>

      <div>
        {results.length ? (
          <div className="grid gap-x-[43px] gap-y-14 sm:grid-cols-2">
            {results.map((unit) => (
              <UnitCard key={unit.slug} unit={unit} currency={currency} />
            ))}
          </div>
        ) : (
          <div className="border border-ink/10 px-8 py-20 text-center">
            <p className="font-display text-[22px] text-ink">
              No residences match those filters
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-full border border-ink/25 px-7 py-2.5 text-[12.5px] text-ink transition-colors hover:border-ink"
            >
              Reset All
            </button>
          </div>
        )}
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
  return (
    <div className="mt-5">
      <p className="mb-2 text-[12.5px] text-ink/70">{label}</p>
      {children}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  format,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  format?: (value: string) => string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-[12.5px] text-ink/70">{label}</p>
      <SelectMenu
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        format={format}
        triggerClassName="rounded-sm border border-transparent bg-white py-2.5 pl-3 pr-3 text-[13px] text-ink focus-visible:border-gold"
      />
    </div>
  );
}
