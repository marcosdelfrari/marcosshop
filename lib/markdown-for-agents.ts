import { getDictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getFaqs } from "@/lib/faq";
import { getAge, profile } from "@/lib/profile";
import {
  absoluteUrl,
  buildCollectionPageJsonLd,
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebSiteJsonLd,
  buildWorkJsonLd,
  localizedPath,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  formatPrice,
  getWork,
  getWorkCover,
  getWorkImages,
  works,
} from "@/lib/works";

const CONTENT_SIGNAL = "ai-train=no, search=yes, ai-input=yes";

type JsonLd = Record<string, unknown>;

type MarkdownPage = {
  markdown: string;
};

export function acceptsMarkdown(headers: Headers): boolean {
  const accept = headers.get("accept");
  if (!accept) return false;

  return accept.split(",").some((part) => {
    const [mediaType] = part.trim().split(";");
    return mediaType.trim().toLowerCase() === "text/markdown";
  });
}

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function buildFrontmatter(fields: {
  title?: string;
  description?: string;
  image?: string;
}): string {
  const lines: string[] = [];

  if (fields.title) lines.push(`title: ${yamlQuote(fields.title)}`);
  if (fields.description) lines.push(`description: ${yamlQuote(fields.description)}`);
  if (fields.image) lines.push(`image: ${yamlQuote(fields.image)}`);

  if (lines.length === 0) return "";
  return `---\n${lines.join("\n")}\n---\n\n`;
}

function appendJsonLdBlock(markdown: string, jsonLd: JsonLd[]): string {
  if (jsonLd.length === 0) return markdown;

  const json = jsonLd.map((entry) => JSON.stringify(entry, null, 2)).join("\n");
  return `${markdown}\n\n\`\`\`json\n${json}\n\`\`\`\n`;
}

function formatBioPlain(
  template: string,
  values: { name: string; age?: number },
): string {
  return template
    .replaceAll("{name}", values.name)
    .replaceAll("{age}", values.age != null ? String(values.age) : "")
    .replaceAll("{portfolio}", siteConfig.portfolioUrl);
}

function composePage(
  frontmatter: { title?: string; description?: string; image?: string },
  body: string,
  jsonLd: JsonLd[],
): MarkdownPage {
  const markdown = appendJsonLdBlock(
    `${buildFrontmatter(frontmatter)}${body.trim()}\n`,
    jsonLd,
  );

  return { markdown };
}

export function createMarkdownResponse(markdown: string): Response {
  const tokenCount = estimateTokenCount(markdown);

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "public, max-age=3600",
      "Content-Signal": CONTENT_SIGNAL,
      "x-markdown-tokens": String(tokenCount),
    },
  });
}

export async function buildHomeMarkdown(locale: Locale): Promise<MarkdownPage> {
  const dict = await getDictionary(locale);
  const title = dict.meta.title;
  const description = dict.meta.description;
  const image = absoluteUrl("/works/oni.webp");

  const workLines = works.map((work) => {
    const content = work.content[locale];
    const mediumLabel = dict.works.mediums[work.medium];
    return `- [${content.title}](${absoluteUrl(localizedPath(locale, `works/${work.slug}`))}) — ${mediumLabel}, ${work.year}, ${formatPrice(work.price, locale)}`;
  });

  const body = [
    `# ${dict.hero.titleStrong} ${dict.hero.titleSoft}`,
    "",
    formatBioPlain(dict.hero.intro, { name: siteConfig.shortName }),
    "",
    dict.hero.tagline,
    "",
    `## ${dict.positioning.title}`,
    "",
    ...dict.positioning.paragraphs,
    "",
    `## ${dict.works.title}`,
    "",
    ...workLines,
    "",
    formatBioPlain(dict.about.homeIntro, { name: siteConfig.shortName }),
    "",
    `[${dict.about.readMore}](${absoluteUrl(localizedPath(locale, "about"))})`,
  ].join("\n");

  return composePage({ title, description, image }, body, [
    buildWebSiteJsonLd(locale),
    buildOrganizationJsonLd(locale),
    buildCollectionPageJsonLd(locale, works),
  ]);
}

