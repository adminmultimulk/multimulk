import { mergedArticles } from "../lib/cms/articles";
import { comparisons } from "../lib/comparisons";
import { answeredInFull } from "../lib/faqs";
import { getDictionary } from "../lib/i18n";
import { programmeFacts } from "../lib/programme-pages";
import {
  getProgramme,
  isPublishable,
  programmes,
  type Programme,
} from "../lib/programmes";
import { buildPath } from "../lib/routes";
import { allArticles } from "../lib/knowledge";
import { absoluteUrl, isProductionHost } from "../lib/site";

/**
 * `/llms.txt` — the site, summarised for language models.
 *
 * The convention (llmstxt.org) is a Markdown file at the root: a title, a
 * one-paragraph summary, then sections of links with a line on each. It is
 * what an answer engine reads to find the pages worth quoting, so it carries
 * the programme figures themselves rather than only links to them, read from
 * the same record as every table on the site.
 *
 * English only, and English URLs: one file per origin is the convention, and
 * every page it names links to its six translations through `hreflang`.
 *
 * Sits outside `[lang]` for the same reason `robots.ts` does; the proxy's
 * matcher already skips any path with a file extension.
 */
export const revalidate = 3600;

const locale = "en" as const;
const url = (path: string) => absoluteUrl(`/${locale}${path === "/" ? "" : path}`);

export async function GET() {
  if (!isProductionHost) {
    return new Response("# Not the production site\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const t = await getDictionary(locale);
  const published = programmes.filter(isPublishable);

  const programmeLine = (programme: Programme) => {
    const path = buildPath(
      programme.category === "citizenship"
        ? "citizenshipProgramme"
        : "goldenVisaProgramme",
      { programme: programme.slug },
    );
    const facts = programmeFacts(locale, t, programme)
      .map((fact) => `${fact.label}: ${fact.value}`)
      .join("; ");
    const status =
      programme.status === "open" ? "" : ` (${t.programmes.status[programme.status]})`;
    return `- [${programme.officialName}${status}](${url(path)}): ${facts}. Last reviewed ${programme.review.reviewedOn}.`;
  };

  const comparisonTitle = (pairs: (typeof comparisons)[number]["programmes"]) =>
    pairs
      .map(([category, slug]) => getProgramme(category, slug)?.shortName ?? slug)
      .join(" vs ");

  // The database is optional here: without it the file still lists what
  // ships with the site, rather than failing outright.
  const articles = (await mergedArticles().catch(() => allArticles))
    .filter((article) => !article.source)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 40);

  const sections = [
    `# Multi Mulk`,
    `> ${t.meta.home.description} Advice on citizenship by investment (Türkiye and the Caribbean), residency by investment (UAE, Türkiye, Portugal, Greece) and the property that qualifies for them. Offices in Türkiye, the UAE and Pakistan; the site is published in English, Arabic, Turkish, Russian, Urdu, French and Chinese.`,
    `Figures below are minimum thresholds as published by each programme and reviewed by Multi Mulk on the date given. Transaction costs, government fees and due-diligence fees are additional. Confirm current figures before acting.`,

    `## Citizenship by investment`,
    `- [All citizenship programmes](${url(buildPath("citizenshipHub"))}): ${t.pillars.citizenship.body}`,
    ...published.filter((p) => p.category === "citizenship").map(programmeLine),

    `## Residency by investment (golden visas)`,
    `- [All residency programmes](${url(buildPath("goldenVisaHub"))}): ${t.pillars.goldenVisa.body}`,
    ...published.filter((p) => p.category === "residency").map(programmeLine),

    `## Comparisons`,
    `- [Compare programmes](${url(buildPath("compareIndex"))}): side-by-side tables generated from the same programme record.`,
    ...comparisons.map(
      (comparison) =>
        `- [${comparisonTitle(comparison.programmes)}](${url(buildPath("comparison", { slug: comparison.slug }))})`,
    ),

    `## Questions answered`,
    `- [All questions](${url(buildPath("faqIndex"))})`,
    ...answeredInFull.map(
      (faq) =>
        `- [${faq.question}](${url(buildPath("faq", { slug: faq.slug! }))}): ${faq.answer[0]}`,
    ),

    `## About Multi Mulk`,
    `- [About](${url(buildPath("about"))})`,
    `- [Authors and reviewers](${url(buildPath("authors"))}): who writes and checks the advice on this site.`,
    `- [Investor protection](${url(buildPath("investorProtection"))})`,
    `- [Contact](${url(buildPath("contact"))})`,

    `## Recent articles`,
    ...articles.map(
      (article) =>
        `- [${article.title}](${url(buildPath("article", { slug: article.slug }))})`,
    ),

    `## Optional`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")}): every page in every language.`,
  ];

  return new Response(`${sections.join("\n\n").replace(/\n\n- /g, "\n- ")}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
