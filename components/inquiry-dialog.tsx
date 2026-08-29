"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { executeRecaptcha, isRecaptchaEnabled, preloadRecaptcha } from "@/lib/recaptcha-client";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const defaultTriggerClassName =
  "inline-flex h-12 min-w-[12rem] cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-40";

type InquiryDialogProps = {
  lang: Locale;
  workTitle: string;
  workSlug: string;
  labels: Dictionary["inquiry"];
  privacyLabel: string;
  triggerLabel: string;
  triggerClassName?: string;
  disabled?: boolean;
};

export function InquiryDialog({
  lang,
  workTitle,
  workSlug,
  labels,
  privacyLabel,
  triggerLabel,
  triggerClassName,
  disabled,
}: InquiryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open() {
    setError(null);
    preloadRecaptcha();
    dialogRef.current?.showModal();
    setVisible(true);
  }

  function close() {
    if (reduce) {
      dialogRef.current?.close();
      setVisible(false);
      return;
    }

    setVisible(false);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      workTitle,
      workSlug,
      locale: lang,
    };

    try {
      let recaptchaToken: string | undefined;
      if (isRecaptchaEnabled()) {
        recaptchaToken = await executeRecaptcha("inquiry");
      }

      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        const message = data?.error;
        if (message === "reCAPTCHA verification failed") {
          throw new Error(labels.captchaError);
        }
        throw new Error(message ?? labels.submitError);
      }

      const url = buildWhatsAppUrl(payload);
      window.open(url, "_blank", "noopener,noreferrer");
      setName("");
      setEmail("");
      setPhone("");
      close();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : labels.submitError,
      );
    } finally {
      setSubmitting(false);
    }
  }

  const panelMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 10, scale: 0.98 },
        animate: visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 10, scale: 0.98 },
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
        onAnimationComplete: () => {
          if (!visible) dialogRef.current?.close();
        },
      };

  return (
    <>
      <button
        type="button"
        onClick={open}
        disabled={disabled}
        className={triggerClassName ?? defaultTriggerClassName}
      >
        {!disabled && <ShoppingCart size={18} aria-hidden />}
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed inset-0 m-auto w-[min(100%-2rem,28rem)] rounded-xl border border-border-soft bg-background-elevated p-0 text-foreground shadow-2xl backdrop:bg-black/40"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <motion.form
          {...panelMotion}
          onSubmit={onSubmit}
          className="flex flex-col gap-5 p-6"
        >
          <div className="space-y-2">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {labels.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              {labels.subtitle}
            </p>
            <p className="text-sm font-medium">{workTitle}</p>
          </div>

          <div className="space-y-3">
            <Field
              label={labels.name}
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={setName}
            />
            <Field
              label={labels.email}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={setEmail}
            />
            <Field
              label={labels.phone}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={setPhone}
            />
          </div>

          <p className="text-xs leading-relaxed text-muted">
            {labels.privacyNotice}{" "}
            <Link
              href={`/${lang}/privacy`}
              className="font-medium text-foreground underline underline-offset-2"
            >
              {privacyLabel}
            </Link>
            .
          </p>

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          {isRecaptchaEnabled() ? (
            <p className="text-[11px] leading-relaxed text-muted">
              {labels.recaptchaNotice}{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {labels.recaptchaPrivacy}
              </a>{" "}
              {labels.recaptchaAnd}{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {labels.recaptchaTerms}
              </a>
              .
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={close}
              disabled={submitting}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-border bg-transparent px-4 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:opacity-50"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <ShoppingCart size={18} aria-hidden />
              {submitting ? labels.submitting : labels.submit}
            </button>
          </div>
        </motion.form>
      </dialog>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <label className="block space-y-1.5 text-sm" htmlFor={id}>
      <span className="font-medium">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-border-soft bg-background px-3 outline-none ring-foreground/20 transition focus:ring-2"
      />
    </label>
  );
}
