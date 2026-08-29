import Link from "next/link";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";

export function SiteFooter({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="border-t border-border-soft">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-12">
        <nav className="mb-4 flex items-center justify-center gap-6 text-sm">
          <Link
            href={`/${lang}`}
            className="text-muted transition-colors hover:text-foreground"
          >
            {dict.nav.works}
          </Link>
          <Link
            href={`/${lang}/about`}
            className="text-muted transition-colors hover:text-foreground"
          >
            {dict.nav.about}
          </Link>
        </nav>
        <p className="text-center text-xs text-muted">{dict.footer.credit}</p>
      </div>
    </footer>
  );
}
