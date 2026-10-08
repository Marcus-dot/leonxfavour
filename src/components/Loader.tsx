"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WEDDING } from "@/config/wedding";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const MIN_MS = 1800; // felt, not skipped, also the counter's climb window
const MAX_MS = 5000; // hard safety: a slow asset never traps a guest

// Ivory overlay. The names are set at editorial title-page scale and each line
// RISES OUT OF A MASK (Leon → & → Favour, staggered), the signature "typeset"
// gesture, not a flat fade. A split 0→100 counter climbs in the corners (number
// bottom-left, % top-right). At dismiss the whole panel LIFTS to reveal the hero.
//
// Fluid clamp() sizing gives a genuinely different feel per screen: big, stacked
// and intimate on phones; wide and grand on desktop (names go side-by-side ≥800px).
//
// NOTE: this exits by lifting itself and calls onDone when the lift completes. In
// the parent <Intro>, REMOVE any `exit={{ opacity: 0 }}` on the loader, the lift
// is the exit now.
export default function Loader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [lifting, setLifting] = useState(false);
  const rafRef = useRef<number | null>(null);

  // ---- 0→100 counter, eased, over MIN_MS ----
  useEffect(() => {
    if (reduce) {
      setCount(100);
      return;
    }
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min((now - start) / MIN_MS, 1);
      setCount(Math.round(easeOutCubic(t) * 100));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduce]);

  // ---- Dismiss: window.load + MIN_MS, capped at MAX_MS; lift, then onDone ----
  useEffect(() => {
    const mounted = Date.now();
    let started = false;
    let minTimer: ReturnType<typeof setTimeout>;

    const startLift = () => {
      if (started) return;
      started = true;
      setLifting(true);
    };

    if (reduce) {
      const t = setTimeout(startLift, 400);
      return () => clearTimeout(t);
    }

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (Date.now() - mounted));
      minTimer = setTimeout(startLift, wait);
    };

    const hardCap = setTimeout(startLift, MAX_MS);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      clearTimeout(minTimer);
      clearTimeout(hardCap);
      window.removeEventListener("load", finish);
    };
  }, [reduce]);

  // mask-rise: a line in an overflow-hidden row, rising from 110%→0
  const rise = (delay: number) => ({
    initial: reduce ? { y: "0%" } : { y: "110%" },
    animate: { y: "0%" },
    transition: { duration: reduce ? 0 : 0.95, delay: reduce ? 0 : delay, ease: EASE },
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ivory px-[6vw]"
      initial={{ y: 0 }}
      animate={lifting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: reduce ? 0.4 : 1.1, ease: EASE }}
      onAnimationComplete={() => {
        if (lifting) onDone();
      }}
    >
      {/* split counter, corners */}
      <span className="pointer-events-none absolute bottom-[5vh] left-[6vw] font-display text-[clamp(2.5rem,7vw,4.5rem)] font-light leading-none text-ink [font-variant-numeric:tabular-nums]">
        {count}
      </span>
      <span className="pointer-events-none absolute right-[6vw] top-[5vh] font-display text-[clamp(1.4rem,4vw,2.2rem)] font-light italic text-ink">
        %
      </span>

      {/* names, editorial scale, each line rises out of a mask */}
      <div className="flex flex-col items-center leading-[0.9] md:flex-row md:items-baseline md:gap-[0.3em]">
        <span className="overflow-hidden px-[0.05em]">
          <motion.span
            className="block font-display text-[clamp(3.2rem,20vw,9rem)] font-light tracking-[-0.02em] text-ink"
            {...rise(0.15)}
          >
            {WEDDING.groom}
          </motion.span>
        </span>
        <span className="overflow-hidden">
          <motion.span
            className="my-[0.1em] block font-display text-[clamp(1.6rem,8vw,3.2rem)] font-light italic text-lime-deep md:my-0"
            {...rise(0.42)}
          >
            &amp;
          </motion.span>
        </span>
        <span className="overflow-hidden px-[0.05em]">
          <motion.span
            className="block font-display text-[clamp(3.2rem,20vw,9rem)] font-light tracking-[-0.02em] text-ink"
            {...rise(0.6)}
          >
            {WEDDING.bride}
          </motion.span>
        </span>
      </div>

      <motion.p
        className="mt-10 text-[0.66rem] uppercase tracking-[0.3em] text-sage"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduce ? 0 : 1, ease: EASE }}
      >
        Loading our story
      </motion.p>
    </motion.div>
  );
}
