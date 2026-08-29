import type { Locale } from "@/lib/i18n";

export type InquiryRequest = {
  name: string;
  email: string;
  phone: string;
  workTitle: string;
  workSlug: string;
  locale: Locale;
  recaptchaToken?: string;
};

export function parseInquiryRequest(body: unknown): InquiryRequest | null {
  if (!body || typeof body !== "object") return null;

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const phone = typeof record.phone === "string" ? record.phone.trim() : "";
  const workTitle =
    typeof record.workTitle === "string" ? record.workTitle.trim() : "";
  const workSlug =
    typeof record.workSlug === "string" ? record.workSlug.trim() : "";
  const locale =
    typeof record.locale === "string" ? record.locale.trim() : "";
  const recaptchaToken =
    typeof record.recaptchaToken === "string"
      ? record.recaptchaToken.trim()
      : undefined;

  if (!name || !email || !phone || !workTitle || !workSlug || !locale) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return {
    name,
    email,
    phone,
    workTitle,
    workSlug,
    locale: locale as Locale,
    recaptchaToken,
  };
}
