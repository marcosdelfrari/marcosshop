export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

type SiteVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyRecaptchaToken(
  token: string,
  expectedAction?: string,
): Promise<void> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    throw new Error("RECAPTCHA_SECRET_KEY is not configured");
  }

  if (!token) {
    throw new Error("Missing reCAPTCHA token");
  }

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = (await response.json()) as SiteVerifyResponse;

  if (!data.success) {
    throw new Error("reCAPTCHA verification failed");
  }

  if (typeof data.score === "number" && data.score < MIN_SCORE) {
    throw new Error("reCAPTCHA score too low");
  }

  if (expectedAction && data.action && data.action !== expectedAction) {
    throw new Error("reCAPTCHA action mismatch");
  }
}
