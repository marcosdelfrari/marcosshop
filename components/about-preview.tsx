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
  className = "",
}: {
  lang: Locale;
  dict: Dictionary;
  className?: string;
}) {
  const age = getAge(profile.birthdate);

  return (
    <section className={`pt-4 md:border-t md:border-border-soft md:pt-16 ${className}`.trim()}>
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center sm:gap-6">
        <FadeUp inView>
          <AvatarVideo className="h-[132px] w-[132px] sm:h-[180px] sm:w-[180px]" />
        </FadeUp>

        <FadeUp inView delay={0.08}>
          <p className="text-sm leading-relaxed text-foreground/90 sm:hidden">
            {renderBioText(dict.about.homeIntroShort, {
              name: siteConfig.shortName,
              age,
            })}
          </p>
          <p className="hidden text-base leading-relaxed text-foreground/90 sm:block sm:text-[1.05rem]">
            {renderBioText(dict.about.homeIntro, {
              name: siteConfig.shortName,
              age,
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
