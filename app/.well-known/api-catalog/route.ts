import {
  API_CATALOG_CONTENT_TYPE,
  buildApiCatalogLinkset,
} from "@/lib/api-catalog";

export function GET() {
  return Response.json(buildApiCatalogLinkset(), {
    headers: {
      "Content-Type": API_CATALOG_CONTENT_TYPE,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
