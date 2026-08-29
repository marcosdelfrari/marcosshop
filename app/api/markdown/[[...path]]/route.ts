import { NextResponse } from "next/server";

import { isLocale } from "@/lib/i18n";
import {
  createMarkdownResponse,
  resolveMarkdownPage,
} from "@/lib/markdown-for-agents";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/markdown/[[...path]]">,
) {
  const segments = (await params).path ?? [];

  if (segments.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [lang, ...rest] = segments;
  if (!isLocale(lang)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const page = await resolveMarkdownPage(lang, rest);
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return createMarkdownResponse(page.markdown);
}
