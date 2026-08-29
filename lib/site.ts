const DEFAULT_SITE_URL = "https://shop.marcosdelfrari.com";

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv;

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) return `https://${vercelHost}`;

  return DEFAULT_SITE_URL;
}

export const siteConfig = {
  name: "Marcos Lucas",
  shortName: "Marcos",
  url: resolveSiteUrl(),
  portfolioUrl: "https://marcosdelfrari.com",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "5531994369932",
  social: {
    instagram: "https://www.instagram.com/marcosdelfrari",
  },
} as const;
