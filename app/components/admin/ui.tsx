import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

/**
 * The dashboard's form furniture.
 *
 * Plain and deliberately unlike the public site: this is a tool used all day
 * by five people, not a brochure. It borrows the brand's ink and forest so it
 * does not feel like a different product, and nothing else.
 */

export function Field({
  label,
  name,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-[13px] font-medium text-ink">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-[12px] text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] leading-[18px] text-ink/55">{hint}</p>
      ) : null}
    </div>
  );
}

const control =
  "w-full rounded-md border bg-white px-3 py-2 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-ink/5";

export function Input({
  error,
  className,
  ...props
}: ComponentProps<"input"> & { error?: string }) {
  return (
    <input
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.name}-error` : undefined}
      className={clsx(
        control,
        error ? "border-red-400" : "border-ink/15",
        className,
      )}
    />
  );
}

export function Textarea({
  error,
  className,
  ...props
}: ComponentProps<"textarea"> & { error?: string }) {
  return (
    <textarea
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.name}-error` : undefined}
      className={clsx(
        control,
        "min-h-[120px] leading-[22px]",
        error ? "border-red-400" : "border-ink/15",
        className,
      )}
    />
  );
}

export function Select({
  error,
  className,
  ...props
}: ComponentProps<"select"> & { error?: string }) {
  return (
    <select
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.name}-error` : undefined}
      className={clsx(
        control,
        error ? "border-red-400" : "border-ink/15",
        className,
      )}
    />
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-forest text-white hover:bg-forest-deep",
        variant === "secondary" &&
          "border border-ink/15 bg-white text-ink hover:bg-ink/5",
        variant === "danger" &&
          "border border-red-300 bg-white text-red-700 hover:bg-red-50",
        className,
      )}
    />
  );
}

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={clsx(
        "rounded-md border px-3 py-2 text-[13px]",
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      {children}
    </p>
  );
}

/**
 * Three states, not two: a piece marked published with a date still to come is
 * neither live nor a draft, and calling it "Live" when a reader cannot see it
 * is the one thing this pill must never do.
 */
export function StatusPill({
  status,
  scheduled,
}: {
  status: "DRAFT" | "PUBLISHED";
  scheduled?: boolean;
}) {
  const state =
    status === "PUBLISHED" ? (scheduled ? "scheduled" : "live") : "draft";

  return (
    <span
      className={clsx(
        "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium tracking-[0.04em] uppercase",
        state === "live" && "bg-forest/10 text-forest",
        state === "scheduled" && "bg-amber-100 text-amber-800",
        state === "draft" && "bg-ink/8 text-ink/60",
      )}
    >
      {state === "live" ? "Live" : state === "scheduled" ? "Scheduled" : "Draft"}
    </span>
  );
}

export function PageHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-[60ch] text-[13px] leading-[20px] text-ink/60">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </header>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/15 px-6 py-12 text-center text-[13px] text-ink/55">
      {children}
    </div>
  );
}
