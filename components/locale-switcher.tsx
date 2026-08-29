"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/lib/i18n";

export function LocaleSwitcher({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const pathname = usePathname();

  function hrefFor(next: Locale) {
    const segments = pathname.split("/");
    segments[1] = next;
    return segments.join("/") || `/${next}`;
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">{label}</span>
      <select
        className="cursor-pointer appearance-none border-0 bg-transparent pr-5 font-medium text-foreground outline-none"
        value={lang}
        aria-label={label}
        onChange={(event) => {
          window.location.assign(hrefFor(event.target.value as Locale));
        }}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabels[locale]}
          </option>
        ))}
      </select>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        className="-ml-4 opacity-60"
        aria-hidden
      >
        <path
          d="M1 1l4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {/* Keep Link alternatives for crawlers */}
      <span className="sr-only">
        {locales.map((locale) => (
          <Link key={locale} href={hrefFor(locale)} hrefLang={locale}>
            {localeLabels[locale]}
          </Link>
        ))}
      </span>
    </label>
  );
}
