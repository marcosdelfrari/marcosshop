import { createHash } from "crypto";

import { locales } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { works } from "@/lib/works";

export const AGENT_SKILLS_SCHEMA =
  "https://schemas.agentskills.io/discovery/0.2.0/schema.json";

type SkillDefinition = {
  name: string;
  description: string;
  body: string;
};

function buildSkillMarkdown(skill: SkillDefinition): string {
  return `---\nname: ${skill.name}\ndescription: ${skill.description}\n---\n\n${skill.body.trim()}\n`;
}

function sha256Digest(content: string): string {
  const hash = createHash("sha256").update(content, "utf8").digest("hex");
  return `sha256:${hash}`;
}

const workSlugs = works.map((work) => work.slug).join(", ");

const SKILL_DEFINITIONS: SkillDefinition[] = [
  {
    name: "browse-catalog",
    description:
      "Browse original prints and paintings by Marcos Lucas using MCP tools or markdown content negotiation. Use when listing works, reading artwork details, or fetching shop pages as markdown.",
    body: `# Browse Catalogue

## When to use

Activate when the user wants to explore available artworks, compare pieces, or read work details from the Marcos Lucas shop.

## MCP tools

Connect to \`${absoluteUrl("/mcp")}\` (Streamable HTTP) and use:

- \`list_works\` — catalogue summary with slug, medium, year, price, availability
- \`get_work\` — full details for one work (pass \`slug\`, optional \`locale\`)

Supported locales: ${locales.join(", ")}.

## Markdown pages

Send \`Accept: text/markdown\` to any localized page:

- \`/${locales[0]}\` — home and works list
- \`/${locales[0]}/about\` — artist bio and FAQ
- \`/${locales[0]}/works/{slug}\` — work detail

Available slugs: ${workSlugs}.

Responses include YAML frontmatter, markdown body, and JSON-LD blocks.

## HTML fallback

Omit the \`Accept\` header to receive the normal HTML site.`,
  },
  {
    name: "purchase-inquiry",
    description:
      "Guide a visitor through inquiring about an artwork via WhatsApp. Use when the user wants to buy, check availability, shipping to Europe, or price in EUR.",
    body: `# Purchase Inquiry

## When to use

Activate when the user wants to buy a work, ask about availability, shipping, or pricing.

## Flow

1. Identify the work (slug or title). Use the \`browse-catalog\` skill or MCP \`get_work\` if needed.
2. Confirm the piece is available (\`available: true\`).
3. Collect name, email, and phone if the user wants help drafting a message.
4. Open WhatsApp: \`https://wa.me/${siteConfig.whatsappNumber}\`

Include in the message:

- Work title and slug
- User name and contact details
- Shipping country (UK/EU)

## Policies

- No automated checkout — Marcos replies personally on WhatsApp
- Works ship unframed from Brazil to Europe
- Prices are listed in EUR; final shipping is agreed in conversation
- Every listed piece is an original handmade work (no open-edition reproductions)

## Privacy

Inquiry details are sent via WhatsApp, not stored on the shop server. Privacy policy: \`${absoluteUrl(`/${locales[0]}/privacy`)}\``,
  },
  {
    name: "shop-discovery",
    description:
      "Discover all agent-facing endpoints for the Marcos Lucas art shop — llms.txt, API catalog, MCP server card, agent skills index, sitemap, and health checks.",
    body: `# Shop Discovery

## When to use

Activate when you need machine-readable entry points for ${SITE_NAME} without browsing HTML.

## Discovery endpoints

| Resource | URL |
|----------|-----|
| LLM discovery | ${absoluteUrl("/llms.txt")} |
| Agent skills index | ${absoluteUrl("/.well-known/agent-skills/index.json")} |
| AI catalog (ARD) | ${absoluteUrl("/.well-known/ai-catalog.json")} |
| API catalog (RFC 9727) | ${absoluteUrl("/.well-known/api-catalog")} |
| MCP server card | ${absoluteUrl("/.well-known/mcp/server-card.json")} |
| MCP endpoint | ${absoluteUrl("/mcp")} |
| OpenAPI (markdown API) | ${absoluteUrl("/api/markdown/openapi.json")} |
| Health | ${absoluteUrl("/api/health")} |
| Sitemap | ${absoluteUrl("/sitemap.xml")} |
| Robots | ${absoluteUrl("/robots.txt")} |

## Content signals

\`ai-train=no, search=yes, ai-input=yes\`

## Canonical site

${SITE_URL} — locales: ${locales.join(", ")}`,
  },
];

export type ResolvedAgentSkill = {
  name: string;
  description: string;
  content: string;
  url: string;
  digest: string;
};

export function getAgentSkills(): ResolvedAgentSkill[] {
  return SKILL_DEFINITIONS.map((skill) => {
    const content = buildSkillMarkdown(skill);
    return {
      name: skill.name,
      description: skill.description,
      content,
      url: `/.well-known/agent-skills/${skill.name}/SKILL.md`,
      digest: sha256Digest(content),
    };
  });
}

export function buildAgentSkillsIndex() {
  return {
    $schema: AGENT_SKILLS_SCHEMA,
    skills: getAgentSkills().map(({ name, description, url, digest }) => ({
      name,
      type: "skill-md" as const,
      description,
      url,
      digest,
    })),
  };
}

export function getAgentSkill(name: string): ResolvedAgentSkill | undefined {
  return getAgentSkills().find((skill) => skill.name === name);
}

export const AGENT_SKILLS_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
} as const;
