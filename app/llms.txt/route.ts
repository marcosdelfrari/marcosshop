import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms-txt";

export function GET(request: Request) {
  const url = new URL(request.url);
  const full = url.searchParams.get("full") === "1";
  const body = full ? buildLlmsFullTxt() : buildLlmsTxt();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
