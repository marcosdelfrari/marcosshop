import {
  handleMcpPost,
  MCP_CORS_HEADERS,
} from "@/lib/mcp-server";

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: MCP_CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  return handleMcpPost(request);
}

export function GET() {
  return Response.json(
    {
      name: "Marcos Lucas Shop MCP",
      transport: "streamable-http",
      methods: ["POST"],
      discovery: "/.well-known/mcp/server-card.json",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        ...MCP_CORS_HEADERS,
      },
    },
  );
}
