import { whatsapp } from "../lib/content";
import { getDictionary } from "../lib/i18n";
import { WhatsApp } from "./icons";

/**
 * Floating chat pill, pinned to the bottom-right of every page — the trailing
 * corner, so it swaps to the left in Arabic and Urdu. The label collapses away
 * on narrow viewports so only the slate mark rides the corner.
 */
export async function WhatsAppButton() {
  const t = await getDictionary();
  const href = `https://wa.me/${whatsapp.number.replace(/\D/g, "")}?text=${encodeURIComponent(
    t.whatsapp.message,
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t.whatsapp.aria} — ${t.whatsapp.label}`}
      className="group fixed bottom-6 end-6 z-50 flex items-center gap-[9px] rounded-full bg-white p-1.5 shadow-[0_6px_22px_rgba(34,42,44,0.18)] transition-transform duration-300 hover:-translate-y-0.5 sm:pe-[18px]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#5a6a6a] text-white">
        <WhatsApp className="w-[22px]" />
      </span>
      <span className="hidden text-[16px] leading-none text-ink sm:inline">
        {t.whatsapp.label}
      </span>
    </a>
  );
}
