import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary } from "@/app/[lang]/dictionaries";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { WorkGallery } from "@/components/work-gallery";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { formatPrice, getWork, getWorkImages, works } from "@/lib/works";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    works.map((work) => ({ lang, slug: work.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/works/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const work = getWork(slug);
  if (!work) return {};

  const content = work.content[lang];
  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      images: getWorkImages(work),
    },
  };
}

export default async function WorkPage({
  params,
}: PageProps<"/[lang]/works/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const work = getWork(slug);
  if (!work) notFound();

  const dict = await getDictionary(lang as Locale);
  const content = work.content[lang as Locale];
  const mediumLabel = dict.works.mediums[work.medium];

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Link
        href={`/${lang}`}
        className="inline-flex text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {dict.works.title}
      </Link>

      <WorkGallery images={getWorkImages(work)} title={content.title} />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted">
            <span>{work.year}</span>
            <span aria-hidden>·</span>
            <span>{work.dimensions}</span>
            <span aria-hidden>·</span>
            <span>{work.unique ? dict.works.unique : dict.works.edition}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.title}
          </h1>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y border-border-soft py-4">
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {formatPrice(work.price, lang as Locale)}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted">{dict.works.medium}:</span>
              <span className="rounded-md bg-badge px-2.5 py-1 text-xs font-medium text-badge-fg">
                {mediumLabel}
              </span>
            </div>
          </div>

          <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted">
            {content.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <InquiryDialog
          lang={lang as Locale}
          workTitle={content.title}
          workSlug={work.slug}
          labels={dict.inquiry}
          triggerLabel={
            work.available ? dict.works.inquire : dict.works.unavailable
          }
          disabled={!work.available}
          triggerClassName="inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[14rem]"
        />
      </div>
    </article>
  );
}
