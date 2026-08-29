import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getLocaleFromAcceptLanguage, locales } from "@/lib/i18n";
import { acceptsMarkdown } from "@/lib/markdown-for-agents";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    if (acceptsMarkdown(request.headers)) {
      const url = request.nextUrl.clone();
      url.pathname = `/api/markdown${pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }

  const locale = getLocaleFromAcceptLanguage(
    request.headers.get("accept-language"),
  );

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|mcp|favicon.ico|.*\\..*).*)"],
};
