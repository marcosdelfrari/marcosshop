"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean;
};

export function FadeUp({
  children,
  className,
  delay = 0,
  inView = false,
}: FadeUpProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const transition = { duration: 0.65, ease, delay };
  const from = { opacity: 0, y: 14 };
  const to = { opacity: 1, y: 0 };

  if (inView) {
    return (
      <motion.div
        className={className}
        initial={from}
        whileInView={to}
        viewport={{ once: true, margin: "-40px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={from}
      animate={to}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

export const fadeUpStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};
