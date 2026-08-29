import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary } from "@/app/[lang]/dictionaries";
import { JsonLd } from "@/components/json-ld";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  buildBreadcrumbJsonLd,
  buildPrivacyMetadata,
  localizedPath,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return buildPrivacyMetadata(lang, dict.privacy.title, dict.privacy.summary);
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: siteConfig.name, path: localizedPath(lang as Locale) },
    { name: dict.privacy.title, path: localizedPath(lang as Locale, "privacy") },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      <article className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-3">
          <Link
            href={`/${lang}`}
            className="inline-flex text-sm text-muted transition-colors hover:text-foreground"
          >
            ← {dict.works.viewAll}
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {dict.privacy.title}
          </h1>
          <p className="text-sm text-muted">{dict.privacy.updated}</p>
          <p className="text-base leading-relaxed text-muted">
            {dict.privacy.summary}
          </p>
        </header>

        <div className="space-y-8">
          {dict.privacy.sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted sm:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="border-t border-border-soft pt-6 text-sm text-muted">
          <p>{dict.privacy.contact}</p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            className="mt-2 inline-flex font-medium text-foreground underline underline-offset-2"
          >
            {dict.nav.contact}
          </a>
        </footer>
      </article>
    </>
  );
}