export async function buildAboutMarkdown(locale: Locale): Promise<MarkdownPage> {
  const dict = await getDictionary(locale);
  const age = getAge(profile.birthdate);
  const faqs = getFaqs(locale);
  const title = `${dict.about.title} · ${siteConfig.name}`;
  const description = dict.about.body;
  const image = absoluteUrl("/avatar.webp");

  const body = [
    `# ${siteConfig.name}`,
    "",
    `*${dict.about.kicker}*`,
    "",
    formatBioPlain(dict.about.intro, { name: siteConfig.shortName, age }),
    "",
    ...dict.about.paragraphs.map((paragraph) =>
      formatBioPlain(paragraph, { name: siteConfig.shortName, age }),
    ),
    "",
    `- Portfolio: ${siteConfig.portfolioUrl}`,
    `- Instagram: ${siteConfig.social.instagram}`,
    "",
    `## ${dict.faq.title}`,
    "",
    ...faqs.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
    `## ${dict.nav.contact}`,
    "",
    dict.about.contact,
    "",
    `[WhatsApp](https://wa.me/${siteConfig.whatsappNumber})`,
  ].join("\n");

  return composePage({ title, description, image }, body, [
    buildPersonJsonLd(locale),
    buildFaqJsonLd(faqs),
  ]);
}

export async function buildPrivacyMarkdown(locale: Locale): Promise<MarkdownPage> {
  const dict = await getDictionary(locale);
  const title = `${dict.privacy.title} · ${siteConfig.name}`;
  const description = dict.privacy.summary;

  const body = [
    `# ${dict.privacy.title}`,
    "",
    dict.privacy.updated,
    "",
    dict.privacy.summary,
    "",
    ...dict.privacy.sections.flatMap((section) => [
      `## ${section.title}`,
      "",
      ...section.paragraphs,
      "",
    ]),
    dict.privacy.contact,
    "",
    `[WhatsApp](https://wa.me/${siteConfig.whatsappNumber})`,
  ].join("\n");

  return composePage({ title, description }, body, []);
}

export async function buildWorkMarkdown(
  locale: Locale,
  slug: string,
): Promise<MarkdownPage | null> {
  const work = getWork(slug);
  if (!work) return null;

  const dict = await getDictionary(locale);
  const content = work.content[locale];
  const mediumLabel = dict.works.mediums[work.medium];
  const cover = getWorkCover(work);
  const image = cover ? absoluteUrl(cover) : undefined;

  const imageLines = getWorkImages(work).map(
    (src) => `![${content.title}](${absoluteUrl(src)})`,
  );

  const body = [
    `# ${content.title}`,
    "",
    `- Year: ${work.year}`,
    `- Dimensions: ${work.dimensions}`,
    `- Edition: ${work.unique ? dict.works.unique : dict.works.edition}`,
    `- ${dict.works.medium}: ${mediumLabel}`,
    `- ${dict.works.price}: ${formatPrice(work.price, locale)}`,
    `- Available: ${work.available ? "yes" : "no"}`,
    "",
    ...content.description.split("\n\n"),
    "",
    ...imageLines,
    "",
    work.available
      ? `[${dict.works.inquire}](https://wa.me/${siteConfig.whatsappNumber})`
      : dict.works.unavailable,
    "",
    `[← ${dict.works.title}](${absoluteUrl(localizedPath(locale))})`,
  ].join("\n");

  return composePage(
    {
      title: content.title,
      description: content.description.split("\n\n")[0],
      image,
    },
    body,
    [buildWorkJsonLd(locale, work, mediumLabel)],
  );
}

export async function resolveMarkdownPage(
  locale: Locale,
  segments: string[],
): Promise<MarkdownPage | null> {
  if (segments.length === 0) return buildHomeMarkdown(locale);
  if (segments.length === 1 && segments[0] === "about") {
    return buildAboutMarkdown(locale);
  }
  if (segments.length === 1 && segments[0] === "privacy") {
    return buildPrivacyMarkdown(locale);
  }
  if (segments.length === 2 && segments[0] === "works") {
    return buildWorkMarkdown(locale, segments[1]);
  }

  return null;
}
