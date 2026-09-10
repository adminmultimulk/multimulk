import { ContactDetails } from "./contact-details";
import { ContactForm } from "./contact-form";
import { Container } from "./container";
import { getDictionary } from "@/app/lib/i18n";
import { mintFormToken } from "@/app/lib/leads/token";
import type { EnquiryType } from "@/app/lib/leads/schema";

/**
 * The enquiry form on a property's own page, rather than a click away behind
 * a button or over on /contact-us.
 *
 * A reader who has just finished the amenities of one development is asking
 * about *that* development, so the form arrives knowing it: the subject line
 * is filled in with the scheme or the residence, and the enquiry type is set
 * to the one the country implies. Everything the reader still has to type is
 * about themselves.
 *
 * The `#enquire` id is what an "Enquire" link on the same page points at, so
 * a property page has one destination for "I want to talk to someone".
 */
export async function PropertyEnquire({
  eyebrow,
  heading,
  body,
  subject,
  enquiryType = "turkiyeProperty",
  className = "bg-white py-16 lg:py-24",
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  subject: string;
  enquiryType?: EnquiryType;
  className?: string;
}) {
  const t = await getDictionary();

  return (
    <section id="enquire" className={`scroll-mt-24 ${className}`}>
      <Container>
        <div className="bg-mist p-8 sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              {eyebrow ? (
                <p className="mb-4 text-[10.5px] uppercase tracking-[0.12em] text-gold">
                  <bdi>{eyebrow}</bdi>
                </p>
              ) : null}
              <h2 className="max-w-[420px] font-display text-[28px] leading-[1.24] text-ink sm:text-[36px]">
                {heading}
              </h2>
              <p className="mt-6 max-w-[440px] text-[13.5px] leading-[23px] text-ink/80">
                {body ?? t.contact.leadBody}
              </p>

              <ContactDetails />
            </div>

            <ContactForm
              token={mintFormToken()}
              defaultEnquiry={enquiryType}
              defaultSubject={subject}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
