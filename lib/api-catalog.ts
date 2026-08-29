import { locales } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { works } from "@/lib/works";

const RFC9727_PROFILE = "https://www.rfc-editor.org/info/rfc9727";

type LinksetLink = {
  href: string;
  type?: string;
};

type LinksetEntry = {
  anchor: string;
  "service-desc"?: LinksetLink[];
  "service-doc"?: LinksetLink[];
  status?: LinksetLink[];
};

export function buildApiCatalogLinkset(): { linkset: LinksetEntry[] } {
  return {
    linkset: [
      {
        anchor: absoluteUrl("/api/markdown"),
        "service-desc": [
          {
            href: absoluteUrl("/api/markdown/openapi.json"),
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: absoluteUrl("/api/markdown/doc"),
            type: "text/markdown",
          },
        ],
        status: [
          {
            href: absoluteUrl("/api/health"),
            type: "application/json",
          },
        ],
      },
    ],
  };
}

export function buildOpenApiSpec() {
  const workSlugs = works.map((work) => work.slug);
  const localeEnum = [...locales];

  const localizedPaths = [
    ...localeEnum.map((lang) => ({
      path: `/${lang}`,
      summary: "Home page (markdown)",
    })),
    ...localeEnum.map((lang) => ({
      path: `/${lang}/about`,
      summary: "About page (markdown)",
    })),
    ...localeEnum.map((lang) => ({
      path: `/${lang}/privacy`,
      summary: "Privacy policy (markdown)",
    })),
    ...localeEnum.flatMap((lang) =>
      workSlugs.map((slug) => ({
        path: `/${lang}/works/${slug}`,
        summary: `Work detail — ${slug} (markdown)`,
      })),
    ),
  ];

  const paths: Record<string, unknown> = {
    "/api/health": {
      get: {
        operationId: "getHealth",
        summary: "API health check",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status", "timestamp"],
                  properties: {
                    status: { type: "string", enum: ["ok"] },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  for (const { path, summary } of localizedPaths) {
    paths[path] = {
      get: {
        operationId: `getMarkdown${path.replace(/[^a-zA-Z0-9]/g, "_")}`,
        summary,
        description:
          "Returns a markdown representation of the page. Send `Accept: text/markdown`. HTML is returned when the header is absent.",
        parameters: [
          {
            name: "Accept",
            in: "header",
            required: true,
            schema: { type: "string", example: "text/markdown" },
          },
        ],
        responses: {
          "200": {
            description: "Markdown page content",
            headers: {
              "Content-Type": {
                schema: { type: "string", example: "text/markdown; charset=utf-8" },
              },
              "x-markdown-tokens": {
                schema: { type: "integer" },
                description: "Estimated token count of the markdown body",
              },
              Vary: {
                schema: { type: "string", example: "Accept" },
              },
            },
            content: {
              "text/markdown": {
                schema: { type: "string" },
              },
            },
          },
          "404": {
            description: "Page not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                },
              },
            },
          },
        },
      },
    };
  }

  return {
    openapi: "3.1.0",
    info: {
      title: `${SITE_NAME} — Markdown for Agents API`,
      version: "1.0.0",
      description:
        "Content negotiation API that returns markdown representations of shop pages for AI agents and automated clients.",
    },
    servers: [{ url: SITE_URL }],
    paths,
  };
}

export function buildApiDoc(): string {
  const lines = [
    `# ${SITE_NAME} — Markdown for Agents API`,
    "",
    "Returns markdown versions of HTML pages when clients send `Accept: text/markdown`.",
    "HTML remains the default for browsers.",
    "",
    "## Base URL",
    "",
    SITE_URL,
    "",
    "## Authentication",
    "",
    "None — all endpoints are public.",
    "",
    "## Content negotiation",
    "",
    "Add the header:",
    "",
    "```",
    "Accept: text/markdown",
    "",
    "```",
    "",
    "Responses include:",
    "",
    "- `Content-Type: text/markdown; charset=utf-8`",
    "- `Vary: Accept`",
    "- `x-markdown-tokens` — estimated token count",
    "- `Content-Signal: ai-train=no, search=yes, ai-input=yes`",
    "",
    "## Endpoints",
    "",
    "| Path | Description |",
    "|------|-------------|",
    ...locales.flatMap((lang) => [
      `| \`/${lang}\` | Home — works catalogue |`,
      `| \`/${lang}/about\` | About the artist |`,
      `| \`/${lang}/privacy\` | Privacy policy |`,
      ...works.map(
        (work) =>
          `| \`/${lang}/works/${work.slug}\` | ${work.content[lang].title} |`,
      ),
    ]),
    "",
    "## Health",
    "",
    "`GET /api/health` — returns `{ \"status\": \"ok\", \"timestamp\": \"...\" }`",
    "",
    "## OpenAPI",
    "",
    `\`${absoluteUrl("/api/markdown/openapi.json")}\``,
    "",
    "## Discovery",
    "",
    `- Agent skills: \`${absoluteUrl("/.well-known/agent-skills/index.json")}\``,
    `- AI catalog (ARD): \`${absoluteUrl("/.well-known/ai-catalog.json")}\``,
    `- API catalog (RFC 9727): \`${absoluteUrl("/.well-known/api-catalog")}\``,
    `- MCP server card: \`${absoluteUrl("/.well-known/mcp/server-card.json")}\``,
    `- MCP endpoint: \`${absoluteUrl("/mcp")}\``,
    `- LLM discovery: \`${absoluteUrl("/llms.txt")}\``,
    "",
  ];

  return lines.join("\n");
}

export const API_CATALOG_CONTENT_TYPE =
  `application/linkset+json; profile="${RFC9727_PROFILE}"`;
