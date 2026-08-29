import { buildApiDoc } from "@/lib/api-catalog";

export function GET() {
  return new Response(buildApiDoc(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
