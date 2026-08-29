import { locales, type Locale } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { formatPrice, getWork, works } from "@/lib/works";

export const MCP_SERVER_NAME = "com.marcosdelfrari/shop";
export const MCP_SERVER_VERSION = "1.0.0";
export const MCP_PROTOCOL_VERSION = "2024-11-05";

export function buildMcpServerCard() {
  return {
    serverInfo: {
      name: MCP_SERVER_NAME,
      version: MCP_SERVER_VERSION,
      description:
        "Browse original prints and paintings by Marcos Lucas — list works, read details, and fetch agent discovery metadata.",
    },
    transport: {
      type: "streamable-http",
      endpoint: absoluteUrl("/mcp"),
    },
    capabilities: {
      tools: { listChanged: false },
      resources: {},
      prompts: {},
    },
  };
}

export const MCP_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Mcp-Session-Id, Authorization",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
} as const;

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number;
  method?: string;
  params?: Record<string, unknown>;
};

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export function getMcpTools(): ToolDefinition[] {
  return [
    {
      name: "list_works",
      description:
        "List available original prints and paintings in the shop catalogue.",
      inputSchema: {
        type: "object",
        properties: {
          locale: {
            type: "string",
            enum: [...locales],
            description: "Language for titles and prices (default: en).",
          },
        },
      },
    },
    {
      name: "get_work",
      description: "Get full details for a single work by slug.",
      inputSchema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "Work slug, e.g. oni, demon, curva-da-felicidade.",
          },
          locale: {
            type: "string",
            enum: [...locales],
            description: "Language for content (default: en).",
          },
        },
        required: ["slug"],
      },
    },
    {
      name: "get_discovery",
      description:
        "Return agent discovery links (llms.txt, API catalog, sitemap, server card).",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ];
}

function textContent(text: string) {
  return {
    content: [{ type: "text", text }],
  };
}

function resolveLocale(value: unknown): Locale {
  if (typeof value === "string" && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return "en";
}

async function callMcpTool(
  name: string,
  args: Record<string, unknown> = {},
) {
  switch (name) {
    case "list_works": {
      const locale = resolveLocale(args.locale);
      const lines = works.map((work) => {
        const content = work.content[locale];
        return `- ${content.title} (${work.slug}) — ${work.medium}, ${work.year}, ${formatPrice(work.price, locale)}, available: ${work.available}`;
      });

      return textContent(
        [
          `${SITE_NAME} — available works (${locale})`,
          "",
          ...lines,
          "",
          `Shop: ${SITE_URL}/${locale}`,
        ].join("\n"),
      );
    }

    case "get_work": {
      const slug = typeof args.slug === "string" ? args.slug : "";
      const locale = resolveLocale(args.locale);
      const work = getWork(slug);

      if (!work) {
        return {
          isError: true,
          content: [{ type: "text", text: `Work not found: ${slug}` }],
        };
      }

      const content = work.content[locale];
      return textContent(
        [
          `# ${content.title}`,
          "",
          `- Slug: ${work.slug}`,
          `- Medium: ${work.medium}`,
          `- Year: ${work.year}`,
          `- Dimensions: ${work.dimensions}`,
          `- Price: ${formatPrice(work.price, locale)}`,
          `- Available: ${work.available}`,
          `- URL: ${absoluteUrl(`/${locale}/works/${work.slug}`)}`,
          "",
          content.description,
          "",
          `WhatsApp inquiry: https://wa.me/${siteConfig.whatsappNumber}`,
        ].join("\n"),
      );
    }

    case "get_discovery":
      return textContent(
        [
          `${SITE_NAME} — agent discovery`,
          "",
          `- Site: ${SITE_URL}`,
          `- LLM discovery: ${absoluteUrl("/llms.txt")}`,
          `- Agent skills: ${absoluteUrl("/.well-known/agent-skills/index.json")}`,
          `- AI catalog: ${absoluteUrl("/.well-known/ai-catalog.json")}`,
          `- API catalog: ${absoluteUrl("/.well-known/api-catalog")}`,
          `- MCP server card: ${absoluteUrl("/.well-known/mcp/server-card.json")}`,
          `- OpenAPI: ${absoluteUrl("/api/markdown/openapi.json")}`,
          `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
          `- MCP endpoint: ${absoluteUrl("/mcp")}`,
          `- Health: ${absoluteUrl("/api/health")}`,
          "",
          "Markdown pages: send Accept: text/markdown to any /{lang}/... page.",
        ].join("\n"),
      );

    default:
      return {
        isError: true,
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
      };
  }
}

function jsonRpcResult(id: string | number | undefined, result: unknown) {
  return Response.json(
    { jsonrpc: "2.0", id, result },
    { headers: MCP_CORS_HEADERS },
  );
}

function jsonRpcError(
  id: string | number | undefined,
  code: number,
  message: string,
) {
  return Response.json(
    { jsonrpc: "2.0", id, error: { code, message } },
    { headers: MCP_CORS_HEADERS },
  );
}

export async function handleMcpPost(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonRpcError(undefined, -32700, "Parse error");
  }

  const messages = Array.isArray(payload) ? payload : [payload];
  const requestMessage = messages.find(
    (entry): entry is JsonRpcRequest =>
      typeof entry === "object" &&
      entry !== null &&
      "method" in entry &&
      "id" in entry,
  );

  if (!requestMessage?.method) {
    const notification = messages.find(
      (entry): entry is JsonRpcRequest =>
        typeof entry === "object" &&
        entry !== null &&
        "method" in entry &&
        !("id" in entry && entry.id !== undefined),
    );

    if (notification?.method === "notifications/initialized") {
      return new Response(null, { status: 202, headers: MCP_CORS_HEADERS });
    }

    return jsonRpcError(undefined, -32600, "Invalid Request");
  }

  const { method, id, params = {} } = requestMessage;

  if (method === "initialize") {
    return Response.json(
      {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: MCP_PROTOCOL_VERSION,
          capabilities: {
            tools: { listChanged: false },
          },
          serverInfo: {
            name: MCP_SERVER_NAME,
            version: MCP_SERVER_VERSION,
          },
        },
      },
      {
        headers: {
          ...MCP_CORS_HEADERS,
          "Mcp-Session-Id": crypto.randomUUID(),
        },
      },
    );
  }

  if (method === "tools/list") {
    return jsonRpcResult(id, { tools: getMcpTools() });
  }

  if (method === "tools/call") {
    const toolName = typeof params.name === "string" ? params.name : "";
    const toolArgs =
      typeof params.arguments === "object" && params.arguments !== null
        ? (params.arguments as Record<string, unknown>)
        : {};

    const result = await callMcpTool(toolName, toolArgs);
    return jsonRpcResult(id, result);
  }

  if (method === "ping") {
    return jsonRpcResult(id, {});
  }

  return jsonRpcError(id, -32601, `Method not found: ${method}`);
}
