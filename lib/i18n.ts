export const locales = ["en", "es", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromAcceptLanguage(
  header: string | null,
): Locale {
  if (!header) return defaultLocale;

  const preferred = header.split(",").map((part) => {
    const [tag, ...params] = part.trim().split(";");
    const q = params
      .find((p) => p.trim().startsWith("q="))
      ?.split("=")[1];
    return {
      tag: tag.toLowerCase(),
      q: q ? Number(q) : 1,
    };
  });

  preferred.sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return defaultLocale;
}
