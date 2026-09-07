"use client";

/**
 * "Enquire Now" outside a unit card.
 *
 * The card has its own copy of this, wired to the residence it shows. A
 * listing's page needs the same button in its hero and at the foot, so the
 * wiring lives here rather than being written a third time.
 *
 * Underneath it is still a link to /contact-us: that is where a middle-click,
 * a crawler and a reader without JavaScript all need it to go.
 */

import { useI18n } from "@/app/lib/i18n/context";
import { useEnquiry, type EnquiryContext } from "./enquiry";
import { Link } from "./link";

export function EnquireButton({
  context,
  className,
  children,
}: {
  context: EnquiryContext;
  className?: string;
  /** The label, when it should not be "Enquire Now". */
  children?: React.ReactNode;
}) {
  const { t } = useI18n();
  const openEnquiry = useEnquiry();

  return (
    <Link
      href="/contact-us"
      onClick={
        openEnquiry
          ? (event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              openEnquiry(context);
            }
          : undefined
      }
      className={className}
    >
      {children ?? t.common.enquireNow}
    </Link>
  );
}
