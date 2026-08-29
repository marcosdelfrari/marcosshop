import Link from "next/link";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { AvatarVideo } from "@/components/avatar-video";
import { renderBioText } from "@/components/bio-text";
import { FadeUp } from "@/components/fade-up";
import { SocialLinks } from "@/components/social-links";
import type { Locale } from "@/lib/i18n";
import { getAge, profile } from "@/lib/profile";
import { siteConfig } from "@/lib/site";

export function AboutPreview({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="border-t border-border-soft pt-16">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
        <FadeUp inView>
          <AvatarVideo />
        </FadeUp>

        <FadeUp inView delay={0.08}>
          <p className="text-base leading-relaxed text-foreground/90 sm:text-[1.05rem]">
            {renderBioText(dict.about.homeIntro, {
              name: siteConfig.shortName,
              age: getAge(profile.birthdate),
            })}
          </p>
        </FadeUp>

        <FadeUp inView delay={0.14}>
          <SocialLinks className="justify-center" />
        </FadeUp>

        <FadeUp inView delay={0.2}>
          <Link
            href={`/${lang}/about`}
            className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {dict.about.readMore}
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
