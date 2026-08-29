export const siteConfig = {
  name: "Marcos Lucas",
  shortName: "Marcos",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.marcosdelfrari.com",
  portfolioUrl: "https://marcosdelfrari.com",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5531994369932",
  social: {
    instagram: "https://www.instagram.com/marcosdelfrari",
  },
} as const;
