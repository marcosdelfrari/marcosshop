import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n";
import { defaultLocale, locales } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import type { Work } from "@/lib/works";
import { getWorkCover, getWorkImages } from "@/lib/works";

export const SITE_NAME = siteConfig.name;

export function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return "https://shop.marcosdelfrari.com";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
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
  keywords?: string[];
};

export function buildPageMetadata({
  locale,
  title,
  description,
  pathSuffix = "",
  type = "website",
  ogImagePath,
  noindex = false,
  keywords,
}: PageMetadataOptions): Metadata {
  const alternates = buildAlternates(locale, pathSuffix);
  const ogImage = ogImagePath
    ? absoluteUrl(ogImagePath)
    : absoluteUrl("/works/oni.webp");

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
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
  return buildPageMetadata({
    locale,
    title,
    description,
    keywords: siteKeywords[locale],
  });
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

export function buildOrganizationJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: siteDescriptions[locale],
    slogan: siteTaglines[locale],
    logo: absoluteUrl("/works/oni.webp"),
    sameAs: [siteConfig.portfolioUrl, siteConfig.social.instagram],
    areaServed: ["European Union", "United Kingdom"],
    knowsAbout: knowsAbout[locale],
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
    image: absoluteUrl("/avatar.png"),
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
    genre: workGenres[locale],
    artform: mediumLabel,
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

const workGenres: Record<Locale, string> = {
  en: "Conceptual art",
  es: "Arte conceptual",
  fr: "Art conceptuel",
  de: "Konzeptuelle Kunst",
};

const siteDescriptions: Record<Locale, string> = {
  en: "Personal space for hand-made woodcuts, linoleum prints and acrylic paintings by Marcos Lucas. Work accumulated over the years. Unique pieces from Brazil, shipped across Europe.",
  es: "Espacio personal para xilografías, linóleos y pinturas hechas a mano por Marcos Lucas. Obra acumulada a lo largo de los años. Piezas únicas desde Brasil, con envío a Europa.",
  fr: "Espace personnel pour xylographies, linogravures et peintures faites main par Marcos Lucas. Œuvres accumulées au fil des années. Pièces uniques du Brésil, expédiées en Europe.",
  de: "Persönlicher Raum für handgemachte Holzschnitte, Linoldrucke und Acrylgemälde von Marcos Lucas. Werke, die über die Jahre entstanden sind. Einzelstücke aus Brasilien, Versand in Europa.",
};

const siteTaglines: Record<Locale, string> = {
  en: "Few pieces, made by hand. Work from life.",
  es: "Pocas piezas, hechas a mano. Obra de la vida.",
  fr: "Peu de pièces, faites à la main. Œuvre de vie.",
  de: "Wenige Stücke, von Hand gemacht. Arbeit aus dem Leben.",
};

const siteKeywords: Record<Locale, string[]> = {
  en: [
    "conceptual art",
    "indie art",
    "alternative art",
    "artist-run shop",
    "original woodcut",
    "linoleum print",
    "hand-pulled print",
    "Brazilian artist",
    "contemporary printmaking",
    "buy art Europe",
  ],
  es: [
    "arte conceptual",
    "arte indie",
    "arte alternativo",
    "tienda del artista",
    "xilografía original",
    "grabado en linóleo",
    "artista brasileño",
    "grabado contemporáneo",
    "comprar arte Europa",
  ],
  fr: [
    "art conceptuel",
    "art indie",
    "art alternatif",
    "boutique d'artiste",
    "xylographie originale",
    "linogravure",
    "artiste brésilien",
    "estampe contemporaine",
    "acheter art Europe",
  ],
  de: [
    "konzeptuelle kunst",
    "indie kunst",
    "alternative kunst",
    "künstler shop",
    "originaler holzschnitt",
    "linoldruck",
    "brasilianischer künstler",
    "zeitgenössische druckgrafik",
    "kunst kaufen europa",
  ],
};

const collectionTitles: Record<Locale, string> = {
  en: "Original prints & paintings from life",
  es: "Grabados y pinturas originales de la vida",
  fr: "Estampes et peintures originales de la vie",
  de: "Originaldrucke & Gemälde aus dem Leben",
};

const jobTitles: Record<Locale, string> = {
  en: "Visual artist & front-end engineer",
  es: "Artista visual e ingeniero front-end",
  fr: "Artiste visuel et ingénieur front-end",
  de: "Visueller Künstler & Front-end-Entwickler",
};

const knowsAbout: Record<Locale, string[]> = {
  en: [
    "Conceptual art",
    "Indie art",
    "Alternative art",
    "Woodcut printmaking",
    "Linoleum printmaking",
    "Acrylic painting",
    "Japanese folklore",
    "Brazilian contemporary art",
  ],
  es: [
    "Arte conceptual",
    "Arte indie",
    "Arte alternativo",
    "Xilografía",
    "Grabado en linóleo",
    "Pintura acrílica",
    "Folclore japonés",
    "Arte contemporáneo brasileño",
  ],
  fr: [
    "Art conceptuel",
    "Art indie",
    "Art alternatif",
    "Xylographie",
    "Linogravure",
    "Peinture acrylique",
    "Folklore japonais",
    "Art contemporain brésilien",
  ],
  de: [
    "Konzeptuelle Kunst",
    "Indie-Kunst",
    "Alternative Kunst",
    "Holzschnitt",
    "Linoldruck",
    "Acrylmalerei",
    "Japanische Folklore",
    "Brasilianische zeitgenössische Kunst",
  ],
};
