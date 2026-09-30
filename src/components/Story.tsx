"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { STORY } from "@/config/wedding";
import StoryFrame from "./StoryFrame";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// "How we got here" — the emotional core. Six frames, 1→6 in order, single
// column on phone, alternating sides on desktop. The title mask-rises in
// (one of the only two kinetic-type moments on the site).
export default function Story() {
  const reduce = useReducedMotion();

  const head: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.05 } },
  };
  const line: Variants = {
    hidden: { y: reduce ? "0%" : "120%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };
  const fade: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-[14vh]">
      <motion.header
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
        variants={head}
        className="mb-[10vh] text-center"
      >
        <h2 className="font-display text-sec-title font-light text-ink">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} className="block">
              How we got here
            </motion.span>
          </span>
        </h2>
        <motion.p variants={fade} className="mt-4 text-sm text-sage">
          Six frames, in the order she wanted them told.
        </motion.p>
      </motion.header>

      <div className="space-y-[10vh] md:space-y-[16vh]">
        {STORY.map((frame, i) => (
          <StoryFrame key={frame.src} frame={frame} index={i} />
        ))}
      </div>
    </section>
  );
}
