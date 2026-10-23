import Script from "next/script";

/**
 * One gtag.js load, configured for every Google destination the site reports
 * to — GA4 and Google Ads.
 *
 * In place of `GoogleAnalytics` from `@next/third-parties`, which takes a
 * single id. A second `config` call added beside it would race that
 * component's own inline script, and gtag expects its `js` command first;
 * writing the init out here keeps the order fixed.
 */
export function GoogleTag({ ids }: { ids: readonly string[] }) {
  const [primary] = ids;
  if (!primary) return null;

  return (
    <>
      <Script id="google-tag-init">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${ids.map((id) => `gtag('config', '${id}');`).join("\n")}`}
      </Script>
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${primary}`}
      />
    </>
  );
}
