import Script from "next/script";

/** The Tawk.to property and widget, from the embed code in the Tawk dashboard. */
const propertyId = "6abf5b072afbb7343dbe4b1d";
const widgetId = "1k3tnn5nn";

/**
 * Tawk.to live chat.
 *
 * The widget takes the bottom-left corner, opposite the WhatsApp pill, with
 * the same 24px inset as the pill's `bottom-6 end-6`. In Arabic and Urdu the
 * pill moves to the left, so the widget swaps to the right rather than land
 * on top of it.
 *
 * Loaded `lazyOnload` because nothing on first paint depends on it, and the
 * embed pulls in a sizeable bundle of its own.
 */
export function TawkChat({ dir }: { dir: "ltr" | "rtl" }) {
  const position = dir === "rtl" ? "br" : "bl";
  const offsets = { position, xOffset: 24, yOffset: 24 };
  const customStyle = JSON.stringify({
    visibility: { desktop: offsets, mobile: offsets },
  });

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();
Tawk_API.customStyle=${customStyle};
(function(){var s=document.createElement("script");
s.async=true;
s.src="https://embed.tawk.to/${propertyId}/${widgetId}";
s.charset="UTF-8";
s.setAttribute("crossorigin","*");
document.head.appendChild(s);})();`}
    </Script>
  );
}
