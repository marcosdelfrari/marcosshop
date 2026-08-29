import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { notFound } from "next/navigation";

import { getDictionary } from "@/app/[lang]/dictionaries";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildHomeMetadata, SITE_URL } from "@/lib/seo";
import { AI_CATALOG_URL } from "@/lib/ai-catalog";
import { siteConfig } from "@/lib/site";
import { buildWebMcpInitScript } from "@/lib/webmcp";

import "../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);

  return {
    ...buildHomeMetadata(lang, dict.meta.title, dict.meta.description),
    title: {
      default: dict.meta.title,
      template: `%s · ${siteConfig.name}`,
    },
    metadataBase: new URL(SITE_URL),
  };
}

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch {}
})();
`;

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          dangerouslySetInnerHTML={{
            __html: buildWebMcpInitScript(lang as Locale),
          }}
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM discovery" />
        <link rel="ai-catalog" href={AI_CATALOG_URL} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans text-foreground">
        <GoogleAnalytics />
        <SiteHeader lang={lang as Locale} dict={dict} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          {children}
        </main>
        <SiteFooter lang={lang as Locale} dict={dict} />
      </body>
    </html>
  );
}
