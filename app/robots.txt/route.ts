import { SITE_URL } from "@/lib/seo";

const CONTENT_SIGNAL = "ai-train=no, search=yes, ai-input=yes";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
] as const;

export function GET() {
  const lines: string[] = [
    "# robots.txt — Marcos Lucas Shop",
    "",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
  ];

  for (const bot of AI_BOTS) {
    lines.push(`User-agent: ${bot}`, "Allow: /", "Allow: /llms.txt", "");
  }

  lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
