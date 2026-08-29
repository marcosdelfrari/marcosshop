import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary } from "@/app/[lang]/dictionaries";
import { AvatarVideo } from "@/components/avatar-video";
import { renderBioText } from "@/components/bio-text";
import { FadeUp } from "@/components/fade-up";
import { JsonLd } from "@/components/json-ld";
import { WhatsAppIcon } from "@/components/social-icons";
import { SocialLinks } from "@/components/social-links";
import { isLocale, type Locale } from "@/lib/i18n";
import { getAge, profile } from "@/lib/profile";
import {
  buildAboutMetadata,
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  localizedPath,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return buildAboutMetadata(lang, dict.about.title, dict.about.body);
}

export default async function AboutPage({
  params,
}: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const age = getAge(profile.birthdate);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: siteConfig.name, path: localizedPath(lang as Locale) },
    { name: dict.about.title, path: localizedPath(lang as Locale, "about") },
  ]);

  return (
    <>
      <JsonLd data={[buildPersonJsonLd(lang as Locale), breadcrumbs]} />

      <article className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <FadeUp inView>
            <div className="overflow-hidden rounded-full">
              <AvatarVideo className="size-40 object-cover sm:size-48" />
            </div>
          </FadeUp>

          <FadeUp inView delay={0.08} className="space-y-3">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              {dict.about.kicker}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {siteConfig.name}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-foreground/90 sm:text-lg">
              {renderBioText(dict.about.intro, {
                name: siteConfig.shortName,
                age,
              })}
            </p>
          </FadeUp>

          <FadeUp
            inView
            delay={0.14}
            className="max-w-xl space-y-4 text-sm leading-relaxed text-muted sm:text-base"
          >
            {dict.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                {renderBioText(paragraph, {
                  name: siteConfig.shortName,
                  age,
                })}
              </p>
            ))}
          </FadeUp>

          <FadeUp inView delay={0.2}>
            <SocialLinks className="justify-center sm:justify-start" />
          </FadeUp>

          <FadeUp
            inView
            delay={0.24}
            className="w-full scroll-mt-8 space-y-4 border-t border-border-soft pt-8"
          >
            <section id="contact">
              <h2 className="text-xl font-semibold tracking-tight">
                {dict.nav.contact}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                {dict.about.contact}
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
                >
                  <WhatsAppIcon size={18} />
                  WhatsApp
                </a>
                <Link
                  href={`/${lang}`}
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium transition-colors hover:bg-foreground/5"
                >
                  {dict.works.viewAll}
                </Link>
              </div>
            </section>
          </FadeUp>
        </div>
      </article>
    </>
  );
}
