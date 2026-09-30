"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// The house reveal: a section block rises into place once (opacity + 40px).
// Fired on SECTION BLOCKS, not every child — staggering every item is the
// generated-page tell. Renders final state instantly under reduced-motion.
export default function SectionReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
