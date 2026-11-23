import { siteConfig } from "@/lib/site";

export type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  workTitle: string;
  workSlug: string;
  locale: string;
};

export function buildWhatsAppUrl(payload: InquiryPayload): string {
  const lines =
    payload.locale === "pt"
      ? [
          `Olá! Tenho interesse na obra "${payload.workTitle}".`,
          "",
          `Nome: ${payload.name}`,
          `E-mail: ${payload.email}`,
          `Telefone: ${payload.phone}`,
          `Obra: ${payload.workSlug}`,
          `Idioma: ${payload.locale}`,
        ]
      : [
          `Hello! I'm interested in "${payload.workTitle}".`,
          "",
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Phone: ${payload.phone}`,
          `Work: ${payload.workSlug}`,
          `Language: ${payload.locale}`,
        ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}
