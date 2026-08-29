import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { InquiryDialog } from "@/components/inquiry-dialog";
import type { Locale } from "@/lib/i18n";
import { formatPrice, getWorkCover, type Work } from "@/lib/works";

export function WorkCard({
  work,
  lang,
  dict,
}: {
  work: Work;
  lang: Locale;
  dict: Dictionary;
}) {
  const content = work.content[lang];
  const mediumLabel = dict.works.mediums[work.medium];

  return (
    <article className="grid gap-6 border-b border-border-soft py-10 last:border-b-0 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
      <Link
        href={`/${lang}/works/${work.slug}`}
        className="group block w-full self-start"
      >
        <Image
          src={getWorkCover(work)}
          alt={content.title}
          width={1200}
          height={1200}
          className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </Link>

      <div className="flex flex-col justify-center gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted">
            <span>{work.year}</span>
            <span aria-hidden>·</span>
            <span>{work.dimensions}</span>
            <span aria-hidden>·</span>
            <span>{work.unique ? dict.works.unique : dict.works.edition}</span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            <Link
              href={`/${lang}/works/${work.slug}`}
              className="hover:underline underline-offset-4"
            >
              {content.title}
            </Link>
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-muted sm:text-[0.95rem]">
            {content.description.split("\n\n")[0]}
          </p>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm">
          <span className="text-lg font-semibold tracking-tight">
            {formatPrice(work.price, lang)}
          </span>
          <span className="rounded-md bg-badge px-2.5 py-1 text-xs font-medium text-badge-fg">
            {mediumLabel}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/${lang}/works/${work.slug}`}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background-elevated px-6 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            {dict.works.viewWork}
          </Link>
          <InquiryDialog
            lang={lang}
            workTitle={content.title}
            workSlug={work.slug}
            labels={dict.inquiry}
            privacyLabel={dict.nav.privacy}
            triggerLabel={
              work.available ? dict.works.inquire : dict.works.unavailable
            }
            disabled={!work.available}
          />
        </div>
      </div>
    </article>
  );
}
