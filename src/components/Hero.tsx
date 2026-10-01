"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WEDDING, HERO_IMAGE } from "@/config/wedding";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// Full-bleed photo 6. The loader→hero is ONE continuous move: as the loader
// dissolves the photo scales 1.15→1.0 and the scrim fades in, the loader
// becomes the hero. Names rise out of masks (not fades); the rule draws; the
// meta rises. Then a very slow ambient zoom keeps the photo alive.
export default function Hero({ start }: { start: boolean }) {
  const reduce = useReducedMotion();
  const go = start || reduce;

  // Line mask-rise, sequenced by index (avoids nested-stagger pitfalls).
  const line: Variants = {
    hidden: { y: reduce ? "0%" : "115%" },
    show: (i: number) => ({
      y: "0%",
      transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.1 + i * 0.12, ease: EASE },
    }),
  };

  const rule: Variants = {
    hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.1 + 4 * 0.12, ease: EASE },
    },
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* background photo, crossed handoff scale then slow ambient zoom.
          Keyframes: 1.15 (loader) → 1.0 (~1.8s settle) → 1.04 (12s ambient). */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={{ scale: reduce ? 1 : 1.15 }}
        animate={{ scale: reduce ? 1 : go ? [1.15, 1.0, 1.04] : 1.15 }}
        transition={{ duration: 13.8, times: [0, 0.13, 1], ease: EASE }}
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

      {/* scrim fades in with the handoff so text stays legible over the photo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10"
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: go ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 1.2, ease: EASE }}
      />

      {/* content cascade */}
      <motion.div
        initial="hidden"
        animate={go ? "show" : "hidden"}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))] text-center text-paper"
      >
        <span className="mb-6 block overflow-hidden">
          <motion.span
            variants={line}
            custom={0}
            className="block text-[0.7rem] font-medium uppercase tracking-[0.26em] text-paper/75"
          >
            Together with their families
          </motion.span>
        </span>

        <h1 className="font-display text-hero-name font-light leading-[0.94]">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} custom={1} className="block">
              {WEDDING.groom}
            </motion.span>
          </span>
          <span className="block overflow-hidden py-[0.04em]">
            <motion.span
              variants={line}
              custom={2}
              className="block text-[0.42em] font-normal text-lime"
            >
              &amp;
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} custom={3} className="block">
              {WEDDING.bride}
            </motion.span>
          </span>
        </h1>

        <motion.span
          variants={rule}
          aria-hidden
          className="mt-7 block h-[3px] w-[50px] origin-center rounded-full bg-lime"
        />

        <span className="mt-6 block overflow-hidden">
          <motion.span
            variants={line}
            custom={5}
            className="block text-sm tracking-wide text-paper/85"
          >
            {WEDDING.dateDisplay}
          </motion.span>
        </span>
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
