"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { fadeUpItem, fadeUpStagger } from "@/components/fade-up";
import type { Locale } from "@/lib/i18n";

export function HomeHero({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="pt-1 pb-0 sm:pt-2 sm:pb-2 lg:pt-6">
      <motion.div
        className="grid gap-3.5 sm:gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16"
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
        variants={fadeUpStagger}
      >
        <div>
          <motion.p
            variants={fadeUpItem}
            className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-muted sm:text-[0.7rem] sm:tracking-[0.28em]"
          >
            {dict.hero.kicker}
          </motion.p>

          <motion.h1
            variants={fadeUpItem}
            className="mt-2.5 text-[clamp(2.15rem,8vw,4.25rem)] leading-[0.96] tracking-[-0.03em] sm:mt-4 lg:mt-5"
          >
            <span className="block font-semibold">{dict.hero.titleStrong}</span>
            <span className="block font-normal text-muted/80">
              {dict.hero.titleSoft}
            </span>
          </motion.h1>
        </div>

        <motion.div
          variants={fadeUpItem}
          className="flex flex-col gap-6 lg:gap-8 lg:pb-2"
        >
          <p className="max-w-xs text-sm leading-relaxed text-muted sm:hidden">
            {dict.hero.taglineShort}
          </p>
          <p className="hidden max-w-sm text-base leading-relaxed text-muted sm:block sm:text-lg lg:ml-auto lg:text-right">
            {dict.hero.tagline}
          </p>

          <div className="hidden md:block lg:ml-auto">
            <Link
              href={`/${lang}#works`}
              className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-foreground"
            >
              {dict.hero.cta}
              <motion.span
                aria-hidden
                className="inline-block"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
