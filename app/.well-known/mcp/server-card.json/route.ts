import {
  buildMcpServerCard,
  MCP_CORS_HEADERS,
} from "@/lib/mcp-server";

export function GET() {
  return Response.json(buildMcpServerCard(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...MCP_CORS_HEADERS,
    },
  });
}
