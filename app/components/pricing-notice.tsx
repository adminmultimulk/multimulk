import { Container } from "./container";
import { EnquireButton } from "./enquire-button";
import { WhatsApp } from "./icons";
import type { EnquiryContext } from "./enquiry";
import { whatsapp } from "@/app/lib/content";
import { getDictionary } from "@/app/lib/i18n";
import { interpolate } from "@/app/lib/i18n/format";

/**
 * Where a price used to be, on a development's page and a unit's.
 *
 * Prices are still entered in the dashboard — the search page's budget filter,
 * the ordering of residences and the citizenship tick all read them — but they
 * are not printed. Inventory, campaigns and payment plans move faster than a
 * listing is edited, so a figure on the page was as likely to be out of date
 * as not, and the reader who acted on it found out from us. The team answers
 * with the current one instead.
 */
export async function PricingNotice({
  project,
  enquiry,
  className = "bg-white py-16 lg:py-20",
}: {
  /** The development, named in the WhatsApp message so it arrives in context. */
  project: string;
  enquiry: EnquiryContext;
  className?: string;
}) {
  const t = await getDictionary();
  const copy = t.listing;
  const href = `https://wa.me/${whatsapp.number.replace(/\D/g, "")}?text=${encodeURIComponent(
    interpolate(copy.pricingWhatsAppMessage, { project }),
  )}`;

  return (
    <section className={className}>
      <Container>
        <div className="flex flex-col items-center border border-gold/40 bg-mist px-6 py-12 text-center sm:px-12">
          <h2 className="max-w-[620px] font-display text-[26px] leading-[1.28] text-ink sm:text-[32px]">
            {copy.pricingHeading}
          </h2>
          <span className="mt-5 block h-px w-7 bg-gold" />
          <p className="mt-5 max-w-[520px] text-[14px] leading-[24px] text-ink/80">
            {copy.pricingBody}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <EnquireButton
              context={enquiry}
              className="rounded-full bg-forest px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest-deep"
            >
              {copy.pricingRequest}
            </EnquireButton>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-forest/30 px-8 py-3.5 text-[13px] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-cream"
            >
              <WhatsApp className="w-4" />
              {copy.pricingWhatsApp}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
