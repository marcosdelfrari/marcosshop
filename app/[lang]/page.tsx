import { notFound } from "next/navigation";

import { getDictionary } from "@/app/[lang]/dictionaries";
import { AboutPreview } from "@/components/about-preview";
import { HomeHero } from "@/components/home-hero";
import { HomePositioning } from "@/components/home-positioning";
import { JsonLd } from "@/components/json-ld";
import { WorkCard } from "@/components/work-card";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  buildCollectionPageJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";
import { works } from "@/lib/works";

export default async function HomePage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <JsonLd
        data={[
          buildWebSiteJsonLd(lang as Locale),
          buildOrganizationJsonLd(lang as Locale),
          buildCollectionPageJsonLd(lang as Locale, works),
        ]}
      />

      <div className="flex flex-col gap-10 sm:gap-16 lg:gap-20">
        <div className="order-1">
          <HomeHero lang={lang as Locale} dict={dict} />
        </div>

        <HomePositioning dict={dict} className="order-3 md:order-2" />

        <section id="works" className="order-2 scroll-mt-8 space-y-2 md:order-3">
          <h2 className="text-xl font-semibold tracking-tight sm:text-3xl">
            {dict.works.title}
          </h2>
          <div className="h-px w-full bg-border-soft" />

          <div>
            {works.map((work) => (
              <WorkCard
                key={work.slug}
                work={work}
                lang={lang as Locale}
                dict={dict}
              />
            ))}
          </div>
        </section>

        <AboutPreview lang={lang as Locale} dict={dict} className="order-4" />
      </div>
    </>
  );
}
