import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n";
import { defaultLocale, locales } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import type { Work } from "@/lib/works";
import { getWorkCover, getWorkImages } from "@/lib/works";

export const SITE_NAME = siteConfig.name;

export function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const SITE_URL = normalizeSiteUrl(siteConfig.url);

const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
};

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function localizedPath(locale: Locale, suffix = ""): string {
  const path = suffix.startsWith("/") ? suffix : suffix ? `/${suffix}` : "";
  return `/${locale}${path}`;
}

export function buildAlternates(locale: Locale, suffix = "") {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(localizedPath(defaultLocale, suffix)),
  };

  for (const lang of locales) {
    languages[lang] = absoluteUrl(localizedPath(lang, suffix));
  }

  return {
    canonical: absoluteUrl(localizedPath(locale, suffix)),
    languages,
  };
}

function truncateDescription(text: string, max = 155): string {
  const plain = text.replace(/\n+/g, " ").trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max - 1).trimEnd()}…`;
}

type PageMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  pathSuffix?: string;
  type?: "website" | "article" | "profile";
  ogImagePath?: string;
  noindex?: boolean;
};

export function buildPageMetadata({
  locale,
  title,
  description,
  pathSuffix = "",
  type = "website",
  ogImagePath,
  noindex = false,
}: PageMetadataOptions): Metadata {
  const alternates = buildAlternates(locale, pathSuffix);
  const ogImage = ogImagePath
    ? absoluteUrl(ogImagePath)
    : absoluteUrl("/works/oni.webp");

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export function buildWorkMetadata(
  locale: Locale,
  work: Work,
  mediumLabel: string,
): Metadata {
  const content = work.content[locale];
  const description = truncateDescription(content.description);
  const cover = getWorkCover(work);

  return buildPageMetadata({
    locale,
    title: content.title,
    description,
    pathSuffix: `works/${work.slug}`,
    ogImagePath: cover || undefined,
  });
}

export function buildHomeMetadata(
  locale: Locale,
  title: string,
  description: string,
): Metadata {
  return buildPageMetadata({ locale, title, description });
}

export function buildAboutMetadata(
  locale: Locale,
  title: string,
  description: string,
): Metadata {
  return buildPageMetadata({
    locale,
    title,
    description: truncateDescription(description),
    pathSuffix: "about",
    type: "profile",
  });
}

export function buildPrivacyMetadata(
  locale: Locale,
  title: string,
  description: string,
): Metadata {
  return buildPageMetadata({
    locale,
    title,
    description: truncateDescription(description),
    pathSuffix: "privacy",
  });
}

// --- JSON-LD builders ---

type JsonLd = Record<string, unknown>;

export function buildWebSiteJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(localizedPath(locale)),
    description: siteDescriptions[locale],
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function buildOrganizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/works/oni.webp"),
    sameAs: [siteConfig.portfolioUrl, siteConfig.social.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: [...locales],
    },
  };
}

export function buildPersonJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE_NAME,
    url: absoluteUrl(localizedPath(locale, "about")),
    image: absoluteUrl("/avatar.webp"),
    jobTitle: jobTitles[locale],
    nationality: { "@type": "Country", name: "Brazil" },
    homeLocation: {
      "@type": "Place",
      name: "Belo Horizonte, Brazil",
    },
    sameAs: [siteConfig.portfolioUrl, siteConfig.social.instagram],
    knowsAbout: knowsAbout[locale],
  };
}

export function buildCollectionPageJsonLd(
  locale: Locale,
  works: Work[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collectionTitles[locale],
    url: absoluteUrl(localizedPath(locale)),
    description: siteDescriptions[locale],
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: works.length,
      itemListElement: works.map((work, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(localizedPath(locale, `works/${work.slug}`)),
        name: work.content[locale].title,
      })),
    },
  };
}

export function buildWorkJsonLd(
  locale: Locale,
  work: Work,
  mediumLabel: string,
): JsonLd {
  const content = work.content[locale];
  const images = getWorkImages(work).map((src) => absoluteUrl(src));
  const availability = work.available
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": ["VisualArtwork", "Product"],
    name: content.title,
    description: truncateDescription(content.description, 500),
    url: absoluteUrl(localizedPath(locale, `works/${work.slug}`)),
    image: images,
    artMedium: mediumLabel,
    dateCreated: String(work.year),
    width: work.dimensions,
    creator: { "@id": `${SITE_URL}/#person` },
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: work.price.amount,
      priceCurrency: work.price.currency,
      availability,
      url: absoluteUrl(localizedPath(locale, `works/${work.slug}`)),
      seller: { "@id": `${SITE_URL}/#organization` },
      eligibleRegion: {
        "@type": "Place",
        name: "European Union",
      },
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqJsonLd(
  faqs: readonly { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

const siteDescriptions: Record<Locale, string> = {
  en: "Original woodcuts, linoleum prints and handmade paintings by Marcos Lucas. Unique pieces shipped across Europe. Inquire via WhatsApp.",
  es: "Xilografías originales, grabados en linóleo y pinturas hechas a mano por Marcos Lucas. Piezas únicas con envío a Europa. Consulta por WhatsApp.",
  fr: "Xylographies originales, linogravures et peintures faites main par Marcos Lucas. Pièces uniques expédiées en Europe. Demande via WhatsApp.",
  de: "Originale Holzschnitte, Linoldrucke und handgemalte Werke von Marcos Lucas. Einzelstücke mit Versand in Europa. Anfrage per WhatsApp.",
};

const collectionTitles: Record<Locale, string> = {
  en: "Original prints & handmade works",
  es: "Grabados originales y obras hechas a mano",
  fr: "Estampes originales et œuvres faites main",
  de: "Originale Drucke & handgemachte Werke",
};

const jobTitles: Record<Locale, string> = {
  en: "Visual artist & front-end engineer",
  es: "Artista visual e ingeniero front-end",
  fr: "Artiste visuel et ingénieur front-end",
  de: "Visueller Künstler & Front-end-Entwickler",
};

const knowsAbout: Record<Locale, string[]> = {
  en: ["Woodcut", "Linoleum printmaking", "Acrylic painting", "Japanese folklore"],
  es: ["Xilografía", "Grabado en linóleo", "Pintura acrílica", "Folclore japonés"],
  fr: ["Xylographie", "Linogravure", "Peinture acrylique", "Folklore japonais"],
  de: ["Holzschnitt", "Linoldruck", "Acrylmalerei", "Japanische Folklore"],
};
