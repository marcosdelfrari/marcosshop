import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { absoluteUrl, localizedPath } from "@/lib/seo";
import { works } from "@/lib/works";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(localizedPath(locale)),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, absoluteUrl(localizedPath(lang))]),
        ),
      },
    });

    entries.push({
      url: absoluteUrl(localizedPath(locale, "about")),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [
            lang,
            absoluteUrl(localizedPath(lang, "about")),
          ]),
        ),
      },
    });

    entries.push({
      url: absoluteUrl(localizedPath(locale, "privacy")),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [
            lang,
            absoluteUrl(localizedPath(lang, "privacy")),
          ]),
        ),
      },
    });

    for (const work of works) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `works/${work.slug}`)),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((lang) => [
              lang,
              absoluteUrl(localizedPath(lang, `works/${work.slug}`)),
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
