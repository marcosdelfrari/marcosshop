import { buildOpenApiSpec } from "@/lib/api-catalog";

export function GET() {
  return Response.json(buildOpenApiSpec(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
