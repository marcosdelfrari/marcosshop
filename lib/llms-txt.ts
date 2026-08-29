import { dnsAidOwnerNames } from "@/lib/dns-aid";
import { locales, type Locale } from "@/lib/i18n";
import { absoluteUrl, localizedPath, SITE_NAME, SITE_URL } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { works } from "@/lib/works";

export function buildLlmsTxt(): string {
  const lines: string[] = [
    `# ${SITE_NAME} — Original Prints & Paintings`,
    "",
    "> Personal space for hand-made woodcuts, linoleum prints and acrylic paintings.",
    "> Work accumulated over the years by Marcos Lucas (Belo Horizonte, Brazil).",
    "> Ships unframed to Europe. Direct WhatsApp inquiry.",
    "",
    "> SEO keywords (not site copy): conceptual art, indie art, alternative art",
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
    "## FAQ topics (see /about JSON-LD FAQPage)",
    "",
    "- What this shop is (personal space for life's work)",
    "- How buying works (direct WhatsApp)",
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
    `- Agent skills: ${absoluteUrl("/.well-known/agent-skills/index.json")}`,
    `- AI catalog (ARD): ${absoluteUrl("/.well-known/ai-catalog.json")}`,
    `- API catalog: ${absoluteUrl("/.well-known/api-catalog")}`,
    `- MCP server card: ${absoluteUrl("/.well-known/mcp/server-card.json")}`,
    `- MCP endpoint: ${absoluteUrl("/mcp")}`,
    `- DNS-AID (HTTPS/SVCB): ${dnsAidOwnerNames().join(", ")}`,
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
