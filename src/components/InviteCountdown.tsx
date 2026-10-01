"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WEDDING } from "@/config/wedding";
import { useCountdown } from "@/hooks/useCountdown";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// Warm italic invitation line, then a 4-cell countdown (numerals in --lime-deep,
// tabular-nums so they don't jitter). Cells mask-rise once on reveal, then just
// tick. SSR-safe: em-dashes until mounted / if the date is invalid — never NaN.
export default function InviteCountdown() {
  const reduce = useReducedMotion();
  const t = useCountdown(WEDDING.dateISO);

  const cells = [
    { v: t.days, l: "Days" },
    { v: t.hours, l: "Hours" },
    { v: t.minutes, l: "Minutes" },
    { v: t.seconds, l: "Seconds" },
  ];

  const row: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.1 } },
  };
  const cell: Variants = {
    hidden: { y: reduce ? "0%" : "110%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 0.8, ease: EASE } },
  };
  const fade: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-[14vh] text-center">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
        variants={fade}
      >
        <p className="mx-auto max-w-[22ch] font-display text-[clamp(1.4rem,5vw,2.1rem)] font-light italic leading-[1.5] text-ink-soft">
          He asked. She said yes. Now we&rsquo;d love for you to be there when we
          say &ldquo;I&nbsp;do.&rdquo;
        </p>
      </motion.div>

      {t.isPast ? (
        <p className="mt-14 font-display text-[clamp(1.6rem,6vw,2.4rem)] font-light text-ink">
          Today is the day.
        </p>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={row}
          className="mx-auto mt-14 grid max-w-md grid-cols-4 gap-3"
        >
          {cells.map((c) => (
            <div key={c.l} className="text-center">
              <span className="block overflow-hidden pb-[0.05em]">
                <motion.span
                  variants={cell}
                  className="block font-display text-count-num font-normal text-lime-deep [font-variant-numeric:tabular-nums]"
                >
                  {c.v}
                </motion.span>
              </span>
              <span className="mt-2 block text-[0.6rem] font-medium uppercase tracking-[0.2em] text-sage">
                {c.l}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      <p className="mt-12 text-xs font-medium uppercase tracking-[0.24em] text-sage">
        {WEDDING.hashtag}
      </p>
    </section>
  );
}
