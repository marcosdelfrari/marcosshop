import type { Dictionary } from "@/app/[lang]/dictionaries";

export function HomePositioning({
  dict,
  className = "",
}: {
  dict: Dictionary;
  className?: string;
}) {
  return (
    <div className={className}>
      <details className="group border-y border-border-soft py-4 md:hidden">
        <summary className="flex list-none items-center justify-between gap-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
          <span>{dict.positioning.mobileSummary}</span>
          <span
            aria-hidden
            className="text-lg leading-none text-muted transition-transform duration-200 group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {dict.positioning.mobileNote}
        </p>
      </details>

      <section
        aria-labelledby="positioning-title"
        className="hidden max-w-3xl space-y-4 border-y border-border-soft py-10 md:block"
      >
        <h2
          id="positioning-title"
          className="text-lg font-semibold tracking-tight sm:text-xl"
        >
          {dict.positioning.title}
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted sm:text-base">
          {dict.positioning.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
