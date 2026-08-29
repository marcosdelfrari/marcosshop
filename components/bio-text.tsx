import type { ReactNode } from "react";

import { siteConfig } from "@/lib/site";

/** Replaces `{name}`, `{age}`, and `{portfolio}` (as a link) in a template string. */
export function renderBioText(
  template: string,
  values: { name: string; age?: number },
  linkClassName = "font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70",
): ReactNode[] {
  const withValues = template
    .replaceAll("{name}", values.name)
    .replaceAll("{age}", values.age != null ? String(values.age) : "");

  const parts = withValues.split("{portfolio}");

  if (parts.length === 1) return [withValues];

  const nodes: ReactNode[] = [];
  parts.forEach((part, index) => {
    if (part) nodes.push(part);
    if (index < parts.length - 1) {
      nodes.push(
        <a
          key={`portfolio-${index}`}
          href={siteConfig.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          marcosdelfrari.com
        </a>,
      );
    }
  });

  return nodes;
}
