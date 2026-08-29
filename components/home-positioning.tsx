import type { Dictionary } from "@/app/[lang]/dictionaries";

export function HomePositioning({ dict }: { dict: Dictionary }) {
  return (
    <section
      aria-labelledby="positioning-title"
      className="max-w-3xl space-y-4 border-y border-border-soft py-10"
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
  );
}
