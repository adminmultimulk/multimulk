import { getDictionary } from "@/app/lib/i18n";
import { Container } from "./container";
import { ReviewLinks } from "./review-links";

/**
 * Trustpilot + Google review ask — used on About, Client Outcomes and Contact
 * so the copy and buttons stay one place.
 */
export async function ReviewInvite({
  tone = "mist",
}: {
  /** Mist on white pages; white when the preceding band is already mist. */
  tone?: "mist" | "white";
}) {
  const t = await getDictionary();

  return (
    <section
      className={
        tone === "mist"
          ? "bg-mist py-[72px] lg:py-[104px]"
          : "bg-white py-[72px] lg:py-[104px]"
      }
    >
      <Container>
        <h2 className="max-w-[420px] font-display text-[26px] leading-[1.24] text-ink sm:text-[32px]">
          {t.contact.reviewsHeading}
        </h2>
        <p className="mt-4 max-w-[520px] text-[13.5px] leading-[23px] text-ink/80">
          {t.contact.reviewsBody}
        </p>
        <ReviewLinks variant="contact" />
      </Container>
    </section>
  );
}
