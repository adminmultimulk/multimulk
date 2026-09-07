"use client";

/**
 * "Download Brochure" — the button itself, wherever a development is shown.
 *
 * Underneath it is still a link straight at the PDF: that is where a
 * middle-click, a crawler and a reader without JavaScript all need it to go,
 * and it is the honest fallback if the dialog's chunk never arrives. The click
 * is intercepted only once there is a dialog to intercept it with, which is
 * what turns a download into a lead.
 */

import { useI18n } from "@/app/lib/i18n/context";
import { useBrochure } from "./brochure";
import { Download } from "./icons";

export function BrochureButton({
  slug,
  project,
  brochure,
  eyebrow,
  className,
}: {
  /** The project slug; the Server Action resolves the file from it. */
  slug: string;
  /** The development's name, which is the same in every language. */
  project: string;
  /** Path to the PDF — `Project.brochure`. */
  brochure: string;
  /** The line above the dialog's heading; the unit or the development. */
  eyebrow?: string;
  className?: string;
}) {
  const { t } = useI18n();
  const openBrochure = useBrochure();

  return (
    <a
      href={brochure}
      onClick={
        openBrochure
          ? (event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              openBrochure({ slug, project, eyebrow });
            }
          : undefined
      }
      className={className}
    >
      <Download className="w-4 shrink-0" />
      {t.brochure.cta}
    </a>
  );
}
