"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WEDDING, HERO_IMAGE } from "@/config/wedding";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// Full-bleed photo 6 with a slow zoom + a dark scrim. The entrance is THE
// orchestrated moment: eyebrow → Leon → & → Favour → rule → meta, staggered,
// beginning as the loader clears (`start`).
export default function Hero({ start }: { start: boolean }) {
  const reduce = useReducedMotion();
  const go = start || reduce;

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.2,
        delayChildren: reduce ? 0 : 0.15,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };

  const rule: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    show: { scaleX: 1, opacity: 1, transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* background photo — slow 1.08 → 1 zoom once the hero is live */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: reduce ? 1 : 1.08 }}
        animate={{ scale: go && !reduce ? 1 : reduce ? 1 : 1.08 }}
        transition={{ duration: 9, ease: "linear" }}
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />
      </motion.div>

      {/* scrim: keep white text legible over any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />

      {/* content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={go ? "show" : "hidden"}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))] text-center text-paper"
      >
        <motion.p
          variants={item}
          className="mb-6 text-[0.7rem] font-medium uppercase tracking-[0.26em] text-paper/75"
        >
          Together with their families
        </motion.p>

        <h1 className="font-display text-hero-name font-light leading-[0.94]">
          <motion.span variants={item} className="block">
            {WEDDING.groom}
          </motion.span>
          <motion.span
            variants={item}
            className="my-1 block text-[0.42em] font-normal text-lime"
          >
            &amp;
          </motion.span>
          <motion.span variants={item} className="block">
            {WEDDING.bride}
          </motion.span>
        </h1>

        <motion.span
          variants={rule}
          aria-hidden
          className="mt-7 block h-[3px] w-[50px] origin-center rounded-full bg-lime"
        />

        <motion.p
          variants={item}
          className="mt-6 text-sm tracking-wide text-paper/85"
        >
          {WEDDING.dateDisplay} · {WEDDING.venue}
        </motion.p>
      </motion.div>

      {/* quiet scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: go ? 1 : 0 }}
        transition={{ duration: 0.8, delay: reduce ? 0 : 1.6, ease: EASE }}
        className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-2 text-paper/70"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px bg-paper/40" />
      </motion.div>
    </section>
  );
}
