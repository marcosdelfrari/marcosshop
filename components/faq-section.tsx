import type { Locale } from "@/lib/i18n";
import { getFaqs } from "@/lib/faq";

export function FaqSection({
  lang,
  title,
}: {
  lang: Locale;
  title: string;
}) {
  const faqs = getFaqs(lang);

  return (
    <section id="faq" className="scroll-mt-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <div className="h-px w-full bg-border-soft" />
      </div>

      <dl className="divide-y divide-border-soft">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
            <dt className="text-base font-medium text-foreground">
              {faq.question}
            </dt>
            <dd className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
