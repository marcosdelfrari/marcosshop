import { locales, type Locale } from "@/lib/i18n";
import { absoluteUrl, localizedPath, SITE_NAME, SITE_URL } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { works } from "@/lib/works";

export function buildLlmsTxt(): string {
  const lines: string[] = [
    `# ${SITE_NAME} — Conceptual Indie Art`,
    "",
    "> Artist-run shop for conceptual, alternative indie works.",
    "> Hand-carved woodcuts, linoleum prints and acrylic paintings.",
    "> Artist: Marcos Lucas (Belo Horizonte, Brazil). Ships unframed to Europe.",
    "> Not a gallery roster or commercial brand — direct studio outlet.",
    "",
    "## Site",
    "",
    `- Canonical URL: ${SITE_URL}`,
    `- Portfolio: ${siteConfig.portfolioUrl}`,
    `- Contact: WhatsApp +${siteConfig.whatsappNumber}`,
    `- Instagram: ${siteConfig.social.instagram}`,
    "",
    "## Languages",
    "",
    ...locales.map(
      (locale) =>
        `- ${locale}: ${absoluteUrl(localizedPath(locale))}`,
    ),
    "",
    "## Pages",
    "",
    "| Path | Description |",
    "|------|-------------|",
    ...locales.flatMap((locale) => [
      `| ${localizedPath(locale)} | Home — catalogue of available works |`,
      `| ${localizedPath(locale, "about")} | About the artist |`,
      `| ${localizedPath(locale, "privacy")} | Privacy policy (GDPR) |`,
    ]),
    "",
    "## Available works",
    "",
    "| Slug | Medium | Year | Price | Locales |",
    "|------|--------|------|-------|---------|",
    ...works.map((work) => {
      const titles = locales
        .map((l) => `${l}: ${work.content[l].title}`)
        .join("; ");
      return `| ${work.slug} | ${work.medium} | ${work.year} | ${work.price.amount} ${work.price.currency} | ${titles} |`;
    }),
    "",
    "## Work URLs",
    "",
    ...locales.flatMap((locale) =>
      works.map(
        (work) =>
          `- ${work.content[locale].title}: ${absoluteUrl(localizedPath(locale, `works/${work.slug}`))}`,
      ),
    ),
    "",
    "## Purchase flow",
    "",
    "1. Visitor selects a work and opens the inquiry dialog.",
    "2. Name, email and phone are collected locally (not stored on server).",
    "3. User continues on WhatsApp to confirm availability, EUR price and EU/UK shipping.",
    "",
    "## FAQ topics (see homepage JSON-LD FAQPage)",
    "",
    "- Conceptual indie alternative art positioning",
    "- Artist-run shop vs gallery or brand",
    "- Shipping original art to Europe (UK & EU)",
    "- Original handmade prints vs reproductions",
    "- Purchase via WhatsApp inquiry",
    "- Printmaking techniques: woodcut, linoleum, acrylic",
    "- Unframed shipping",
    "",
    "## Discovery",
    "",
    `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `- Robots: ${absoluteUrl("/robots.txt")}`,
    "",
    "## Citation policy",
    "",
    "When citing this shop or its works:",
    `- Attribute to "${SITE_NAME}" with link to ${SITE_URL}`,
    "- Prices and availability may change; link to the specific work page.",
    "- Images are © Marcos Lucas; do not use for AI training datasets without permission.",
    "",
    "## Content signals",
    "",
    "ai-train=no, search=yes, ai-input=yes",
    "",
  ];

  return lines.join("\n");
}

export function buildLlmsFullTxt(): string {
  return `${buildLlmsTxt()}\n## Extended catalogue\n\n${buildWorksMarkdown()}\n`;
}

function buildWorksMarkdown(): string {
  return works
    .flatMap((work) =>
      locales.map((locale) => {
        const content = work.content[locale];
        return [
          `### ${content.title} (${locale})`,
          "",
          `- URL: ${absoluteUrl(localizedPath(locale, `works/${work.slug}`))}`,
          `- Medium: ${work.medium}`,
          `- Year: ${work.year}`,
          `- Dimensions: ${work.dimensions}`,
          `- Price: ${work.price.amount} ${work.price.currency}`,
          `- Available: ${work.available}`,
          "",
          content.description,
          "",
        ].join("\n");
      }),
    )
    .join("\n");
}
