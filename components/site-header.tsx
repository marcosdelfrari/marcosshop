import Link from "next/link";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export function SiteHeader({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <header className="border-b border-border-soft">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <ThemeToggle
          lightLabel={dict.theme.light}
          darkLabel={dict.theme.dark}
        />

        <Link
          href={`/${lang}`}
          className="absolute left-1/2 -translate-x-1/2 text-center text-base font-semibold tracking-tight sm:text-lg"
        >
          <span className="font-bold">{siteConfig.shortName}</span>{" "}
          <span className="font-normal text-muted">
            {siteConfig.name.replace(siteConfig.shortName, "").trim()}
          </span>
        </Link>

        <LocaleSwitcher lang={lang} label={dict.locale.label} />
      </div>
    </header>
  );
}
