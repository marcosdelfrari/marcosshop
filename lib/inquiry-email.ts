import "server-only";

import { Resend } from "resend";

import type { InquiryRequest } from "@/lib/inquiry";
import type { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

const DEFAULT_NOTIFY_EMAIL = "afk.marcos@gmail.com";
const DEFAULT_FROM = "Marcos Lucas Shop <orders@shop.marcosdelfrari.com>";

function resendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

function notifyEmail(): string {
  return process.env.ORDER_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_EMAIL;
}

function workUrl(slug: string, locale: Locale): string {
  return `${SITE_URL}/${locale}/works/${slug}`;
}

function buildOwnerOrderEmail(inquiry: InquiryRequest) {
  const url = workUrl(inquiry.workSlug, inquiry.locale as Locale);

  return {
    subject: `New purchase request — ${inquiry.workTitle}`,
    html: `
      <h1>New purchase request</h1>
      <p>A visitor submitted a purchase inquiry on the shop.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Work</strong></td><td>${escapeHtml(inquiry.workTitle)}</td></tr>
        <tr><td><strong>Slug</strong></td><td>${escapeHtml(inquiry.workSlug)}</td></tr>
        <tr><td><strong>URL</strong></td><td><a href="${url}">${url}</a></td></tr>
        <tr><td><strong>Name</strong></td><td>${escapeHtml(inquiry.name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(inquiry.email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(inquiry.phone)}</td></tr>
        <tr><td><strong>Language</strong></td><td>${escapeHtml(inquiry.locale)}</td></tr>
      </table>
      <p>The customer also received a confirmation email and was directed to WhatsApp to continue the conversation.</p>
    `.trim(),
    text: [
      "New purchase request",
      "",
      `Work: ${inquiry.workTitle}`,
      `Slug: ${inquiry.workSlug}`,
      `URL: ${url}`,
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Phone: ${inquiry.phone}`,
      `Language: ${inquiry.locale}`,
    ].join("\n"),
  };
}

type CustomerCopy = {
  subject: string;
  greeting: string;
  body: string[];
  closing: string;
};

const customerCopy: Record<Locale, CustomerCopy> = {
  en: {
    subject: "Your purchase request was received",
    greeting: "Hello",
    body: [
      "Thank you for your interest in my work. Your purchase request has been received successfully.",
      "I will review the exclusivity of the piece and get back to you to confirm availability, price and shipping.",
      "You can also continue the conversation on WhatsApp — I reply personally.",
    ],
    closing: "Marcos Lucas",
  },
  es: {
    subject: "Tu solicitud de compra fue recibida",
    greeting: "Hola",
    body: [
      "Gracias por tu interés en mi obra. Tu solicitud de compra fue recibida con éxito.",
      "Revisaré la exclusividad de la pieza y me pondré en contacto contigo para confirmar disponibilidad, precio y envío.",
      "También puedes continuar la conversación por WhatsApp — respondo personalmente.",
    ],
    closing: "Marcos Lucas",
  },
  fr: {
    subject: "Votre demande d'achat a bien été reçue",
    greeting: "Bonjour",
    body: [
      "Merci pour votre intérêt pour mon travail. Votre demande d'achat a bien été reçue.",
      "Je vais vérifier l'exclusivité de la pièce et vous recontacter pour confirmer la disponibilité, le prix et la livraison.",
      "Vous pouvez aussi poursuivre la conversation sur WhatsApp — je réponds personnellement.",
    ],
    closing: "Marcos Lucas",
  },
  de: {
    subject: "Ihre Kaufanfrage wurde empfangen",
    greeting: "Hallo",
    body: [
      "Vielen Dank für Ihr Interesse an meiner Arbeit. Ihre Kaufanfrage wurde erfolgreich empfangen.",
      "Ich prüfe die Exklusivität des Werks und melde mich bei Ihnen, um Verfügbarkeit, Preis und Versand zu bestätigen.",
      "Sie können das Gespräch auch per WhatsApp fortsetzen — ich antworte persönlich.",
    ],
    closing: "Marcos Lucas",
  },
};

function buildCustomerConfirmationEmail(inquiry: InquiryRequest) {
  const copy = customerCopy[inquiry.locale as Locale] ?? customerCopy.en;
  const url = workUrl(inquiry.workSlug, inquiry.locale as Locale);

  const htmlBody = copy.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");

  return {
    subject: copy.subject,
    html: `
      <p>${copy.greeting} ${escapeHtml(inquiry.name)},</p>
      ${htmlBody}
      <p><strong>${escapeHtml(inquiry.workTitle)}</strong><br />
      <a href="${url}">${url}</a></p>
      <p>${escapeHtml(copy.closing)}</p>
    `.trim(),
    text: [
      `${copy.greeting} ${inquiry.name},`,
      "",
      ...copy.body,
      "",
      inquiry.workTitle,
      url,
      "",
      copy.closing,
    ].join("\n"),
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendInquiryEmails(inquiry: InquiryRequest) {
  const resend = resendClient();
  const from = fromAddress();
  const owner = buildOwnerOrderEmail(inquiry);
  const customer = buildCustomerConfirmationEmail(inquiry);

  const [ownerResult, customerResult] = await Promise.all([
    resend.emails.send({
      from,
      to: notifyEmail(),
      replyTo: inquiry.email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    }),
    resend.emails.send({
      from,
      to: inquiry.email,
      replyTo: notifyEmail(),
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    }),
  ]);

  if (ownerResult.error) {
    throw new Error(ownerResult.error.message);
  }

  if (customerResult.error) {
    throw new Error(customerResult.error.message);
  }

  return {
    ownerId: ownerResult.data?.id,
    customerId: customerResult.data?.id,
  };
}
