import { sendInquiryEmails } from "@/lib/inquiry-email";
import { parseInquiryRequest } from "@/lib/inquiry";
import { isLocale } from "@/lib/i18n";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const inquiry = parseInquiryRequest(body);
  if (!inquiry || !isLocale(inquiry.locale)) {
    return Response.json({ error: "Invalid inquiry payload" }, { status: 400 });
  }

  if (process.env.RECAPTCHA_SECRET_KEY?.trim()) {
    try {
      await verifyRecaptchaToken(inquiry.recaptchaToken ?? "", "inquiry");
    } catch {
      return Response.json(
        { error: "reCAPTCHA verification failed" },
        { status: 403 },
      );
    }
  }

  try {
    const result = await sendInquiryEmails(inquiry);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send inquiry emails";
    console.error("[inquiry]", message);
    return Response.json({ error: message }, { status: 502 });
  }
}
