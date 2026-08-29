import {
  AI_CATALOG_CORS_HEADERS,
  buildAiCatalog,
} from "@/lib/ai-catalog";

export function GET() {
  return Response.json(buildAiCatalog(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...AI_CATALOG_CORS_HEADERS,
    },
  });
}

export function HEAD() {
  return new Response(null, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...AI_CATALOG_CORS_HEADERS,
    },
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: AI_CATALOG_CORS_HEADERS,
  });
}
