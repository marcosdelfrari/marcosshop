import { dnsAidOwnerNames } from "@/lib/dns-aid";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const AI_CATALOG_SPEC_VERSION = "1.0";

export const AI_CATALOG_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
} as const;

type CatalogEntry = {
  identifier: string;
  displayName: string;
  type: string;
  url: string;
  description?: string;
  capabilities?: string[];
  representativeQueries: string[];
};

function hostDomain(): string {
  return new URL(SITE_URL).hostname;
}

function urn(namespace: string, name: string): string {
  return `urn:air:${hostDomain()}:${namespace}:${name}`;
}

export function buildAiCatalog() {
  const entries: CatalogEntry[] = [
    {
      identifier: urn("mcp", "shop"),
      displayName: "Marcos Lucas Shop MCP",
      type: "application/mcp-server-card+json",
      url: absoluteUrl("/.well-known/mcp/server-card.json"),
      description:
        "Streamable HTTP MCP server for browsing original prints and paintings.",
      capabilities: ["list_works", "get_work", "get_discovery"],
      representativeQueries: [
        "list available woodcut and linoleum prints in the shop",
        "get details about the ONI artwork",
        "what MCP tools does the Marcos Lucas shop expose",
      ],
    },
    {
      identifier: urn("skills", "index"),
      displayName: "Agent Skills Index",
      type: "application/agent-skills+json",
      url: absoluteUrl("/.well-known/agent-skills/index.json"),
      description:
        "Agent Skills discovery index for catalogue browsing, purchase inquiry, and shop discovery.",
      representativeQueries: [
        "how do I browse the art catalogue as an agent",
        "what agent skills does shop.marcosdelfrari.com publish",
        "guide a user through WhatsApp art purchase inquiry",
      ],
    },
    {
      identifier: urn("api", "markdown"),
      displayName: "Markdown for Agents API",
      type: "application/linkset+json",
      url: absoluteUrl("/.well-known/api-catalog"),
      description:
        "RFC 9727 API catalog for markdown content negotiation on shop pages.",
      representativeQueries: [
        "fetch the about page as markdown for AI agents",
        "where is the OpenAPI spec for the markdown API",
        "discover HTTP APIs published by the Marcos Lucas shop",
      ],
    },
    {
      identifier: urn("api", "openapi"),
      displayName: "Markdown API OpenAPI",
      type: "application/openapi+json",
      url: absoluteUrl("/api/markdown/openapi.json"),
      description: "OpenAPI 3.1 description of markdown content negotiation endpoints.",
      representativeQueries: [
        "OpenAPI schema for shop page markdown endpoints",
        "machine-readable API definition for Accept text/markdown pages",
        "what paths support markdown responses on the art shop",
      ],
    },
    {
      identifier: urn("discovery", "llms"),
      displayName: "LLM Discovery",
      type: "text/plain",
      url: absoluteUrl("/llms.txt"),
      description:
        "llms.txt discovery document with catalogue summary and agent endpoints.",
      representativeQueries: [
        "llms.txt for Marcos Lucas art shop",
        "what is this shop about for language models",
        "find agent discovery links for original prints and paintings",
      ],
    },
    {
      identifier: urn("discovery", "dns-aid"),
      displayName: "DNS for AI Discovery",
      type: "application/dns-aid+json",
      url: absoluteUrl("/.well-known/ai-catalog.json"),
      description:
        "DNS-AID SVCB/HTTPS records under _agents for resolver-based agent discovery.",
      capabilities: dnsAidOwnerNames(),
      representativeQueries: [
        "discover Marcos Lucas shop agents via DNS-AID",
        "what _agents SVCB records does shop.marcosdelfrari.com publish",
        "DNS discovery entry point for the art shop MCP server",
      ],
    },
  ];

  return {
    specVersion: AI_CATALOG_SPEC_VERSION,
    host: {
      displayName: `${SITE_NAME} Shop`,
      identifier: `did:web:${hostDomain()}`,
    },
    entries,
  };
}

export const AI_CATALOG_URL = absoluteUrl("/.well-known/ai-catalog.json");
